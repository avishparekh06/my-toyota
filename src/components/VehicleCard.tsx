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
}

export function VehicleCard({ car, className }: VehicleCardProps) {
  const [selectedYear, setSelectedYear] = useState(car.year)

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
    // When car images are available, this will return the first image
    // For now, return null to show placeholder
    return car.images && car.images.length > 0 ? car.images[0] : null
  }

  return (
    <div
      className={cn(
        "group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden",
        "hover:border-[#EB0A1E]/20",
        className
      )}
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
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={cn(
            "px-2 py-1 text-xs font-semibold rounded-full",
            car.status === "In Stock" 
              ? "bg-green-100 text-green-800" 
              : "bg-yellow-100 text-yellow-800"
          )}>
            {car.status}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Year Selector Tabs */}
        <div className="mb-4">
          <div className="flex space-x-1 bg-gray-50 rounded-xl p-1">
            <button
              onClick={() => setSelectedYear(car.year)}
              className={cn(
                "flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                selectedYear === car.year
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              )}
            >
              {car.year}
            </button>
            <button
              onClick={() => setSelectedYear(car.year + 1)}
              className={cn(
                "flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                selectedYear === car.year + 1
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              )}
            >
              {car.year + 1}
            </button>
          </div>
        </div>

        {/* Vehicle Name */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
            {getVehicleName()}
          </h3>
          
          {/* Badge */}
          {getBadge() && (
            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-[#EB0A1E] bg-red-50 rounded-full border border-red-100">
              {getBadge()}
            </span>
          )}
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
        <div className="space-y-3">
          <button className="w-full py-3 px-4 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:shadow-sm">
            View Options
          </button>
          <button className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#EB0A1E] rounded-xl hover:bg-[#CF0A19] transition-all duration-200 hover:shadow-lg hover:shadow-[#EB0A1E]/25">
            Select Vehicle
          </button>
        </div>
      </div>
    </div>
  )
}
