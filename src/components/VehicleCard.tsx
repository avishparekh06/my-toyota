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

  return (
    <div
      className={cn(
        "group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden",
        className
      )}
    >
      {/* Year Selector Tabs */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex space-x-1 bg-gray-100 rounded-md p-1">
          <button
            onClick={() => setSelectedYear(car.year)}
            className={cn(
              "flex-1 px-3 py-1.5 text-sm font-medium rounded transition-colors duration-200",
              selectedYear === car.year
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            {car.year}
          </button>
          <button
            onClick={() => setSelectedYear(car.year + 1)}
            className={cn(
              "flex-1 px-3 py-1.5 text-sm font-medium rounded transition-colors duration-200",
              selectedYear === car.year + 1
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            {car.year + 1}
          </button>
        </div>
      </div>

      {/* Vehicle Name */}
      <div className="px-4 pb-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {getVehicleName()}
        </h3>
        
        {/* Badge */}
        {getBadge() && (
          <span className="inline-block px-2 py-1 text-xs font-medium text-[#EB0A1E] bg-red-50 rounded-full">
            {getBadge()}
          </span>
        )}
      </div>

      {/* Vehicle Details */}
      <div className="px-4 pb-2">
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Body Style:</span>
            <span className="font-medium">{car.bodyStyle}</span>
          </div>
          <div className="flex justify-between">
            <span>Engine:</span>
            <span className="font-medium">{car.engine}</span>
          </div>
          <div className="flex justify-between">
            <span>MPG:</span>
            <span className="font-medium">{car.mpgCity}/{car.mpgHighway}</span>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="px-4 pb-4">
        <div className="space-y-1">
          <div className="flex items-baseline space-x-2">
            <span className="text-sm text-gray-600">Starting MSRP</span>
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
      <div className="px-4 pb-4 space-y-2">
        <button className="w-full py-2.5 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200">
          Options
        </button>
        <button className="w-full py-2.5 px-4 text-sm font-medium text-white bg-[#EB0A1E] rounded-md hover:bg-[#CF0A19] transition-colors duration-200">
          Select
        </button>
      </div>
    </div>
  )
}
