import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { LogoutButton } from '@/domains/auth/components/LogoutButton'
import { useSessionStore } from '@/domains/session/model/session.store'
import { env } from '@/infrastructure/config/env'
import { Footer } from '@/shared/components'

export const PrivateLayout = () => {
  const { user } = useSessionStore()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleGoHome = () => {
    navigate('/home')
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white relative min-h-0">
      <header className="flex justify-between items-center p-4 bg-gray-900 border-b border-primary/20 z-[100] shadow-[0_4px_12px_rgba(31,41,55,0.3)] shrink-0 lg:px-8">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={handleGoHome}
            className="bg-transparent border-none p-0 cursor-pointer flex items-center transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95"
            aria-label="Ir al inicio"
          >
            <img src={env.logoUrl} alt="Tenpo" className="h-7 lg:h-8 w-auto object-contain" />
          </button>
          <button
            type="button"
            onClick={handleGoHome}
            className="hidden md:block bg-transparent border-none text-primary text-sm font-semibold cursor-pointer px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:-translate-y-px active:translate-y-0 font-inherit"
            aria-label="Ir al inicio"
          >
            Inicio
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user && <span className="text-sm text-gray-200 font-medium">{user.email}</span>}
          <LogoutButton />
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          className="flex md:hidden flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1.5 z-[101]"
          aria-label="Abrir menú"
          aria-expanded={isMenuOpen}
        >
          <span className="w-6 h-0.5 bg-primary rounded-sm transition-all duration-200" />
          <span className="w-6 h-0.5 bg-primary rounded-sm transition-all duration-200" />
          <span className="w-6 h-0.5 bg-primary rounded-sm transition-all duration-200" />
        </button>
      </header>

      {isMenuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 bg-gray-900/50 z-[200] animate-[fadeIn_0.2s_ease-out]"
            onClick={closeMenu}
            aria-label="Cerrar menú"
          />
          <nav className="fixed top-0 right-0 bottom-0 w-4/5 max-w-[300px] bg-gray-900 z-[201] animate-[slideInRight_0.3s_ease-out] flex flex-col">
            <div className="flex justify-end p-4 border-b border-primary/20">
              <button
                type="button"
                onClick={closeMenu}
                className="bg-transparent border-none text-primary text-2xl cursor-pointer p-1.5 leading-none transition-all duration-200 hover:text-primary/90 hover:scale-110"
                aria-label="Cerrar menú"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 flex flex-col p-6 gap-4">
              <button
                type="button"
                onClick={handleGoHome}
                className="bg-transparent border-none text-white text-base font-semibold cursor-pointer p-4 rounded-lg text-left transition-all duration-200 hover:bg-primary/10 hover:text-primary font-inherit"
              >
                Inicio
              </button>
              {user && (
                <div className="p-4 mt-auto border-t border-primary/20">
                  <span className="text-sm text-gray-200 font-medium">{user.email}</span>
                </div>
              )}
              <div className="py-4">
                <LogoutButton />
              </div>
            </div>
          </nav>
        </>
      )}

      <main className="flex-1 overflow-hidden bg-white relative min-h-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
