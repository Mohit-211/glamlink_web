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
} from 'lucide-react';
import { addShippingAddress, CreateSubscription } from '../../api/Api';
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
// ── Types ────────────────────────────────────────────────────────────────────
interface ShippingData {
    shipping_amount: number;
    carrier: string;
    service: string;
    total_due_today: number;
}
// ── Step 1: Shipping Summary ─────────────────────────────────────────────────
interface ShippingStepProps {
    businessCardId: string;
    onContinue: (shipping: ShippingData) => void;
    onCancel: () => void;
    onGoToAddresses: () => void;
}
function ShippingStep({ businessCardId, onContinue, onCancel, onGoToAddresses }: ShippingStepProps) {
    const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'no-address'>('loading');
    const [shipping, setShipping] = useState<ShippingData | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    useEffect(() => {
        const fetchShipping = async () => {
            try {
                setStatus('loading');
                const res = await addShippingAddress({ business_card_id: businessCardId });
                setShipping(res.data);
                setStatus('ready');
            } catch (err: any) {
                const msg: string = err?.response?.data?.message ?? '';
              const lowerMsg = msg?.toLowerCase() || '';

if (
  lowerMsg.includes('address not found') ||
  lowerMsg.includes('please verify address first')
) {
  setStatus('no-address');
} else {
  setErrorMsg(msg || 'Could not calculate shipping.');
  setStatus('error');
}
            }
        };
        fetchShipping();
    }, [businessCardId]);
    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Calculating shipping…</p>
            </div>
        );
    }
    if (status === 'no-address') {
        return (
            <div className="flex flex-col items-center gap-5 py-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 border border-amber-200">
                    <MapPin className="h-8 w-8 text-amber-500" />
                </div>
                <div>
                    <p className="text-base font-semibold text-foreground">No address found</p>
                    <p className="text-sm text-muted-foreground mt-1.5 max-w-[260px] mx-auto">
                        Please add a shipping address before completing your purchase.
                    </p>
                </div>
                <div className="flex flex-col gap-2.5 w-full">
                    <button
                        onClick={() => { onCancel(); onGoToAddresses(); }}
                        className="w-full btn-primary !rounded-xl !py-2.5 !text-sm flex items-center justify-center gap-2"
                    >
                        <MapPin className="h-4 w-4" />
                        Add Address Now
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full rounded-xl border border-border bg-secondary/60 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                    >
                        Cancel
                    </button>
                </div>
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
                    onClick={onCancel}
                    className="w-full rounded-xl border border-border bg-secondary/60 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                    Close
                </button>
            </div>
        );
    }
    return (
        <div className="space-y-5">
            {/* Shipping breakdown */}
            <div className="rounded-xl border border-border bg-secondary/30 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                    <Truck className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-foreground">{shipping!.carrier} · {shipping!.service}</p>
                        <p className="text-[11px] text-muted-foreground">Estimated delivery method</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">${shipping!.shipping_amount.toFixed(2)}</p>
                </div>
                <div className="px-4 py-3 space-y-2">
                    <div className="flex justify-between text-[13px] text-muted-foreground">
                        <span>Subscription</span>
                        <span>${(shipping!.total_due_today - shipping!.shipping_amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[13px] text-muted-foreground">
                        <span>Shipping ({shipping!.carrier})</span>
                        <span>${shipping!.shipping_amount.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between text-sm font-bold text-foreground">
                        <span>Total due today</span>
                        <span className="text-primary">${shipping!.total_due_today.toFixed(2)}</span>
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
// ── Step 2: Stripe Payment Form ──────────────────────────────────────────────
interface PaymentStepProps {
    shipping: ShippingData;
    businessCardId: string;
    onSuccess: () => void;
    onBack: () => void;
}
function PaymentStep({
    shipping,
    businessCardId,
    onSuccess,
    onBack,
}: PaymentStepProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [cardName, setCardName] = useState('');
    const handlePay = async () => {
        if (!stripe || !elements) return;

        setStatus('loading');
        setErrorMsg('');

        try {
            const cardNumber = elements.getElement(CardNumberElement);

            if (!cardNumber) {
                throw new Error('Card element not found');
            }

            const response = await CreateSubscription({
                business_card_id: Number(businessCardId),
            });

            console.log('Subscription Response:', response);

            const clientSecret =
                response?.data?.clientSecret ||
                response?.clientSecret ||
                response?.client_secret;

            if (!clientSecret) {
                throw new Error('Client secret not received');
            }

            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardNumber,
                    billing_details: {
                        name: cardName,
                    },
                },
            });

            console.log('Stripe Result:', paymentResult);

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
                throw new Error('Payment not completed');
            }
        } catch (err: any) {
            console.error(err);
            setStatus('error');
            setErrorMsg(err?.message || 'Payment failed');
        }
    };
    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <CheckCircle className="h-14 w-14 text-green-500" />
                <div>
                    <p className="text-base font-semibold text-foreground">Payment successful!</p>
                    <p className="text-sm text-muted-foreground mt-1">Your subscription is now active.</p>
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-5">
            {/* Total reminder */}
            <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-accent/40 px-4 py-3">
                <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <div>
                        <p className="text-[11px] text-muted-foreground">Total due today</p>
                        <p className="text-sm font-bold text-foreground">${shipping.total_due_today.toFixed(2)}</p>
                    </div>
                </div>
                <span className="text-[11px] text-muted-foreground">{shipping.carrier} · {shipping.service}</span>
            </div>
            {/* Cardholder name */}
            <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Name on card
                </label>
                <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                />
            </div>
            {/* Card number */}
            <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Card number
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 focus-within:ring-2 focus-within:ring-primary/30 transition">
                    <CreditCard className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <div className="flex-1">
                        <CardNumberElement options={ELEMENT_STYLE} />
                    </div>
                </div>
            </div>
            {/* Expiry + CVC */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Expiry</label>
                    <div className="rounded-xl border border-border bg-card px-3 py-2.5 focus-within:ring-2 focus-within:ring-primary/30 transition">
                        <CardExpiryElement options={ELEMENT_STYLE} />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">CVC</label>
                    <div className="rounded-xl border border-border bg-card px-3 py-2.5 focus-within:ring-2 focus-within:ring-primary/30 transition">
                        <CardCvcElement options={ELEMENT_STYLE} />
                    </div>
                </div>
            </div>
            {/* Error */}
            {status === 'error' && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{errorMsg}</p>
                </div>
            )}
            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    disabled={status === 'loading'}
                    className="flex-1 rounded-xl border border-border bg-secondary/60 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                >
                    Back
                </button>
                <button
                    onClick={handlePay}
                    disabled={status === 'loading' || !stripe}
                    className="flex-1 btn-primary !rounded-xl !py-2.5 !text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                    {status === 'loading' ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing…
                        </>
                    ) : (
                        <>
                            <Lock className="h-3.5 w-3.5" />
                            Pay ${shipping.total_due_today.toFixed(2)}
                        </>
                    )}
                </button>
            </div>
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <Lock className="h-3 w-3" />
                Secured by Stripe · Your card data never touches our servers
            </p>
        </div>
    );
}
// ── Modal (orchestrates both steps) ─────────────────────────────────────────
interface ModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    onGoToAddresses?: () => void;
    businessCardId: string;
}
export function SubscriptionPaymentModal({ open, onClose, onSuccess, onGoToAddresses, businessCardId }: ModalProps) {
    const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
    const [shippingData, setShippingData] = useState<ShippingData | null>(null);
    useEffect(() => {
        if (open) {
            setStep('shipping');
            setShippingData(null);
        }
    }, [open]);
    if (!open) return null;
    const handleShippingContinue = (data: ShippingData) => {
        setShippingData(data);
        setStep('payment');
    };
    const handleSuccess = () => {
        onSuccess?.();
        onClose();
    };
    const STEP_LABELS = {
        shipping: { num: 1, title: 'Shipping Summary', sub: 'Review costs before paying' },
        payment: { num: 2, title: 'Payment', sub: 'Enter your card details' },
    };
    const current = STEP_LABELS[step];
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
                <div className="mb-5 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider">
                                Step {current.num} of 2
                            </span>
                        </div>
                        <h2 className="text-base font-semibold text-foreground">{current.title}</h2>
                        <p className="text-[12px] text-muted-foreground mt-0.5">{current.sub}</p>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-secondary transition-colors">
                        <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                </div>
                {/* Progress bar */}
                <div className="flex gap-1.5 mb-6">
                    <div className="h-1 flex-1 rounded-full bg-primary" />
                    <div className={`h-1 flex-1 rounded-full transition-colors ${step === 'payment' ? 'bg-primary' : 'bg-border'}`} />
                </div>
                {step === 'shipping' && (
                    <ShippingStep
                        businessCardId={businessCardId}
                        onContinue={handleShippingContinue}
                        onCancel={onClose}
                        onGoToAddresses={() => { onClose(); onGoToAddresses?.(); }}
                    />
                )}
                {step === 'payment' && shippingData && (
                    <Elements stripe={stripePromise}>
                        <PaymentStep
                            shipping={shippingData}
                            businessCardId={businessCardId}
                            onSuccess={handleSuccess}
                            onBack={() => setStep('shipping')}
                        />
                    </Elements>
                )}
            </div>
        </div>
    );
}