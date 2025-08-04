'use client';

import React, { useState } from 'react';

interface ImageCarouselProps {
  images: string[];
  alt?: string;
  className?: string;
}

export default function ImageCarousel({ 
  images, 
  alt = "Profile image", 
  className = "" 
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={`w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-gray-500">No images available</div>
      </div>
    );
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Image */}
      <div className="relative w-full h-64 rounded-lg overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={`${alt} ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
          }}
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-opacity"
            >
              ←
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-opacity"
            >
              →
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="flex justify-center mt-3 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-pink-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
