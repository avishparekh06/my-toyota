import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { LandingPage } from "@/routes/Landing"
import { AuthPage } from "@/routes/Auth"
import { VehiclesPage } from "@/routes/Vehicles"
import { RecommendationPage } from "@/routes/Recommendation"
import { UserProfilePage } from "@/routes/UserProfile"
import { PlanSimulatorPage } from "@/routes/PlanSimulator"
import { PrivacyPage } from "@/routes/Privacy"
import { AccessibilityPage } from "@/routes/Accessibility"
import { TermsPage } from "@/routes/Terms"
import { AuthProvider } from "@/contexts/AuthContext"
import { CarProvider } from "@/contexts/CarContext"
import { Navbar } from "@/components/Navbar"
import { ScrollToTop } from "@/components/ScrollToTop"

function App() {
  return (
    <AuthProvider>
      <CarProvider>
        <Router>
          <ScrollToTop />
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/recommendations" element={<RecommendationPage />} />
            <Route path="/plans" element={<PlanSimulatorPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Routes>
        </Router>
      </CarProvider>
    </AuthProvider>
  )
}

export default App
