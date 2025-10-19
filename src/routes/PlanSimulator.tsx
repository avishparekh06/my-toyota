import { motion } from "framer-motion"
import { Footer } from "@/components/Footer"
import { Container } from "@/components/Container"
import PlanSimulator from "@/components/PlanSimulator"

export const PlanSimulatorPage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg)] pt-[68px]">

      {/* Main Content */}
      <Container>
        <div className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <PlanSimulator />
          </motion.div>
        </div>
      </Container>

      <Footer />
    </div>
  );
};
