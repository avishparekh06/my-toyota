import { VehicleCard } from '@/components/VehicleCard'

// Sample vehicle data
const vehicles = [
  { 
    id: "corolla-cross", 
    year: 2026, 
    name: "Corolla Cross", 
    price: 24635, 
    asShown: 32157 
  },
  { 
    id: "corolla-cross-hybrid", 
    year: 2026, 
    name: "Corolla Cross Hybrid", 
    price: 28995, 
    asShown: 34780, 
    badge: "Hybrid EV" 
  },
  { 
    id: "rav4", 
    year: 2025, 
    name: "RAV4", 
    price: 29800, 
    asShown: 39630 
  }
]

export function VehiclesPage() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard 
              key={vehicle.id} 
              vehicle={vehicle}
              className="h-fit"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
