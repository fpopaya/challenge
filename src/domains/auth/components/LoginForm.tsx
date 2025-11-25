import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '@/infrastructure/errors'
import { Button } from '@/shared/components'
import { cn } from '@/shared/utils/cn'
import { useLogin } from '../hooks/useLogin'
import { type LoginFormData, loginSchema } from '../types/auth.schema'

export const LoginForm = () => {
  const navigate = useNavigate()
  const { mutate: login, isPending, error, reset: resetMutation } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
  })

  const handleInputChange = () => {
    if (error) {
      resetMutation()
    }
  }

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: () => {
        navigate('/home')
      },
    })
  }

  return (
    <form
      className="flex flex-col gap-6 max-w-[400px] w-full mx-auto p-8 bg-white rounded-2xl shadow-lg relative z-[1]"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-900">Iniciar Sesión</h2>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-gray-900" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={cn(
            'p-3 border border-gray-300 rounded-lg transition-all duration-200 bg-white text-gray-900 text-base',
            'placeholder:text-gray-200',
            'focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(3,255,148,0.1)]',
            (errors.email || error) && 'border-destructive'
          )}
          placeholder="tu@email.com"
          autoComplete="email"
          aria-invalid={errors.email || error ? 'true' : 'false'}
          aria-describedby={errors.email || error ? 'login-error' : undefined}
          {...register('email', { onChange: handleInputChange })}
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-gray-900" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          className={cn(
            'p-3 border border-gray-300 rounded-lg transition-all duration-200 bg-white text-gray-900 text-base',
            'placeholder:text-gray-200',
            'focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(3,255,148,0.1)]',
            (errors.password || error) && 'border-destructive'
          )}
          placeholder="••••••"
          autoComplete="current-password"
          aria-invalid={errors.password || error ? 'true' : 'false'}
          aria-describedby={errors.password || error ? 'login-error' : undefined}
          {...register('password', { onChange: handleInputChange })}
        />
      </div>

      {(errors.email || errors.password || error) && (
        <div
          id="login-error"
          className="p-4 bg-red-50 text-danger rounded-lg text-sm"
          role="alert"
          aria-live="polite"
        >
          {errors.email?.message || errors.password?.message || getErrorMessage(error)}
        </div>
      )}

      <Button
        type="submit"
        isLoading={isPending}
        disabled={isPending}
        fullWidth
        aria-label="Iniciar sesión"
      >
        Ingresar
      </Button>
    </form>
  )
}
