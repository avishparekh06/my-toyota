import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { LandingPage } from "@/routes/Landing"
import { AuthPage } from "@/routes/Auth"
import { VehiclesPage } from "@/routes/Vehicles"
import { RecommendationPage } from "@/routes/Recommendation"
import { UserProfilePage } from "@/routes/UserProfile"
import { PlanSimulatorPage } from "@/routes/PlanSimulator"
import { AuthProvider } from "@/contexts/AuthContext"
import { CarProvider } from "@/contexts/CarContext"
import { Navbar } from "@/components/Navbar"

function App() {
  return (
    <AuthProvider>
      <CarProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/recommendations" element={<RecommendationPage />} />
            <Route path="/plans" element={<PlanSimulatorPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
          </Routes>
        </Router>
      </CarProvider>
    </AuthProvider>
  )
}

export default App
