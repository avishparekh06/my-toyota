import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Gauge, ShieldCheck, GitCompare, ChevronRight } from "lucide-react"
import { Footer } from "@/components/Footer"
import { Container } from "@/components/Container"
import { SectionHeader } from "@/components/SectionHeader"
import { HeroSlideshow } from "@/components/HeroSlideshow"
import { PrimaryButton } from "@/components/PrimaryButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const heroImages = [
  { src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=1080&fit=crop', alt: 'RAV4 on coastal road' },
  { src: 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=1920&h=1080&fit=crop', alt: 'Highlander near lighthouse' },
  { src: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1920&h=1080&fit=crop', alt: 'Prius in city street at dawn' }
]

const features = [
  {
    icon: Gauge,
    title: "Smart Match Quiz",
    description: "Financial, lifestyle, and vibe signals."
  },
  {
    icon: ShieldCheck,
    title: "Budget Confidence",
    description: "Targets 10–15% of net income."
  },
  {
    icon: GitCompare,
    title: "Plan Compare",
    description: "Finance vs lease, side by side."
  }
]

const steps = [
  { icon: "1", label: "Create your profile", description: "Start with basic information" },
  { icon: "2", label: "Answer a few quick questions", description: "Tell us about your needs" },
  { icon: "3", label: "See your Toyota matches", description: "Get personalized recommendations" }
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Hero Slideshow */}
      <HeroSlideshow images={heroImages} />

      {/* Features Section */}
      <section id="features" className="py-24 md:py-28 bg-[var(--surface)]">
        <Container>
          <SectionHeader
            eyebrow="Features"
            title="Everything You Need To Find Your Perfect Match"
            subtitle="Our intelligent system considers your financial situation, lifestyle preferences, and personal style to recommend the ideal Toyota for you."
          />
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-white border border-[var(--border)] shadow-[var(--shadow)] rounded-xl hover:-translate-y-0.5 hover:border-[var(--accent)] transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-[var(--accent)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-[var(--muted)]">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 md:py-28 bg-[var(--bg)]">
        <Container>
          <SectionHeader
            eyebrow="How It Works"
            title="Simple Steps To Your Perfect Match"
            subtitle="Our process is designed to be quick, intuitive, and comprehensive."
          />
          
          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-[var(--accent)] text-white rounded-lg flex items-center justify-center text-lg font-semibold mx-auto mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
                    {step.label}
                  </h3>
                  <p className="text-sm text-[var(--muted)]">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Band */}
      <section className="py-24 md:py-28 bg-[var(--accent)]">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Ready To Find Your Fit?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
              Join thousands of satisfied customers who found their perfect Toyota match.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/recommendations">
                <Button size="lg" variant="secondary" className="bg-white text-[var(--accent)] hover:bg-white/90 px-8">
                  Get My Recommendations
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--accent)] px-8">
                  Create Account
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>


      <Footer />
    </div>
  )
}