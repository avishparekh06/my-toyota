import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PrimaryButton } from "@/components/PrimaryButton"
import { Container } from "@/components/Container"
import { ProfileIcon } from "@/components/Icon"
import { cn } from "@/lib/utils"

// Try to import Toyota logo, fallback to text
let ToyotaLogo: React.ComponentType<{ className?: string }> | null = null
try {
  ToyotaLogo = require("@/assets/toyota-logo.svg").default
} catch {
  // Logo not found, will use text fallback
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
      <Container>
        <div className="flex h-full items-center justify-between">
          {/* Toyota Logo + MyToyota */}
          <Link to="/" className="flex items-center space-x-4 pl-2" aria-label="MyToyota Home">
            {/* Official Toyota Logo */}
            <div className="flex items-center space-x-3">
              {/* Red Square with White Emblem */}
              <div className="w-8 h-8 bg-[var(--accent)] rounded-sm flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2C8.5 2 7.5 3 7.5 4.5C7.5 6 8.5 7 10 7C11.5 7 12.5 6 12.5 4.5C12.5 3 11.5 2 10 2Z" fill="white"/>
                  <path d="M10 13C8.5 13 7.5 14 7.5 15.5C7.5 17 8.5 18 10 18C11.5 18 12.5 17 12.5 15.5C12.5 14 11.5 13 10 13Z" fill="white"/>
                  <ellipse cx="10" cy="10" rx="8" ry="3" fill="none" stroke="white" strokeWidth="1.5"/>
                </svg>
              </div>
              {/* TOYOTA Wordmark */}
              <span className="font-bold text-lg tracking-tight text-black">
                TOYOTA
              </span>
            </div>
            {/* MyToyota Brand */}
            <div className="h-6 w-px bg-gray-300"></div>
            <span className="font-semibold text-xl tracking-tight text-[var(--accent)]">
              MyToyota
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <Link
              to="/#vehicles"
              className="font-medium text-gray-800 hover:text-[var(--accent)] transition-colors duration-200 hover:underline underline-offset-8"
            >
              Vehicles
            </Link>
            <Link
              to="/#shopping"
              className="font-medium text-gray-800 hover:text-[var(--accent)] transition-colors duration-200 hover:underline underline-offset-8"
            >
              Shopping
            </Link>
            <Link
              to="/#owners"
              className="font-medium text-gray-800 hover:text-[var(--accent)] transition-colors duration-200 hover:underline underline-offset-8"
            >
              Owners
            </Link>
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200">
              <ProfileIcon className="text-gray-700" />
            </button>
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Log in
              </Button>
            </Link>
            <Link to="/auth">
              <PrimaryButton size="sm" className="rounded-full px-6 py-2 font-medium shadow-sm hover:shadow-md transition-all duration-200">
                Create account
              </PrimaryButton>
            </Link>
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-[68px] left-0 right-0 bg-white/98 backdrop-blur-sm border-b border-gray-200/50 shadow-lg shadow-black/5">
            <div className="px-4 py-6 space-y-4">
              <Link
                to="/#vehicles"
                className="block font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Vehicles
              </Link>
              <Link
                to="/#shopping"
                className="block font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shopping
              </Link>
              <Link
                to="/#owners"
                className="block font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Owners
              </Link>
              <div className="pt-4 border-t border-[var(--border)] space-y-3">
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Log in
                  </Button>
                </Link>
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <PrimaryButton className="w-full rounded-full">
                    Create account
                  </PrimaryButton>
                </Link>
              </div>
            </div>
          </div>
        )}
      </Container>
    </nav>
  )
}