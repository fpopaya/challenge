import { ImagePlaceholder } from '@/shared/components'
import { useImageLoader } from '@/shared/hooks/useImageLoader'
import { cn } from '@/shared/utils/cn'

interface PokemonCardImageProps {
  imageUrl: string | null
  alt: string
}

export const PokemonCardImage = ({ imageUrl, alt }: PokemonCardImageProps) => {
  const { imageLoaded, imageError, handleImageLoad, handleImageError } = useImageLoader()

  return (
    <div className="w-card-image h-card-image shrink-0 bg-white flex items-center justify-center p-2 md:p-4 lg:p-6 relative">
      {imageError || !imageUrl ? (
        <ImagePlaceholder />
      ) : (
        <img
          src={imageUrl}
          alt={alt}
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={cn(
            'w-full h-full object-contain transition-opacity duration-300',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  )
}
