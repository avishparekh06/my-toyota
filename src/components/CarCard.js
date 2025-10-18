import React from 'react';

const CarCard = ({ car }) => {
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

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Car Image */}
      <div className="relative">
        <img
          src={car.images[0]}
          alt={`${car.year} ${car.model} ${car.trim}`}
          className="w-full h-48 object-cover"
        />
        {/* Fuel Type Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-white text-xs font-semibold ${getFuelTypeColor(car.fuelType)}`}>
          {car.fuelType}
        </div>
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
