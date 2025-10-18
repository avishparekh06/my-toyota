import { useState } from 'react'
import { cn } from '@/lib/utils'

interface VehicleCardProps {
  vehicle: {
    id: string
    year: number
    name: string
    price: number
    asShown: number
    badge?: string
  }
  className?: string
}

export function VehicleCard({ vehicle, className }: VehicleCardProps) {
  const [selectedYear, setSelectedYear] = useState(vehicle.year)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
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
            onClick={() => setSelectedYear(2026)}
            className={cn(
              "flex-1 px-3 py-1.5 text-sm font-medium rounded transition-colors duration-200",
              selectedYear === 2026
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            2026
          </button>
          <button
            onClick={() => setSelectedYear(2025)}
            className={cn(
              "flex-1 px-3 py-1.5 text-sm font-medium rounded transition-colors duration-200",
              selectedYear === 2025
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            2025
          </button>
        </div>
      </div>

      {/* Vehicle Name */}
      <div className="px-4 pb-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {vehicle.name}
        </h3>
        
        {/* Badge */}
        {vehicle.badge && (
          <span className="inline-block px-2 py-1 text-xs font-medium text-[#EB0A1E] bg-red-50 rounded-full">
            {vehicle.badge}
          </span>
        )}
      </div>

      {/* Pricing */}
      <div className="px-4 pb-4">
        <div className="space-y-1">
          <div className="flex items-baseline space-x-2">
            <span className="text-sm text-gray-600">Starting MSRP</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(vehicle.price)}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            as shown {formatPrice(vehicle.asShown)}
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
