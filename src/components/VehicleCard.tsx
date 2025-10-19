import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Car {
  _id: string
  vin: string
  year: number
  make: string
  model: string
  trim: string
  bodyStyle: string
  engine: string
  horsepower: number
  drivetrain: string
  transmission: string
  fuelType: string
  mpgCity: number
  mpgHighway: number
  exteriorColor: string
  interiorColor: string
  stockNumber: string
  msrp: number
  dealerPrice: number
  features: string[]
  dimensions: {
    length: string
    width: string
    height: string
    wheelbase: string
  }
  status: string
  images: string[]
  location: {
    city: string
    state: string
    zip: string
  }
  dealership: {
    name: string
    address: string
    city: string
    state: string
    zip: string
    phone: string
  }
  dateAdded: string
}

interface VehicleCardProps {
  car: Car
  className?: string
  onViewDetails?: (car: Car) => void
}

export function VehicleCard({ car, className, onViewDetails }: VehicleCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getBadge = () => {
    if (car.fuelType === 'Hybrid') return 'Hybrid'
    if (car.fuelType === 'Electric') return 'Electric'
    if (car.drivetrain === 'AWD' || car.drivetrain === '4WD') return 'AWD'
    return null
  }

  const getVehicleName = () => {
    return `${car.year} ${car.make} ${car.model} ${car.trim}`
  }

  const getCarImage = () => {
    // Return the current image from the car's images array
    return car.images && car.images.length > 0 ? car.images[currentImageIndex] : null
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (car.images && car.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % car.images.length)
    }
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (car.images && car.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length)
    }
  }

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(car)
    }
  }

  const handleViewOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onViewDetails) {
      onViewDetails(car)
    }
  }

  return (
    <div
      className={cn(
        "group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden",
        "hover:border-[#EB0A1E]/20 flex flex-col h-full cursor-pointer",
        className
      )}
      onClick={handleCardClick}
    >
      {/* Car Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {getCarImage() ? (
          <img 
            src={getCarImage() || undefined} 
            alt={getVehicleName()}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
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
        
        {/* AWD Badge - positioned as overlay on image */}
        {getBadge() && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-[#EB0A1E] bg-white/90 backdrop-blur-sm rounded-full border border-red-100 shadow-sm">
              {getBadge()}
            </span>
          </div>
        )}

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

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">

        {/* Vehicle Name */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
            {getVehicleName()}
          </h3>
        </div>

        {/* Vehicle Details */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-500 text-xs uppercase tracking-wide font-medium mb-1">Body Style</div>
              <div className="font-semibold text-gray-900">{car.bodyStyle}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-500 text-xs uppercase tracking-wide font-medium mb-1">Engine</div>
              <div className="font-semibold text-gray-900 text-xs">{car.engine}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-500 text-xs uppercase tracking-wide font-medium mb-1">MPG</div>
              <div className="font-semibold text-gray-900">{car.mpgCity}/{car.mpgHighway}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-500 text-xs uppercase tracking-wide font-medium mb-1">Drivetrain</div>
              <div className="font-semibold text-gray-900">{car.drivetrain}</div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-5">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-sm text-gray-600 font-medium">Starting MSRP</span>
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(car.msrp)}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              as shown {formatPrice(car.dealerPrice)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mt-auto">
          <button 
            onClick={handleViewOptionsClick}
            className="w-full py-3 px-4 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:shadow-sm"
          >
            View Details
          </button>
          <button className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#EB0A1E] rounded-xl hover:bg-[#CF0A19] transition-all duration-200 hover:shadow-lg hover:shadow-[#EB0A1E]/25">
            Select Vehicle
          </button>
        </div>
      </div>
    </div>
  )
}
