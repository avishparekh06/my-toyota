import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { Apple, Mail, Loader2 } from "lucide-react"
import { Container } from "@/components/Container"
import { PrimaryButton } from "@/components/PrimaryButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/contexts/AuthContext"

// Try to import Toyota logo
let ToyotaLogo: React.ComponentType<{ className?: string }> | null = null
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ToyotaLogo = require("@/assets/toyota-logo.svg").default
} catch {
  // Logo not found, will use text fallback
}

const carouselSlides = [
  {
    title: "Smart recommendations based on your needs",
    description: "Get personalized vehicle suggestions that match your lifestyle and budget."
  },
  {
    title: "Confidence band: keep payments healthy",
    description: "Our system ensures your monthly payments stay within 10-15% of your income."
  },
  {
    title: "Seamless handoff to Toyota estimator",
    description: "When you're ready, we'll connect you with a Toyota representative for final details."
  }
]

export function AuthPage() {
  const navigate = useNavigate()
  const { login, register, error, clearError } = useAuth()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [signupData, setSignupData] = useState({ 
    firstName: "", 
    lastName: "", 
    email: "", 
    password: "", 
    terms: false 
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    
    try {
      setIsSubmitting(true)
      clearError()
      await login(loginData.email, loginData.password)
      navigate("/profile")
    } catch (error) {
      // Error is handled by the auth context
      console.error('Login error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    
    if (!signupData.terms) {
      alert("Please accept the terms and conditions")
      return
    }

    try {
      setIsSubmitting(true)
      clearError()
      
      // Split full name into first and last name
      const nameParts = signupData.firstName.trim().split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ') || ''
      
      await register({
        firstName,
        lastName,
        email: signupData.email,
        password: signupData.password,
      })
      navigate("/profile")
    } catch (error) {
      // Error is handled by the auth context
      console.error('Registration error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-[68px]">
      <div className="min-h-screen">
        <Container className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-64px)]">
            {/* Left Marketing Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 bg-[var(--surface)] rounded-lg p-8"
            >
              {/* Logo */}
              <div className="flex items-center space-x-2">
                {ToyotaLogo ? (
                  <ToyotaLogo className="h-6 w-auto" aria-label="Toyota" />
                ) : (
                  <span className="font-semibold text-lg text-[var(--accent)]">
                    TOYOTA
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-3xl font-semibold text-[var(--text)] mb-4">
                  Create your profile.
                </h1>
                <p className="text-lg text-[var(--muted)]">
                  Start with the essentials. No credit pull.
                </p>
              </div>

              {/* Carousel */}
              <div className="relative">
                <div className="aspect-video rounded-lg overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow)]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5 }}
                      className="h-full flex items-center justify-center p-6"
                    >
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
                          {carouselSlides[currentSlide].title}
                        </h3>
                        <p className="text-[var(--muted)]">
                          {carouselSlides[currentSlide].description}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                {/* Carousel Dots */}
                <div className="flex justify-center space-x-2 mt-4">
                  {carouselSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide 
                          ? 'bg-[var(--accent)]' 
                          : 'bg-[var(--muted)]/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Auth Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="w-full max-w-md mx-auto bg-white border border-[var(--border)] shadow-[var(--shadow)] rounded-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-[var(--text)]">Welcome</CardTitle>
                  <CardDescription className="text-[var(--muted)]">
                    Sign in to your account or create a new one to get started.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Error Display */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                  
                  <TooltipProvider>
                    <Tabs defaultValue="signup" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-[var(--surface)]">
                        <TabsTrigger 
                          value="login" 
                          className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[var(--text)]"
                        >
                          Login
                        </TabsTrigger>
                        <TabsTrigger 
                          value="signup"
                          className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[var(--text)]"
                        >
                          Create Account
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="login" className="space-y-4 mt-6">
                        <form onSubmit={handleLogin} className="space-y-4">
                          <div className="space-y-2">
                            <label htmlFor="login-email" className="text-sm font-medium text-[var(--text)]">
                              Email
                            </label>
                            <Input
                              id="login-email"
                              type="email"
                              placeholder="Enter your email"
                              value={loginData.email}
                              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                              className="border-[var(--border)] focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="login-password" className="text-sm font-medium text-[var(--text)]">
                              Password
                            </label>
                            <Input
                              id="login-password"
                              type="password"
                              placeholder="Enter your password"
                              value={loginData.password}
                              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                              className="border-[var(--border)] focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]"
                              required
                            />
                          </div>
                          <PrimaryButton 
                            type="submit" 
                            className="w-full" 
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                              </>
                            ) : (
                              'Continue'
                            )}
                          </PrimaryButton>
                        </form>
                      </TabsContent>
                      
                      <TabsContent value="signup" className="space-y-4 mt-6">
                        <form onSubmit={handleSignup} className="space-y-4">
                          <div className="space-y-2">
                            <label htmlFor="signup-name" className="text-sm font-medium text-[var(--text)]">
                              Full Name
                            </label>
                            <Input
                              id="signup-name"
                              type="text"
                              placeholder="Enter your full name"
                              value={signupData.firstName}
                              onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                              className="border-[var(--border)] focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="signup-email" className="text-sm font-medium text-[var(--text)]">
                              Email
                            </label>
                            <Input
                              id="signup-email"
                              type="email"
                              placeholder="Enter your email"
                              value={signupData.email}
                              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                              className="border-[var(--border)] focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="signup-password" className="text-sm font-medium text-[var(--text)]">
                              Password
                            </label>
                            <Input
                              id="signup-password"
                              type="password"
                              placeholder="Create a password"
                              value={signupData.password}
                              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                              className="border-[var(--border)] focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]"
                              required
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              id="terms"
                              type="checkbox"
                              checked={signupData.terms}
                              onChange={(e) => setSignupData({ ...signupData, terms: e.target.checked })}
                              className="rounded border-[var(--border)] focus:ring-2 focus:ring-[var(--accent)]"
                            />
                            <label htmlFor="terms" className="text-sm text-[var(--muted)]">
                              I agree to the{" "}
                              <Link to="/terms" className="text-[var(--accent)] hover:underline">
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link to="/privacy" className="text-[var(--accent)] hover:underline">
                                Privacy Policy
                              </Link>
                            </label>
                          </div>
                          <PrimaryButton 
                            type="submit" 
                            className="w-full"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                              </>
                            ) : (
                              'Create account'
                            )}
                          </PrimaryButton>
                        </form>
                      </TabsContent>
                    </Tabs>

                    {/* Social Login */}
                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-[var(--border)]" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-[var(--muted)]">
                            Or continue with
                          </span>
                        </div>
                      </div>
                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" className="w-full border-[var(--border)] hover:border-[var(--accent)]">
                              <Apple className="h-4 w-4 mr-2" />
                              Apple
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Demo only</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" className="w-full border-[var(--border)] hover:border-[var(--accent)]">
                              <Mail className="h-4 w-4 mr-2" />
                              Google
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Demo only</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--muted)] text-center mt-4">
                      This is a demo UI — no data is stored.
                    </p>
                  </TooltipProvider>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </Container>
      </div>
    </div>
  )
}