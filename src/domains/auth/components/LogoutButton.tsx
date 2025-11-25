import { useNavigate } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'

export const LogoutButton = () => {
  const navigate = useNavigate()
  const { mutate: logout, isPending } = useLogout()

  const handleLogout = () => {
    logout(undefined, {
      onSettled: () => {
        navigate('/login')
      },
    })
  }

  return (
    <button
      type="button"
      className="py-2 px-4 bg-transparent text-white border border-gray-700 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-800 hover:border-gray-200"
      onClick={handleLogout}
      disabled={isPending}
    >
      {isPending ? 'Cerrando...' : 'Cerrar Sesión'}
    </button>
  )
}
