"use client";

import { useState } from "react";
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

export default function OptimizedImage({
  src,
  alt,
  fill = false,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  className = "",
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`relative overflow-hidden bg-dark-800 flex items-center justify-center ${className}`}>
        <span className="text-white/20 text-xs">لا توجد صورة</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${fill ? "w-full h-full" : ""} ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-dark-800 animate-pulse" />
      )}

      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          quality={80}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`object-cover transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width || 400}
          height={height || 400}
          sizes={sizes}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          quality={80}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-auto transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}