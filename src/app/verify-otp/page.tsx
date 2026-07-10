"use client";

import VerifyOtp from '@/components/AuthPage/VerifyOtp'
import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

export const dynamic = "force-dynamic";

function VerifyOtpContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') ?? '';
    const type = searchParams.get('type') ?? undefined;

    return <VerifyOtp email={email} type={type} />;
}

const VerifyOtppage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyOtpContent />
        </Suspense>
    )
}

export default VerifyOtppage