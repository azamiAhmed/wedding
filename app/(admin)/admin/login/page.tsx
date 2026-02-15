import { LoginForm } from '@/components/admin/login-form'

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full space-y-6 text-center">
        <h1 className="font-sans text-2xl font-semibold text-brown-deep">
          Administration
        </h1>
        <LoginForm />
      </div>
    </div>
  )
}
