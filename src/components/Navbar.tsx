import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Menu, X, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PrimaryButton } from "@/components/PrimaryButton"
import { ProfileIcon } from "@/components/Icon"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"

// Toyota logo import removed - using SVG icon instead

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-[68px] bg-white/95 backdrop-blur-sm border-b border-gray-200/50 transition-all duration-300",
        scrolled && "bg-white/98 shadow-lg shadow-black/5"
      )}
    >
      <div className="flex h-full items-center justify-between px-4">
        {/* Toyota Logo - Left side */}
        <Link to="/" className="flex items-center">
          <img 
            src="/images/logos/images.png" 
            alt="Toyota Logo" 
            className="h-16 w-auto"
          />
        </Link>
        
        {/* All navigation elements - Right side */}
        <div className="flex items-center space-x-6">
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/vehicles"
              className="font-medium text-gray-800 hover:text-[var(--accent)] transition-colors duration-200 hover:underline underline-offset-8"
            >
              Vehicles
            </Link>
            <Link
              to="/recommendations"
              className="font-medium text-gray-800 hover:text-[var(--accent)] transition-colors duration-200 hover:underline underline-offset-8"
            >
              Recommendations
            </Link>
            <Link
              to="/plans"
              className="font-medium text-gray-800 hover:text-[var(--accent)] transition-colors duration-200 hover:underline underline-offset-8"
            >
              Plans
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user?.firstName}</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                {/* Profile Icon */}
                <Link to="/auth">
                  <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200">
                    <ProfileIcon className="text-gray-700" />
                  </button>
                </Link>
                <Link to="/auth">
                  <PrimaryButton className="rounded-full px-6 py-2 font-medium shadow-sm hover:shadow-md transition-all duration-200">
                    Create account
                  </PrimaryButton>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-[var(--text)]" />
            ) : (
              <Menu className="h-6 w-6 text-[var(--text)]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[68px] left-0 right-0 bg-white/98 backdrop-blur-sm border-b border-gray-200/50 shadow-lg shadow-black/5">
          <div className="px-4 py-6 space-y-4">
            <Link
              to="/vehicles"
              className="block font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Vehicles
            </Link>
            <Link
              to="/recommendations"
              className="block font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Recommendations
            </Link>
            <Link
              to="/plans"
              className="block font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Plans
            </Link>
            <div className="pt-4 border-t border-[var(--border)] space-y-3">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Profile ({user?.firstName})</span>
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <PrimaryButton className="w-full rounded-full">
                      Create account
                    </PrimaryButton>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}