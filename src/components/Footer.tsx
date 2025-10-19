import { Link } from "react-router-dom"
import { Container } from "@/components/Container"

export function Footer() {
  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)]">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-[var(--text)]">Vehicles</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/vehicles" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Cars</Link></li>
              <li><Link to="/vehicles?filter=SUV" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">SUVs</Link></li>
              <li><Link to="/vehicles?filter=Truck" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Trucks</Link></li>
              <li><Link to="/vehicles?filter=Sedan" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Sedans</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-[var(--text)]">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.toyota.com/support/contact-us/" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Contact Us</a></li>
              <li><a href="https://www.toyota.com/support/faq/" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Help Center</a></li>
              <li><a href="https://www.toyota.com/dealers/" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Find a Dealer</a></li>
              <li><Link to="/vehicles" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Schedule Test Drive</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-[var(--muted)]">
              © 2025 Toyota Motor Sales, U.S.A., Inc. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                Terms of Use
              </Link>
              <Link to="/accessibility" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
          <div className="mt-4 text-xs text-[var(--muted)]">
            <p>This is a prototype UI for demonstration purposes only. All vehicle information, pricing, and features are illustrative and may not reflect actual Toyota vehicles or current offerings.</p>
          </div>
        </div>
      </Container>
    </footer>
  )
}