export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="w-full bg-gray-900 border-t-2 border-primary p-3 md:p-4 flex items-center justify-center"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <p className="text-xs md:text-sm text-gray-200 m-0 text-center">
        © {currentYear} <span className="text-primary font-bold">Tenpo</span>Poke
      </p>
    </footer>
  )
}
