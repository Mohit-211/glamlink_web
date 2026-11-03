import { Suspense } from 'react'
import Register from '@/components/AuthPage/Register'
import AuthShell from '@/components/AuthPage/AuthShell'

// Register reads ?next= from the URL, which needs a Suspense boundary.
const RegisterPage = () => {
  return (
    <div>
      <Suspense fallback={<AuthShell>{null}</AuthShell>}>
        <Register />
      </Suspense>
    </div>
  )
}

export default RegisterPage
