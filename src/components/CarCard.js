import React, { useState } from 'react';

const CarCard = ({ car }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const getFuelTypeColor = (fuelType) => {
    switch (fuelType) {
      case 'Hybrid':
        return 'bg-green-500';
      case 'Gasoline':
        return 'bg-gray-500';
      case 'Plug-in Hybrid':
        return 'bg-blue-500';
      case 'EV':
        return 'bg-teal-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (car.images && car.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (car.images && car.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Car Image */}
      <div className="relative group">
        {car.images && car.images.length > 0 ? (
          <img
            src={car.images[currentImageIndex]}
            alt={`${car.year} ${car.model} ${car.trim}`}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EB0A1E]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8 text-[#EB0A1E]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM15 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                  <path fillRule="evenodd" d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zm11.5 3a1.5 1.5 0 00-1.5 1.5v6a1.5 1.5 0 003 0v-6a1.5 1.5 0 00-1.5-1.5z" clipRule="evenodd"/>
                </svg>
              </div>
              <p className="text-sm text-gray-500 font-medium">Image Coming Soon</p>
            </div>
          </div>
        )}
        
        {/* Fuel Type Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-white text-xs font-semibold ${getFuelTypeColor(car.fuelType)}`}>
          {car.fuelType}
        </div>

        {/* Image Navigation Arrows */}
        {car.images && car.images.length > 1 && (
          <>
            {/* Previous Image Arrow */}
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Image Arrow */}
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {currentImageIndex + 1} / {car.images.length}
            </div>
          </>
        )}
      </div>

      {/* Car Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {car.year} {car.model} {car.trim}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4">
          Starting MSRP {formatPrice(car.msrp)}
        </p>

        {/* Features Preview */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Key Features:</p>
          <div className="flex flex-wrap gap-1">
            {car.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                {feature}
              </span>
            ))}
            {car.features.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{car.features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Select Button */}
        <button className="w-full bg-[#EB0A1E] hover:bg-[#C00819] text-white font-semibold rounded-full py-2 px-6 transition-colors duration-200">
          Select
        </button>
      </div>
    </div>
  );
};

export default CarCard;
