import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Recommendation } from '@/types/recommendation'
import { useCar } from '@/contexts/CarContext'
import { useAuth } from '@/contexts/AuthContext'
import { vapiService } from '@/services/vapiService'

interface RecommendationCardProps {
  recommendation: Recommendation;
  className?: string;
  onViewDetails?: (recommendation: Recommendation) => void;
  rank?: number;
}

export function RecommendationCard({ recommendation, className, onViewDetails, rank }: RecommendationCardProps) {
  const { carData: car } = recommendation;
  const navigate = useNavigate();
  const { setSelectedCar } = useCar();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState<string | null>(null);
  const [showPhoneInput, setShowPhoneInput] = useState(false);

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
    return `${car.year} ${car.make} ${car.model} ${car.trim || ''}`
  }

  const getCarImage = () => {
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

  const getMatchScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50'
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getMatchScoreText = (score: number) => {
    if (score >= 0.8) return 'Excellent Match'
    if (score >= 0.6) return 'Good Match'
    return 'Fair Match'
  }

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(recommendation)
    }
  }


  const handleExploreFinancingClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Save the selected car to context/localStorage
    setSelectedCar(car)
    // Navigate to the plans page
    navigate('/plans')
  }

  const handleCallDealer = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!user) {
      setCallStatus('Please log in to call the dealer')
      return
    }

    // Check if user has a phone number in their account
    if (!user.phone) {
      setCallStatus('Please add a phone number to your profile to use this feature')
      setShowPhoneInput(true)
      return
    }

    if (!vapiService.validatePhoneNumber(user.phone)) {
      setCallStatus('Please update your phone number in your profile to a valid format')
      setShowPhoneInput(true)
      return
    }

    setIsCalling(true)
    setCallStatus('Initiating call...')

    try {
      // Debug: Log the car data being used for the call
      console.log('RecommendationCard - Car data for Vapi call:', {
        carId: car._id,
        carMake: car.make,
        carModel: car.model,
        carYear: car.year,
        carTrim: car.trim,
        carPrice: car.dealerPrice,
        carStockNumber: car.stockNumber,
        dealershipName: car.dealership?.name,
        dealershipCity: car.dealership?.city,
        dealershipState: car.dealership?.state,
      });

      const response = await vapiService.initiateCall({
        customerPhone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        carMake: car.make,
        carModel: car.model,
        carYear: car.year.toString(),
        carColor: car.exteriorColor,
        financeOrLease: user.finance?.financeOrLease || user.preferences?.purchaseType || 'Finance',
        carTrim: car.trim,
        carPrice: car.dealerPrice,
        carStockNumber: car.stockNumber,
        dealershipName: car.dealership?.name,
        dealershipCity: car.dealership?.city,
        dealershipState: car.dealership?.state,
      })

      setCallStatus('Call initiated successfully!')
      setShowPhoneInput(false)
    } catch (error) {
      setCallStatus(error instanceof Error ? error.message : 'Failed to initiate call')
    } finally {
      setIsCalling(false)
    }
  }

  return (
    <div
      className={cn(
        "group relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden",
        "hover:border-[#EB0A1E]/30 flex flex-col h-full cursor-pointer",
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
        
        {/* Match Score Badge */}
        <div className="absolute top-3 right-3">
          <div className={cn(
            "px-3 py-1.5 text-xs font-bold rounded-full border shadow-sm backdrop-blur-sm",
            getMatchScoreColor(recommendation.similarityScore)
          )}>
            {Math.round(recommendation.similarityScore * 100)}% Match
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={cn(
            "px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm backdrop-blur-sm",
            car.status === "In Stock" 
              ? "bg-green-100 text-green-800 border border-green-200" 
              : "bg-yellow-100 text-yellow-800 border border-yellow-200"
          )}>
            {car.status}
          </span>
        </div>

        {/* Ranking Badge */}
        {rank && (
          <div className="absolute top-12 left-3">
            <div className="bg-black/80 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
              #{rank}
            </div>
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
          
          {/* Badge */}
          {getBadge() && (
            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-[#EB0A1E] bg-red-50 rounded-full border border-red-100">
              {getBadge()}
            </span>
          )}
        </div>

        {/* Match Score Summary */}
        <div className="mb-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">Overall Match</span>
              <span className={cn(
                "text-sm font-bold px-3 py-1 rounded-full border shadow-sm",
                getMatchScoreColor(recommendation.similarityScore)
              )}>
                {getMatchScoreText(recommendation.similarityScore)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
              <div 
                className="bg-gradient-to-r from-[#EB0A1E] to-[#CF0A19] h-2.5 rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${recommendation.similarityScore * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="text-gray-500 text-xs uppercase tracking-wide font-medium mb-1">Body Style</div>
              <div className="font-semibold text-gray-900">{car.bodyStyle}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="text-gray-500 text-xs uppercase tracking-wide font-medium mb-1">Engine</div>
              <div className="font-semibold text-gray-900 text-xs">{car.engine}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="text-gray-500 text-xs uppercase tracking-wide font-medium mb-1">MPG</div>
              <div className="font-semibold text-gray-900">{car.mpgCity}/{car.mpgHighway}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="text-gray-500 text-xs uppercase tracking-wide font-medium mb-1">Drivetrain</div>
              <div className="font-semibold text-gray-900">{car.drivetrain}</div>
            </div>
          </div>
        </div>

        {/* Detailed Scoring Breakdown */}
        <div className="mb-4">
          <h6 className="font-medium text-gray-700 mb-2">Match Breakdown:</h6>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Location</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${recommendation.locationProximity * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-700 w-8">
                  {Math.round(recommendation.locationProximity * 100)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Overall Match</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${recommendation.similarityScore * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-700 w-8">
                  {Math.round(recommendation.similarityScore * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Reasons */}
        <div className="mb-4">
          <h6 className="font-medium text-gray-700 mb-2">Key Reasons:</h6>
          <ul className="space-y-1">
            {recommendation.reasons.slice(0, 3).map((reason, reasonIndex) => (
              <li key={reasonIndex} className="text-sm text-gray-600 flex items-start">
                <span className="text-[#EB0A1E] mr-2 mt-0.5">•</span>
                <span className="leading-relaxed">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing */}
        <div className="mb-5">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-sm text-gray-600 font-medium">Starting MSRP</span>
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(car.msrp)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                as shown {formatPrice(car.dealerPrice)}
              </div>
              {/* Budget Checkmark */}
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-xs font-medium text-green-600">Budget Fit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dealership Info */}
        {car.dealership && (
          <div className="mb-4">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="text-gray-500 text-xs uppercase tracking-wide font-medium mb-1">Available at</div>
              <div className="font-semibold text-gray-900 text-sm">{car.dealership.name}</div>
              <div className="text-xs text-gray-600">{car.dealership.city}, {car.dealership.state}</div>
            </div>
          </div>
        )}

        {/* Phone Number Input */}
        {showPhoneInput && (
          <div className="space-y-3 mb-4">
            <div className="space-y-2">
              <label htmlFor={`phoneNumber-${car._id}`} className="text-sm font-medium text-gray-700">
                {!user?.phone ? 'Add your phone number to your profile' : 'Update your phone number'}
              </label>
              <input
                id={`phoneNumber-${car._id}`}
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EB0A1E] focus:border-transparent transition-all duration-200 text-sm"
              />
              <p className="text-xs text-gray-500">
                {!user?.phone 
                  ? 'Add your phone number to your profile to enable dealer calls. You can update it in your profile settings.'
                  : 'Update your phone number in your profile to use this feature.'
                }
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // Navigate to profile page to update phone number
                  navigate('/profile')
                }}
                className="flex-1 py-2 px-3 text-sm font-semibold text-white bg-[#EB0A1E] rounded-lg hover:bg-[#CF0A19] transition-all duration-200"
              >
                Update Profile
              </button>
              <button
                onClick={() => setShowPhoneInput(false)}
                className="px-3 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Call Status */}
        {callStatus && (
          <div className={`p-3 rounded-lg mb-4 text-sm ${
            callStatus.includes('successfully') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : callStatus.includes('Please') || callStatus.includes('Failed')
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            <p className="font-medium">{callStatus}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 mt-auto">
          <button 
            onClick={handleExploreFinancingClick}
            className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#EB0A1E] rounded-xl hover:bg-[#CF0A19] transition-all duration-200 hover:shadow-lg hover:shadow-[#EB0A1E]/25 hover:scale-[1.02] group relative"
            title="See personalized payment plans and adjust terms for this car"
          >
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span>Explore Financing Options</span>
            </span>
          </button>
          <button 
            onClick={handleCallDealer}
            disabled={isCalling}
            className="w-full py-3 px-4 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{isCalling ? 'Calling...' : 'Call Dealer'}</span>
            </span>
          </button>
          <button className="w-full py-3 px-4 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:shadow-sm hover:scale-[1.02]">
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}
