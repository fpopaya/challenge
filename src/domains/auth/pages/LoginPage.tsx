import { LoginForm } from '../components/LoginForm'

export const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6 relative before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_50%,rgba(3,255,148,0.05)_0%,transparent_50%)] before:pointer-events-none">
      <LoginForm />
    </div>
  )
}
