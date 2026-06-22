
import VerifyOtp from '@/components/AuthPage/VerifyOtp'
import React, { Suspense } from 'react'
export const dynamic = "force-dynamic";
const VerifyOtppage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyOtp />
        </Suspense>
    )
}
export default VerifyOtppage

