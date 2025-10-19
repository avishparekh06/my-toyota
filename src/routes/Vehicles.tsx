import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { VehicleCard } from '@/components/VehicleCard'
import { CarDetailModal } from '@/components/CarDetailModal'
import { carsApi } from '@/services/api'
import { useSearchParams } from 'react-router-dom'

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
  const [searchParams, setSearchParams] = useSearchParams()
  const [cars, setCars] = useState<Car[]>([])
  const [filteredCars, setFilteredCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBodyStyle, setSelectedBodyStyle] = useState<string>('All')

  // Initialize filter from URL parameters
  useEffect(() => {
    const filter = searchParams.get('filter')
    if (filter) {
      setSelectedBodyStyle(filter)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await carsApi.getCars({ limit: 50 }) as CarsResponse
        if (response.success) {
          setCars(response.data)
          setFilteredCars(response.data)
        } else {
          setError('Failed to fetch vehicles')
        }
      } catch (err) {
        // Error fetching cars
        setError(err instanceof Error ? err.message : 'Failed to fetch vehicles')
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  // Filter cars by body style
  useEffect(() => {
    if (selectedBodyStyle === 'All') {
      setFilteredCars(cars)
    } else {
      const filtered = cars.filter(car => car.bodyStyle === selectedBodyStyle)
      setFilteredCars(filtered)
    }
  }, [selectedBodyStyle, cars])

  // Get unique body styles for filter options
  const bodyStyles = ['All', ...new Set(cars.map(car => car.bodyStyle))]

  const handleViewDetails = (car: Car) => {
    setSelectedCar(car)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCar(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] pt-[68px]">
        <div className="bg-white border-b border-gray-200 border-l-4 border-l-[#EB0A1E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.h1 
              className="text-6xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.span 
                className="text-[#EB0A1E]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                Toyota
              </motion.span> 
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                Vehicles
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            >
              Explore our lineup of Toyota vehicles
            </motion.p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse">
                {/* Image placeholder */}
                <div className="h-48 bg-gray-200 rounded-t-2xl"></div>
                <div className="p-5">
                  {/* Year selector */}
                  <div className="h-10 bg-gray-200 rounded-xl mb-4"></div>
                  {/* Vehicle name */}
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                  </div>
                  {/* Pricing */}
                  <div className="h-20 bg-gray-200 rounded-xl mb-4"></div>
                  {/* Buttons */}
                  <div className="space-y-3">
                    <div className="h-12 bg-gray-200 rounded-xl"></div>
                    <div className="h-12 bg-gray-200 rounded-xl"></div>
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
      <div className="min-h-screen bg-[#F5F5F5] pt-[68px]">
        <div className="bg-white border-b border-gray-200 border-l-4 border-l-[#EB0A1E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.h1 
              className="text-6xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.span 
                className="text-[#EB0A1E]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                Toyota
              </motion.span> 
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                Vehicles
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            >
              Explore our lineup of Toyota vehicles
            </motion.p>
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
    <div className="min-h-screen bg-[#F5F5F5] pt-[68px]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 border-l-4 border-l-[#EB0A1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.h1 
            className="text-6xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span 
              className="text-[#EB0A1E]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Toyota
            </motion.span> 
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              Vehicles
            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          >
            Explore our lineup of Toyota vehicles
          </motion.p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-center space-x-4">
              <label htmlFor="bodyStyleFilter" className="text-sm font-medium text-gray-700">
                Filter by Body Style:
              </label>
              <motion.select
                id="bodyStyleFilter"
                value={selectedBodyStyle}
                onChange={(e) => {
                  const newFilter = e.target.value
                  setSelectedBodyStyle(newFilter)
                  // Update URL parameters
                  if (newFilter === 'All') {
                    setSearchParams({})
                  } else {
                    setSearchParams({ filter: newFilter })
                  }
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] bg-white transition-all duration-200"
                whileFocus={{ scale: 1.02 }}
              >
                {bodyStyles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </motion.select>
            </div>
            <motion.div 
              className="text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.0 }}
            >
              Showing {filteredCars.length} of {cars.length} vehicles
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredCars.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div 
              className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 200 }}
            >
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709" />
              </svg>
            </motion.div>
            <motion.div 
              className="text-gray-500 text-lg font-medium mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              No Vehicles Found
            </motion.div>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              No vehicles are currently available.
            </motion.p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {filteredCars.map((car, index) => (
              <motion.div
                key={car._id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.4 + (index * 0.1),
                  ease: "easeOut"
                }}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <VehicleCard 
                  car={car}
                  onViewDetails={handleViewDetails}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Car Detail Modal */}
      <CarDetailModal 
        car={selectedCar}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
