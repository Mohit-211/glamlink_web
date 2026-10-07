'use client';
import React, { useState } from 'react';
import { Eye, EyeOff, Check, ShieldCheck, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { PageHeader, btn, field } from './shell/ui';
import { ChangePassword } from '../../api/Api';
import { useRouter } from 'next/navigation';
type FieldName = 'old_password' | 'new_password' | 'confirm_password';
interface FormState {
    old_password: string;
    new_password: string;
    confirm_password: string;
}
const INITIAL_STATE: FormState = {
    old_password: '',
    new_password: '',
    confirm_password: '',
};
/**
 * Standalone "Change Password" tab for the dashboard.
 * Calls the ChangePassword API (user/auth/reset-password) with the
 * old/new/confirm password payload it expects.
 */
export default function ChangePasswordTab() {
    const router = useRouter();
    const [form, setForm] = useState<FormState>(INITIAL_STATE);
    const [showPassword, setShowPassword] = useState<Record<FieldName, boolean>>({
        old_password: false,
        new_password: false,
        confirm_password: false,
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const handleChange = (field: FieldName) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        // Clear stale error/success state as soon as the user starts editing again.
        if (error) setError('');
        if (success) setSuccess(false);
    };
    const toggleVisibility = (field: FieldName) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };
    const validate = (): string | null => {
        if (!form.old_password) return 'Please enter your current password.';
        if (!form.new_password) return 'Please enter a new password.';
        if (form.new_password.length < 8) return 'New password must be at least 8 characters.';
        if (form.new_password === form.old_password) {
            return 'New password must be different from your current password.';
        }
        if (form.new_password !== form.confirm_password) {
            return 'New password and confirm password do not match.';
        }
        return null;
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }
        try {
            setSubmitting(true);
            await ChangePassword({
                old_password: form.old_password,
                new_password: form.new_password,
                confirm_password: form.confirm_password,
            });
            setSuccess(true);
            setForm(INITIAL_STATE);
            setTimeout(() => {
                localStorage.removeItem("GlamlinkaccessToken");
                localStorage.removeItem("GlamlinkrefreshToken");
                // Remove any other auth-related keys
                // localStorage.removeItem("user");
                // localStorage.removeItem("profile");
                sessionStorage.clear();
                window.dispatchEvent(new Event("auth-change"));
                router.replace("/login");
            }, 1000);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                'Failed to change password. Please try again.'
            );
        } finally {
            setSubmitting(false);
        }
    };
    const fields: { name: FieldName; label: string; placeholder: string; autoComplete: string }[] = [
        {
            name: 'old_password',
            label: 'Current Password',
            placeholder: 'Enter your current password',
            autoComplete: 'current-password',
        },
        {
            name: 'new_password',
            label: 'New Password',
            placeholder: 'Enter a new password',
            autoComplete: 'new-password',
        },
        {
            name: 'confirm_password',
            label: 'Confirm New Password',
            placeholder: 'Re-enter the new password',
            autoComplete: 'new-password',
        },
    ];
    const requirements = [
        { label: 'At least 8 characters', met: form.new_password.length >= 8 },
        { label: 'Different from your current password', met: !!form.new_password && form.new_password !== form.old_password },
        { label: 'Both new passwords match', met: !!form.confirm_password && form.new_password === form.confirm_password },
    ];
    return (
        <div>
            <PageHeader title="Change Password" description="Update the password you use to sign in to Glamlink." />
            <section className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                        <ShieldCheck className="h-5 w-5" />
                    </span>
                    <div>
                        <h2 className="text-base font-semibold text-foreground">Account security</h2>
                        <p className="text-xs text-muted-foreground">You&apos;ll be signed out and asked to log in with your new password.</p>
                    </div>
                </div>
                {success && (
                    <div role="status" className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        Password changed successfully. Signing you out…
                    </div>
                )}
                {error && (
                    <div role="alert" className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {fields.map(({ name, label, placeholder, autoComplete }) => (
                        <div key={name}>
                            <label htmlFor={name} className={field.label}>
                                {label}
                            </label>
                            <div className="relative">
                                <input
                                    id={name}
                                    type={showPassword[name] ? 'text' : 'password'}
                                    value={form[name]}
                                    onChange={handleChange(name)}
                                    placeholder={placeholder}
                                    autoComplete={autoComplete}
                                    disabled={submitting}
                                    className={`${field.input} pr-12`}
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleVisibility(name)}
                                    className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                    aria-label={showPassword[name] ? 'Hide password' : 'Show password'}
                                    aria-pressed={showPassword[name]}
                                    aria-controls={name}
                                >
                                    {showPassword[name] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    ))}
                    <ul className="space-y-1.5 rounded-xl bg-secondary/50 px-4 py-3" aria-label="Password requirements">
                        {requirements.map(({ label, met }) => (
                            <li key={label} className={`flex items-center gap-2 text-xs transition-colors ${met ? 'text-emerald-700' : 'text-muted-foreground'}`}>
                                <span
                                    className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${met ? 'bg-emerald-500 text-white' : 'border border-border bg-background'}`}
                                    aria-hidden="true"
                                >
                                    {met && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                                </span>
                                {label}
                                <span className="sr-only">{met ? '(met)' : '(not met)'}</span>
                            </li>
                        ))}
                    </ul>
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`${btn.primary} h-11 w-full`}
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            'Update Password'
                        )}
                    </button>
                </form>
            </section>
        </div>
    );
}
