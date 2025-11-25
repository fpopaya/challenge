import { useCallback, useState } from 'react'

interface UseImageLoaderReturn {
  imageLoaded: boolean
  imageError: boolean
  handleImageLoad: () => void
  handleImageError: () => void
  isLoading: boolean
}

export const useImageLoader = (): UseImageLoaderReturn => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
    setImageError(false)
  }, [])

  const handleImageError = useCallback(() => {
    setImageError(true)
    setImageLoaded(false)
  }, [])

  const isLoading = !imageLoaded && !imageError

  return {
    imageLoaded,
    imageError,
    handleImageLoad,
    handleImageError,
    isLoading,
  }
}
