import { Suspense } from 'react'
import Login from '@/components/AuthPage/Login'
import AuthShell from '@/components/AuthPage/AuthShell'

// Login reads ?next= from the URL, which needs a Suspense boundary.
const LoginPage = () => {
  return (
    <div>
      <Suspense fallback={<AuthShell>{null}</AuthShell>}>
        <Login />
      </Suspense>
    </div>
  )
}

export default LoginPage
