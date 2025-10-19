import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
} from '@/components/ui/dialog'

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

interface CarDetailModalProps {
  car: Car | null
  isOpen: boolean
  onClose: () => void
}

export function CarDetailModal({ car, isOpen, onClose }: CarDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (!car) return null

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
    return car.images && car.images.length > 0 ? car.images[selectedImageIndex] : null
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl !rounded-3xl" style={{ borderRadius: '24px' }}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {getVehicleName()}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Complete vehicle details and specifications
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vehicle Images */}
          <div className="space-y-4">
            <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
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
              <div className="absolute top-4 right-4">
                <span className={cn(
                  "px-3 py-1 text-sm font-semibold rounded-full",
                  car.status === "In Stock" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                )}>
                  {car.status}
                </span>
              </div>

              {/* Fuel Type Badge */}
              {getBadge() && (
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-[#EB0A1E] bg-red-50 rounded-full border border-red-100">
                    {getBadge()}
                  </span>
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {car.images && car.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                      selectedImageIndex === index
                        ? "border-[#EB0A1E]"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <img 
                      src={image} 
                      alt={`${getVehicleName()} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Section */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-lg text-gray-600 font-medium">Starting MSRP</span>
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(car.msrp)}
              </span>
            </div>
            <div className="text-gray-500">
              Dealer Price: {formatPrice(car.dealerPrice)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Stock #: {car.stockNumber}
            </div>
          </div>

          {/* Vehicle Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Engine & Performance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Engine & Performance
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Engine</span>
                  <span className="font-medium">{car.engine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horsepower</span>
                  <span className="font-medium">{car.horsepower} HP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transmission</span>
                  <span className="font-medium">{car.transmission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Drivetrain</span>
                  <span className="font-medium">{car.drivetrain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuel Type</span>
                  <span className="font-medium">{car.fuelType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">MPG (City/Highway)</span>
                  <span className="font-medium">{car.mpgCity}/{car.mpgHighway}</span>
                </div>
              </div>
            </div>

            {/* Dimensions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Dimensions
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Length</span>
                  <span className="font-medium">{car.dimensions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Width</span>
                  <span className="font-medium">{car.dimensions.width}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Height</span>
                  <span className="font-medium">{car.dimensions.height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wheelbase</span>
                  <span className="font-medium">{car.dimensions.wheelbase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Body Style</span>
                  <span className="font-medium">{car.bodyStyle}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Colors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Exterior</span>
                <span className="font-medium">{car.exteriorColor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Interior</span>
                <span className="font-medium">{car.interiorColor}</span>
              </div>
            </div>
          </div>

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Key Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#EB0A1E] rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dealership Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Dealership Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                <div className="font-medium text-gray-900">{car.dealership.name}</div>
                <div className="text-gray-600">
                  {car.dealership.address}<br />
                  {car.dealership.city}, {car.dealership.state} {car.dealership.zip}
                </div>
                <div className="text-gray-600">
                  Phone: <a href={`tel:${car.dealership.phone}`} className="text-[#EB0A1E] hover:underline">
                    {car.dealership.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>


          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button className="flex-1 py-3 px-6 text-sm font-semibold text-white bg-[#EB0A1E] rounded-xl hover:bg-[#CF0A19] transition-all duration-200 hover:shadow-lg hover:shadow-[#EB0A1E]/25">
              Contact Dealer
            </button>
            <button className="flex-1 py-3 px-6 text-sm font-semibold text-white bg-gray-800 rounded-xl hover:bg-gray-900 transition-all duration-200 hover:shadow-lg">
              Get Financing
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
