'use client';
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
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
    return (
        <div className="max-w-md">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Update the password used to sign in to your account
                </p>
            </div>
            {success && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    Password changed successfully.
                </div>
            )}
            {error && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map(({ name, label, placeholder, autoComplete }) => (
                    <div key={name}>
                        <label htmlFor={name} className="mb-1.5 block text-xs font-medium text-foreground">
                            {label}
                        </label>
                        <div className="relative">
                            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                id={name}
                                type={showPassword[name] ? 'text' : 'password'}
                                value={form[name]}
                                onChange={handleChange(name)}
                                placeholder={placeholder}
                                autoComplete={autoComplete}
                                disabled={submitting}
                                className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                            />
                            <button
                                type="button"
                                onClick={() => toggleVisibility(name)}
                                tabIndex={-1}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label={showPassword[name] ? 'Hide password' : 'Show password'}
                            >
                                {showPassword[name] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                ))}
                <p className="text-[11px] text-muted-foreground">
                    Password must be at least 8 characters and different from your current password.
                </p>
                <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary flex w-full items-center justify-center gap-2 !rounded-xl !py-2.5 !text-sm disabled:opacity-60 disabled:cursor-not-allowed"
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
        </div>
    );
}