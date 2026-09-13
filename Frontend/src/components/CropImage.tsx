import React, { useState, useEffect } from 'react';
import { resolveImageUrl, getCropDefaultImage, getSafeSvgFallback } from '../services/apiClient';
import { Sprout } from 'lucide-react';

export interface CropImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  cropName?: string;
  alt?: string;
  fallback?: string;
  className?: string;
}

export const CropImage: React.FC<CropImageProps> = ({
  src,
  cropName,
  alt = 'Crop image',
  fallback,
  className = '',
  ...props
}) => {
  const cropFallback = fallback || getCropDefaultImage(cropName);
  const [currentSrc, setCurrentSrc] = useState<string>(() => resolveImageUrl(src, cropName, cropFallback));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [retryStage, setRetryStage] = useState<number>(0);

  useEffect(() => {
    const effectiveFallback = fallback || getCropDefaultImage(cropName);
    const resolved = resolveImageUrl(src, cropName, effectiveFallback);
    setCurrentSrc(resolved);
    setIsLoading(true);
    setRetryStage(0);
  }, [src, cropName, fallback]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    const cropDefault = fallback || getCropDefaultImage(cropName);
    const svgFallback = getSafeSvgFallback(cropName);

    if (retryStage === 0 && currentSrc !== cropDefault) {
      setRetryStage(1);
      setCurrentSrc(cropDefault);
    } else if (retryStage < 2 && currentSrc !== svgFallback) {
      setRetryStage(2);
      setCurrentSrc(svgFallback);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-[#eef4ea] ${className}`}>
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#e2ebd9]/60 animate-pulse flex items-center justify-center z-10">
          <Sprout className="w-5 h-5 text-[#538d22]/50 animate-bounce" />
        </div>
      )}

      {/* Main Image */}
      <img
        loading="lazy"
        decoding="async"
        {...props}
        src={currentSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};

