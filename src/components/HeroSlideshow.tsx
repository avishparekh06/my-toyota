import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PrimaryButton } from "@/components/PrimaryButton"

interface HeroSlideshowProps {
  images?: { src: string; alt: string }[]
}

// Default Toyota image
const DEFAULT_IMAGE = {
  src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=1080&fit=crop',
  alt: 'RAV4 on coastal road'
}

export function HeroSlideshow({ images }: HeroSlideshowProps) {
  // Use first image or default
  const backgroundImage = images?.[0] || DEFAULT_IMAGE

  return (
    <section className="relative min-h-[80vh] overflow-hidden pt-[68px]">
      {/* Static Background Image */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage.src}
          alt={backgroundImage.alt}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>

      {/* Content */}
      <div className="relative z-10 min-h-[80vh] flex flex-col justify-center pt-[68px]">
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
                className="uppercase text-[14px] tracking-[0.25em] text-white/90 font-medium"
              >
                MyToyota Smart Match
              </motion.p>
              
              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="font-black tracking-tight leading-[0.9] text-white"
                style={{ 
                  fontSize: 'clamp(56px, 8vw, 88px)'
                }}
              >
                Find your{' '}
                <span className="text-[#EB0A1E]">
                  Toyota
                </span>
                .
              </motion.h1>
              
              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-white max-w-[45ch] text-[20px] md:text-[24px] leading-relaxed font-medium"
              >
                Personalized recommendations based on your lifestyle, budget, and preferences.
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 pt-6"
              >
                <Link to="/auth">
                  <PrimaryButton 
                    size="lg" 
                    className="rounded-full px-10 py-4 text-[16px] font-semibold bg-[#EB0A1E] hover:bg-[#D0091A] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </PrimaryButton>
                </Link>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="rounded-full px-10 py-4 text-[16px] font-semibold bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  )
}
