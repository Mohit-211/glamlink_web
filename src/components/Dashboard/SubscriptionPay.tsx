'use client';
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import {
    CreditCard,
    Lock,
    Loader2,
    CheckCircle,
    AlertCircle,
    X,
    Package,
    ChevronRight,
    Truck,
    MapPin,
    Pencil,
} from 'lucide-react';
import {
    addShippingAddress,
    CreateSubscription,
    SelectAddressApi,
    addNewAddress,
    editAddress,
    getAllUserAddress,
    getAllStates,
    getCitiesByState,
} from '../../api/Api';
import { PurchaseType } from './Purchasetypes';
import { useRouter } from 'next/navigation';
// ── Stripe init ──────────────────────────────────────────────────────────────
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? ''
);
const ELEMENT_STYLE = {
    style: {
        base: {
            fontSize: '14px',
            color: '#0f172a',
            fontFamily: 'inherit',
            '::placeholder': { color: '#94a3b8' },
        },
        invalid: { color: '#ef4444' },
    },
};
// ── Error helpers ─────────────────────────────────────────────────────────────
// API errors come back shaped like:
// { success: false, status: 400, message: "NFC card already purchased", data: "" }
// Axios wraps that in err.response.data, but plain JS errors (Stripe, etc.)
// only carry err.message — this pulls whichever is actually available.
const getApiErrorMessage = (err: any, fallback: string): string => {
    const data = err?.response?.data;
    if (data && typeof data === 'object' && typeof data.message === 'string' && data.message.trim()) {
        return data.message;
    }
    if (typeof err?.message === 'string' && err.message.trim()) {
        return err.message;
    }
    return fallback;
};
const isAlreadyPurchasedError = (message: string): boolean =>
    message.toLowerCase().includes('already purchased');
// ── Types ────────────────────────────────────────────────────────────────────
interface ShippingData {
    nfc_price?: number;
    subscription_price?: number;
    shipping_amount: number;
    carrier: string;
    service: string;
    total_due_today: number;
}
interface AddressFormData {
    address_line_1: string;
    address_lat: string;
    address_long: string;
    state_id: string;
    city_id: string;
    postal_code: string;
}
const EMPTY_ADDRESS: AddressFormData = {
    address_line_1: '',
    address_lat: '',
    address_long: '',
    state_id: '',
    city_id: '',
    postal_code: '',
};
interface StateItem {
    id: number;
    name: string;
}
interface CityItem {
    id: number;
    name: string;
}
interface Address {
    id: string | number;
    address_line_1: string;
    postal_code: string;
    city_name?: string;
    state_name?: string;
    user_city?: { id: number; name: string };
    user_state?: { id: number; name: string };
    is_default?: boolean;
}
// ── Step 1a: Add / Edit Address Form ─────────────────────────────────────────
interface AddressStepProps {
    businessCardId?: string | number | null;
    editingAddress?: Address | null;
    onSaved: () => void;
    onCancel: () => void;
}
function AddressStep({ businessCardId, editingAddress, onSaved, onCancel }: AddressStepProps) {
    const isEditing = !!editingAddress;
    const [form, setForm] = useState<AddressFormData>(() => {
        if (editingAddress) {
            return {
                address_line_1: editingAddress.address_line_1 || '',
                address_lat: '',
                address_long: '',
                state_id: editingAddress.user_state?.id ? String(editingAddress.user_state.id) : '',
                city_id: editingAddress.user_city?.id ? String(editingAddress.user_city.id) : '',
                postal_code: editingAddress.postal_code || '',
            };
        }
        return EMPTY_ADDRESS;
    });
    const [states, setStates] = useState<StateItem[]>([]);
    const [cities, setCities] = useState<CityItem[]>([]);
    const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const res = await getAllStates();
                setStates(res?.data?.all_state || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStates();
    }, []);
    useEffect(() => {
        if (!form.state_id) {
            setCities([]);
            return;
        }
        const fetchCities = async () => {
            try {
                const res = await getCitiesByState(form.state_id);
                setCities(res?.data?.all_city || res?.all_city || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCities();
    }, [form.state_id]);
    const isValid =
        form.address_line_1.trim() &&
        form.state_id &&
        form.city_id &&
        form.postal_code.trim();
    const handleSubmit = async () => {
        if (!isValid) {
            setErrorMsg('Please fill in all required fields.');
            setStatus('error');
            return;
        }
        setStatus('saving');
        setErrorMsg('');
        try {
            const payload = {
                address_line_1: form.address_line_1.trim(),
                ...(form.address_lat && { address_lat: parseFloat(form.address_lat) }),
                ...(form.address_long && { address_long: parseFloat(form.address_long) }),
                state_id: parseInt(form.state_id),
                city_id: parseInt(form.city_id),
                postal_code: form.postal_code.trim(),
            };
            const response =
                isEditing && editingAddress
                    ? await editAddress(editingAddress.id, payload)
                    : await addNewAddress(payload);
            if (response?.success === false) {
                setErrorMsg(
                    response?.message || 'Please enter a valid address, city, state and PIN code.'
                );
                setStatus('error');
                return;
            }
            onSaved();
        } catch (err: any) {
            const rawMsg = err?.response?.data?.message;
            const friendlyMsg =
                rawMsg ===
                    'Address validation failed: Unable to find a valid city, state or 5-digit zip. Please check the accuracy of the submitted address.'
                    ? 'Please enter a valid address, city, state and Postal Code'
                    : rawMsg;
            setErrorMsg(friendlyMsg || (isEditing ? 'Could not update address.' : 'Could not save address.'));
            setStatus('error');
        }
    };
    return (
        <div className="space-y-4">
            <div className="flex items-start gap-2 rounded-xl border border-primary/20 bg-accent/40 px-4 py-3">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-[12px] text-muted-foreground">
                    {isEditing
                        ? 'Update your shipping address details below.'
                        : 'We need a shipping address before we can calculate delivery costs.'}
                </p>
            </div>
            {status === 'error' && errorMsg && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{errorMsg}</p>
                </div>
            )}
            <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Address line 1
                </label>
                <input
                    type="text"
                    value={form.address_line_1}
                    onChange={(e) => setForm((f) => ({ ...f, address_line_1: e.target.value }))}
                    placeholder="e.g. 3730 S Las Vegas Blvd"
                    disabled={status === 'saving'}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition disabled:opacity-50"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        State
                    </label>
                    <select
                        value={form.state_id}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, state_id: e.target.value, city_id: '' }))
                        }
                        disabled={status === 'saving'}
                        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition disabled:opacity-50"
                    >
                        <option value="">Select State</option>
                        {states.map((state) => (
                            <option key={state.id} value={String(state.id)}>
                                {state.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        City
                    </label>
                    <select
                        value={form.city_id}
                        onChange={(e) => setForm((prev) => ({ ...prev, city_id: e.target.value }))}
                        disabled={!form.state_id || status === 'saving'}
                        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition disabled:opacity-50"
                    >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                            <option key={city.id} value={String(city.id)}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    ZIP Code
                </label>
                <input
                    value={form.postal_code}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            postal_code: e.target.value.toUpperCase(),
                        }))
                    }
                    placeholder="Enter ZIP Code"
                    inputMode="text"
                    maxLength={10}
                    disabled={status === "saving"}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition disabled:opacity-50"
                />
            </div>
            <div className="flex gap-3">
                <button
                    onClick={onCancel}
                    disabled={status === 'saving'}
                    className="flex-1 rounded-xl border border-border bg-secondary/60 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={status === 'saving'}
                    className="flex-1 btn-primary !rounded-xl !py-2.5 !text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                    {status === 'saving' ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {isEditing ? 'Updating…' : 'Saving…'}
                        </>
                    ) : (
                        <>
                            {isEditing ? 'Update & Continue' : 'Save & Continue'}
                            <ChevronRight className="h-4 w-4" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
// ── Step 1: Select Address & Shipping Summary ────────────────────────────────
interface ShippingStepProps {
    businessCardId?: string | number | null;
    onContinue: (shipping: ShippingData) => void;
    onCancel: () => void;
    onNeedsAddress: () => void;
    onEditAddress: (address: Address) => void;
    purchaseType?: PurchaseType;
}
function ShippingStep({ businessCardId, onContinue, onCancel, onNeedsAddress, onEditAddress, purchaseType }: ShippingStepProps) {
    const [status, setStatus] = useState<
        'loading' | 'select-address' | 'calculating' | 'ready' | 'error' | 'no-address' | 'already-purchased'
    >('loading');
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | number | null>(null);
    const [shipping, setShipping] = useState<ShippingData | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    useEffect(() => {
        let cancelled = false;
        const loadAddresses = async () => {
            setStatus('loading');
            setErrorMsg('');
            try {
                const res = await getAllUserAddress();
                const list: Address[] = res?.addresses ?? res?.data ?? res ?? [];
                if (cancelled) return;
                if (!Array.isArray(list) || list.length === 0) {
                    setStatus('no-address');
                    return;
                }
                setAddresses(list);
                const defaultAddr = list.find((a) => a.is_default) ?? list[0];
                setSelectedAddressId(defaultAddr.id);
                setStatus('select-address');
            } catch (err) {
                if (cancelled) return;
                console.error('Failed to load addresses:', err);
                setErrorMsg('Could not load your saved addresses.');
                setStatus('error');
            }
        };
        loadAddresses();
        return () => {
            cancelled = true;
        };
    }, [businessCardId]);
    const handleCalculateShipping = async () => {
        if (!selectedAddressId || !businessCardId) return;
        setStatus('calculating');
        setErrorMsg('');
        try {
            await SelectAddressApi({
                business_card_id: String(businessCardId),
                user_address_id: selectedAddressId,
            });
            const res = await addShippingAddress({
                business_card_id: String(businessCardId),
                // purchase_type: purchaseType,
            });
            setShipping(res.data);
            setStatus('ready');
        } catch (err: any) {
            const msg = getApiErrorMessage(err, 'Could not calculate shipping.');
            const lowerMsg = msg.toLowerCase();
            if (
                lowerMsg.includes('address not found') ||
                lowerMsg.includes('please verify address first')
            ) {
                setStatus('no-address');
            } else if (isAlreadyPurchasedError(msg)) {
                setErrorMsg(msg);
                setStatus('already-purchased');
            } else {
                setErrorMsg(msg);
                setStatus('error');
            }
        }
    };
    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading your addresses…</p>
            </div>
        );
    }
    if (status === 'already-purchased') {
        return (
            <div className="space-y-4">
                <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                        <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground">Already purchased</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {errorMsg || "You've already purchased an NFC card for this business card."}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onCancel}
                    className="w-full btn-primary !rounded-xl !py-2.5 !text-sm"
                >
                    Close
                </button>
            </div>
        );
    }
    if (status === 'no-address') {
        return (
            <div className="space-y-5">
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">Where should we ship your NFC card?</p>
                </div>
                <button
                    onClick={onNeedsAddress}
                    className="w-full rounded-xl border border-dashed border-border py-4 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-accent/30 transition-colors flex items-center justify-center gap-2"
                >
                    <span className="text-base leading-none">+</span>
                    Add a new address
                </button>
                <div className="flex gap-3 pt-1">
                    <button
                        onClick={onCancel}
                        className="flex-1 rounded-xl border border-border bg-secondary/60 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        disabled
                        className="flex-1 btn-primary !rounded-xl !py-2.5 !text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        Continue to order
                    </button>
                </div>
            </div>
        );
    }
    if (status === 'select-address') {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">Where should we ship your NFC card?</p>
                </div>
                {errorMsg && (
                    <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{errorMsg}</p>
                    </div>
                )}
                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                    {addresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                            <label
                                key={addr.id}
                                className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${isSelected
                                    ? 'border-primary bg-accent/40'
                                    : 'border-border bg-card hover:bg-secondary/40'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="shipping-address"
                                    checked={isSelected}
                                    onChange={() => setSelectedAddressId(addr.id)}
                                    className="mt-1 h-4 w-4 accent-primary flex-shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-foreground truncate">
                                        {addr.address_line_1}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {addr.user_city?.name || addr.city_name}
                                        {', '}
                                        {addr.user_state?.name || addr.state_name} · {addr.postal_code}
                                    </p>
                                    {addr.is_default && (
                                        <span className="inline-block mt-1 text-[10px] font-semibold text-primary">
                                            Default address
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onEditAddress(addr);
                                    }}
                                    className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline underline-offset-2 flex-shrink-0"
                                >
                                    <Pencil className="h-3 w-3" />
                                    Edit
                                </button>
                            </label>
                        );
                    })}
                </div>
                <button
                    onClick={onNeedsAddress}
                    className="w-full rounded-xl border border-dashed border-border py-3.5 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-accent/30 transition-colors flex items-center justify-center gap-2"
                >
                    <span className="text-base leading-none">+</span>
                    Add a new address
                </button>
                <div className="flex gap-3 pt-1">
                    <button
                        onClick={onCancel}
                        className="flex-1 rounded-xl border border-border bg-secondary/60 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCalculateShipping}
                        disabled={!selectedAddressId}
                        className="flex-1 btn-primary !rounded-xl !py-2.5 !text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        Continue to order
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        );
    }
    if (status === 'calculating') {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Calculating shipping fees…</p>
            </div>
        );
    }
    if (status === 'error') {
        return (
            <div className="space-y-4">
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{errorMsg}</p>
                </div>
                <button
                    onClick={() => setStatus('select-address')}
                    className="w-full rounded-xl border border-border bg-secondary/60 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                    Try Another Address
                </button>
            </div>
        );
    }
    const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
    return (
        <div className="space-y-5">
            {selectedAddress && (
                <div className="flex items-start justify-between gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-3">
                    <div className="flex items-start gap-2 min-w-0">
                        <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">
                                {selectedAddress.address_line_1}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                                {selectedAddress.user_city?.name || selectedAddress.city_name}
                                {', '}
                                {selectedAddress.user_state?.name || selectedAddress.state_name} ·{' '}
                                {selectedAddress.postal_code}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setStatus('select-address')}
                        className="text-[11px] font-semibold text-primary hover:underline underline-offset-2 flex-shrink-0"
                    >
                        Change
                    </button>
                </div>
            )}
            <div className="rounded-xl border border-border bg-secondary/30 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                    <Truck className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-foreground">
                            {shipping?.carrier} · {shipping?.service}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                            Estimated delivery method
                        </p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                        ${shipping?.shipping_amount.toFixed(2)}
                    </p>
                </div>
                <div className="px-4 py-3 space-y-2">
                    {shipping?.nfc_price !== undefined && (
                        <div className="flex justify-between text-[13px] text-muted-foreground">
                            <span>NFC Card</span>
                            <span>${shipping.nfc_price.toFixed(2)}</span>
                        </div>
                    )}
                    {shipping?.subscription_price !== undefined && (
                        <div className="flex justify-between text-[13px] text-muted-foreground">
                            <span>Subscription</span>
                            <span>${shipping.subscription_price.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-[13px] text-muted-foreground">
                        <span>Shipping ({shipping?.carrier})</span>
                        <span>${shipping?.shipping_amount.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between text-sm font-bold text-foreground">
                        <span>Total due today</span>
                        <span className="text-primary">
                            ${shipping?.total_due_today.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex gap-3">
                <button
                    onClick={onCancel}
                    className="flex-1 rounded-xl border border-border bg-secondary/60 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={() => onContinue(shipping!)}
                    className="flex-1 btn-primary !rounded-xl !py-2.5 !text-sm flex items-center justify-center gap-2"
                >
                    Continue to Payment
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
// ── Step 2: Payment Form ──────────────────────────────────────────────────────
interface PaymentStepProps {
    shipping?: ShippingData | null;
    businessCardId?: string | number | null;
    allowedPurchaseType?: PurchaseType;
    onSuccess: () => void;
    onBack: () => void;
    onClose?: () => void;
}
function PaymentStep({
    shipping,
    businessCardId,
    allowedPurchaseType,
    onSuccess,
    onBack,
    onClose,
}: PaymentStepProps) {
    const router = useRouter()
    const stripe = useStripe();
    const elements = useElements();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [alreadyPurchased, setAlreadyPurchased] = useState(false);
    const [cardName, setCardName] = useState('');
    const totalAmount = shipping ? shipping.total_due_today : 4.99;
    const handlePay = async () => {
        if (!stripe || !elements) return;
        setStatus('loading');
        setErrorMsg('');
        setAlreadyPurchased(false);
        try {
            const cardNumber = elements.getElement(CardNumberElement);
            if (!cardNumber) {
                throw new Error('Card element not found');
            }
            const response = await CreateSubscription({
                business_card_id: Number(businessCardId),
                // purchase_type: allowedPurchaseType,
            });
            const clientSecret =
                response?.data?.clientSecret ||
                response?.clientSecret ||
                response?.client_secret;
            if (!clientSecret) {
                throw new Error('Client secret not received from server.');
            }
            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardNumber,
                    billing_details: {
                        name: cardName,
                    },
                },
            });
            if (paymentResult.error) {
                throw new Error(paymentResult.error.message);
            }
            if (
                paymentResult.paymentIntent &&
                paymentResult.paymentIntent.status === 'succeeded'
            ) {
                setStatus('success');
                setTimeout(() => {
                    onSuccess();
                }, 1500);
            } else {
                throw new Error('Payment was not completed successfully.');
            }
        } catch (err: any) {
            console.error(err);
            const msg = getApiErrorMessage(err, 'Payment processing failed.');
            setStatus('error');
            setErrorMsg(msg);
            setAlreadyPurchased(isAlreadyPurchasedError(msg));
        }
    };
if (status === 'success') {
    return (
        <div className="flex flex-col items-center justify-center gap-5 py-14 text-center animate-fade-up">
            <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-primary/15 animate-pulse-slow" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                    <CheckCircle className="h-8 w-8 text-primary" strokeWidth={2.5} />
                </div>
            </div>
            <div className="space-y-1.5">
                <p className="text-lg font-semibold text-foreground">
                    Payment successful!
                </p>
               
            </div>
            
        </div>
    );
}
    if (alreadyPurchased) {
        return (
            <div className="space-y-4">
                <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                        <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground">Already purchased</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {errorMsg || "You've already purchased an NFC card for this business card."}
                        </p>
                    </div>
                </div>
             <button
    onClick={() => {
        onClose?.();
        router.push('/dashboard?tab=plans');
    }}
    className="w-full btn-primary !rounded-xl !py-2.5 !text-sm"
>
    Close
</button>
            </div>
        );
    }
    const includesSubscription = !!allowedPurchaseType && ['NFC_ONLY', 'SUBSCRIPTION_ONLY', 'NFC_WITH_SUBSCRIPTION'].includes(
        allowedPurchaseType
    );
    const payLabel =
        allowedPurchaseType === 'NFC_ONLY'
            ? `Pay $${totalAmount.toFixed(2)} for Keychain`
            : includesSubscription
                ? `Pay $${totalAmount.toFixed(2)} & Start Subscription`
                : `Pay $${totalAmount.toFixed(2)} & Complete Order`;
    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-primary/20 bg-accent/40 px-4 py-3.5 space-y-1">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                        {shipping ? 'Order Summary' : 'Subscription Plan'}
                    </span>
                    <span className="text-sm font-bold text-primary">
                        {shipping ? `$${totalAmount.toFixed(2)}` : '$4.99 / month'}
                    </span>
                </div>
                <p className="text-[12px] text-muted-foreground">
                    {shipping
                        ? `${shipping.carrier} · ${shipping.service} · Total due today $${totalAmount.toFixed(2)}`
                        : 'Unlocks all digital access card features instantly. Cancel anytime.'}
                </p>
            </div>
            <p className="text-sm font-semibold text-foreground pt-1">Enter your card details</p>
            <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Name on card"
                className="w-full rounded-xl border border-border bg-card px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            />
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-3 focus-within:ring-2 focus-within:ring-primary/30 transition">
                <div className="flex-1">
                    <CardNumberElement
                        options={{
                            ...ELEMENT_STYLE,
                            placeholder: 'Card number (16 digits)',
                        }}
                    />
                </div>
                <CreditCard className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-card px-3.5 py-3 focus-within:ring-2 focus-within:ring-primary/30 transition">
                    <CardExpiryElement options={ELEMENT_STYLE} />
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-3 focus-within:ring-2 focus-within:ring-primary/30 transition">
                    <div className="flex-1">
                        <CardCvcElement options={ELEMENT_STYLE} />
                    </div>
                    <Lock className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                </div>
            </div>
            {status === 'error' && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{errorMsg}</p>
                </div>
            )}
            <div className="flex gap-3 pt-1">
                {shipping && (
                    <button
                        onClick={onBack}
                        disabled={status === 'loading'}
                        className="flex-1 rounded-xl border border-border bg-secondary/60 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                    >
                        Back
                    </button>
                )}
                <button
                    onClick={handlePay}
                    disabled={status === 'loading' || !stripe}
                    className="flex-1 btn-primary !rounded-full !py-3 !text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                    {status === 'loading' ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing…
                        </>
                    ) : (
                        <>
                            <Lock className="h-3.5 w-3.5" />
                            {payLabel}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
// ── Main Subscription Payment Modal ──────────────────────────────────────────
interface ModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    businessCardId?: string | number | null;
    allowedPurchaseType?: PurchaseType;
    onGoToAddresses?: () => void;
}
export function SubscriptionPaymentModal({
    open,
    onClose,
    onSuccess,
    businessCardId,
    allowedPurchaseType
}: ModalProps) {
    const [step, setStep] = useState<'shipping' | 'address' | 'payment'>('shipping');
    const [shippingData, setShippingData] = useState<ShippingData | null>(null);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    // NFC purchases always go through Address -> Shipping -> Payment steps
    const requiresShipping = !!allowedPurchaseType && ['NFC_ONLY', 'NFC_WITH_SUBSCRIPTION'].includes(allowedPurchaseType);
    useEffect(() => {
        if (open) {
            setStep(requiresShipping ? 'shipping' : 'payment');
            setShippingData(null);
            setEditingAddress(null);
        }
    }, [open, requiresShipping]);
    if (!open) return null;
    const handleShippingContinue = (data: ShippingData) => {
        setShippingData(data);
        setStep('payment');
    };
    const handleAddressSaved = () => {
        setEditingAddress(null);
        setStep('shipping');
    };
    const handleEditAddress = (address: Address) => {
        setEditingAddress(address);
        setStep('address');
    };
    const handleAddressCancel = () => {
        setEditingAddress(null);
        setStep('shipping');
    };
    const handleSuccess = () => {
        onSuccess?.();
        onClose();
    };
    const STEP_LABELS = {
        shipping: { num: 1, title: 'Shipping Address', sub: 'Select address to calculate shipping' },
        address: editingAddress
            ? { num: 1, title: 'Edit Address', sub: 'Update your delivery details' }
            : { num: 1, title: 'Add Address', sub: 'Add a delivery address to continue' },
        payment: { num: requiresShipping ? 2 : 1, title: 'Payment', sub: 'Enter card payment details' },
    };
    const current = STEP_LABELS[step];
    const isSubscribeOnlyPayment = step === 'payment' && !requiresShipping;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="card-glamlink w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {isSubscribeOnlyPayment ? (
                    <div className="mb-5 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                                <CreditCard className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-foreground">Subscribe</h2>
                                <p className="text-[12px] text-muted-foreground">Digital Business Card Subscription</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-secondary transition-colors">
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                    </div>
                ) : (step === 'shipping' || step === 'address') && requiresShipping ? (
                    <div className="mb-4 pb-4 border-b border-border flex items-center justify-between">
                        <h2 className="text-base font-semibold text-foreground">Buy NFC Card</h2>
                        <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-secondary transition-colors">
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                    </div>
                ) : (
                    <div className="mb-5 flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider">
                                    Step {current.num} of {requiresShipping ? 2 : 1}
                                </span>
                            </div>
                            <h2 className="text-base font-semibold text-foreground">{current.title}</h2>
                            <p className="text-[12px] text-muted-foreground mt-0.5">{current.sub}</p>
                        </div>
                        <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-secondary transition-colors">
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                    </div>
                )}
                {/* Progress bar */}
                {requiresShipping && step === 'payment' && (
                    <div className="flex gap-1.5 mb-6">
                        <div className="h-1 flex-1 rounded-full bg-primary" />
                        <div className={`h-1 flex-1 rounded-full transition-colors ${step === 'payment' ? 'bg-primary' : 'bg-border'}`} />
                    </div>
                )}
                {step === 'shipping' && (
                    <ShippingStep
                        businessCardId={businessCardId}
                        onContinue={handleShippingContinue}
                        onCancel={onClose}
                        onNeedsAddress={() => setStep('address')}
                        onEditAddress={handleEditAddress}
                        purchaseType={allowedPurchaseType}
                    />
                )}
                {step === 'address' && (
                    <AddressStep
                        businessCardId={businessCardId}
                        editingAddress={editingAddress}
                        onSaved={handleAddressSaved}
                        onCancel={handleAddressCancel}
                    />
                )}
                {step === 'payment' && (
                    <Elements stripe={stripePromise}>
                        <PaymentStep
                            shipping={shippingData}
                            businessCardId={businessCardId}
                            allowedPurchaseType={allowedPurchaseType}
                            onSuccess={handleSuccess}
                            onClose={onClose}
                            onBack={() => {
                                if (requiresShipping) {
                                    setStep('shipping');
                                } else {
                                    onClose();
                                }
                            }}
                        />
                    </Elements>
                )}
            </div>
        </div>
    );
}