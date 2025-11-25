interface ImagePlaceholderProps {
  message?: string
}

export const ImagePlaceholder = ({ message = 'Imagen no disponible' }: ImagePlaceholderProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    className="w-full h-full max-w-[180px] max-h-[180px]"
    role="img"
    aria-label={message}
  >
    <title>{message}</title>
    <rect width="128" height="128" rx="16" fill="#f3f4f6" />
    <circle cx="64" cy="54" r="32" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="4" />
    <path d="M32 54h64" stroke="#9ca3af" strokeWidth="6" />
    <circle cx="64" cy="54" r="10" fill="#ffffff" stroke="#9ca3af" strokeWidth="3" />
    <text
      x="50%"
      y="108"
      textAnchor="middle"
      fill="#9ca3af"
      fontSize="10"
      fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    >
      {message}
    </text>
  </svg>
)
