import { Link } from "react-router-dom"
import { Container } from "@/components/Container"

export function Footer() {
  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)]">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-[var(--text)]">Vehicles</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/#cars" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Cars</Link></li>
              <li><Link to="/#suvs" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">SUVs</Link></li>
              <li><Link to="/#trucks" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Trucks</Link></li>
              <li><Link to="/#hybrids" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Hybrids</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-[var(--text)]">Shopping</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/#build" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Build & Price</Link></li>
              <li><Link to="/#inventory" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Find Inventory</Link></li>
              <li><Link to="/#financing" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Financing</Link></li>
              <li><Link to="/#trade" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Trade-In Value</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-[var(--text)]">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/#contact" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Contact Us</Link></li>
              <li><Link to="/#help" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Help Center</Link></li>
              <li><Link to="/#dealers" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Find a Dealer</Link></li>
              <li><Link to="/#test-drive" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">Schedule Test Drive</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-[var(--muted)]">
              © 2024 Toyota Motor Sales, U.S.A., Inc. All rights reserved.
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