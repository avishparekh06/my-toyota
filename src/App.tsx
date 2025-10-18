import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { LandingPage } from "@/routes/Landing"
import { AuthPage } from "@/routes/Auth"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Router>
  )
}

export default App
