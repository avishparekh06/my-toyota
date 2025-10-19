import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Recommendation } from '@/types/recommendation'
import { useCar } from '@/contexts/CarContext'

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
    return car.images && car.images.length > 0 ? car.images[0] : null
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
          <button className="w-full py-3 px-4 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:shadow-sm hover:scale-[1.02]">
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}
