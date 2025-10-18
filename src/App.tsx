import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { LandingPage } from "@/routes/Landing"
import { AuthPage } from "@/routes/Auth"
import { VehiclesPage } from "@/routes/Vehicles"
import { RecommendationPage } from "@/routes/Recommendation"
import { AuthProvider } from "@/contexts/AuthContext"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/recommendations" element={<RecommendationPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
