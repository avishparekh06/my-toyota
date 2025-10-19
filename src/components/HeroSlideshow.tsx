import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PrimaryButton } from "@/components/PrimaryButton"

interface SlideImage {
  src: string
  alt: string
}

interface HeroSlideshowProps {
  images: SlideImage[]
}

export function HeroSlideshow({ images }: HeroSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Auto-play slideshow with slower, more elegant timing
  useEffect(() => {
    if (prefersReducedMotion || isPaused) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length, isPaused, prefersReducedMotion])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  return (
    <section 
      className="relative min-h-screen overflow-hidden pt-[68px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {/* Slideshow Images with subtle fade */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, filter: "blur(2px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(2px)" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <picture>
              <img
                src={images[currentSlide].src}
                alt={images[currentSlide].alt}
                className="w-full h-full object-cover"
              />
            </picture>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

      {/* Content - Vertically centered with intentional spacing */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center pt-[68px]">
        <div className="w-full max-w-6xl mx-auto px-8 md:px-12 lg:px-16">
          <div className="max-w-4xl pt-[8vh] pb-[12vh]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Eyebrow */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="uppercase text-[11px] tracking-[0.15em] text-white/70 font-medium"
              >
                MyToyota Smart Match
              </motion.p>
              
              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="font-bold tracking-tight leading-[0.95] text-white"
                style={{ fontSize: 'clamp(48px, 7vw, 72px)' }}
              >
                Find your perfect Toyota match.
              </motion.h1>
              
              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-white/60 max-w-[45ch] text-[18px] md:text-[20px] leading-relaxed font-light"
              >
                Personalized recommendations based on your lifestyle, budget, and preferences.
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Link to="/auth">
                  <PrimaryButton 
                    size="lg" 
                    className="rounded-full px-10 py-4 text-[16px] font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </PrimaryButton>
                </Link>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="rounded-full px-10 py-4 text-[16px] font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Minimal Navigation Controls - Positioned lower */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-[60%] -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 text-white" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-6 top-[60%] -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 text-white" />
      </button>

      {/* Minimal Dot Indicators - Positioned lower */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? "true" : "false"}
          />
        ))}
      </div>
    </section>
  )
}
