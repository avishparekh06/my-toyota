import { useState, useEffect } from 'react'
import { VehicleCard } from '@/components/VehicleCard'
import { carsApi } from '@/services/api'

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

interface CarsResponse {
  success: boolean
  data: Car[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export function VehiclesPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await carsApi.getCars({ limit: 50 }) as CarsResponse
        if (response.success) {
          setCars(response.data)
        } else {
          setError('Failed to fetch vehicles')
        }
      } catch (err) {
        console.error('Error fetching cars:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch vehicles')
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Vehicles</h1>
            <p className="mt-2 text-gray-600">Explore our lineup of Toyota vehicles</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm animate-pulse">
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Vehicles</h1>
            <p className="mt-2 text-gray-600">Explore our lineup of Toyota vehicles</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg font-medium mb-2">Error Loading Vehicles</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-[#EB0A1E] text-white rounded-md hover:bg-[#CF0A19] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Vehicles</h1>
          <p className="mt-2 text-gray-600">Explore our lineup of Toyota vehicles</p>
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cars.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg font-medium mb-2">No Vehicles Found</div>
            <p className="text-gray-600">No vehicles are currently available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <VehicleCard 
                key={car._id} 
                car={car}
                className="h-fit"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
