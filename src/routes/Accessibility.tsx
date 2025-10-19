import { Container } from "@/components/Container"
import { Footer } from "@/components/Footer"
import { Navbar } from "@/components/Navbar"

export function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Accessibility Statement</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> October 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment</h2>
              <p className="text-gray-700 mb-4">
                Toyota is committed to ensuring digital accessibility for all users, including those with disabilities. 
                We strive to provide an accessible and inclusive experience for everyone who visits our website and uses our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accessibility Standards</h2>
              <p className="text-gray-700 mb-4">
                We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. 
                Our website is designed to be accessible to users with various disabilities, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Visual impairments (blindness, low vision, color blindness)</li>
                <li>Hearing impairments</li>
                <li>Motor disabilities</li>
                <li>Cognitive disabilities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accessibility Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Keyboard Navigation</h3>
                  <p className="text-gray-700 text-sm">
                    All interactive elements can be accessed using keyboard navigation. 
                    Use Tab to navigate and Enter/Space to activate.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Screen Reader Support</h3>
                  <p className="text-gray-700 text-sm">
                    Content is structured with proper headings, labels, and ARIA attributes 
                    for screen reader compatibility.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Color Contrast</h3>
                  <p className="text-gray-700 text-sm">
                    Text and background colors meet WCAG contrast requirements 
                    for readability.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Alternative Text</h3>
                  <p className="text-gray-700 text-sm">
                    Images include descriptive alternative text for users 
                    who cannot see visual content.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Assistive Technologies</h2>
              <p className="text-gray-700 mb-4">
                Our website is compatible with various assistive technologies, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
                <li>Voice recognition software</li>
                <li>Switch navigation devices</li>
                <li>Magnification software</li>
                <li>Text-to-speech tools</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Browser Compatibility</h2>
              <p className="text-gray-700 mb-4">
                We support the following browsers with accessibility features:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Chrome (latest version)</li>
                <li>Firefox (latest version)</li>
                <li>Safari (latest version)</li>
                <li>Edge (latest version)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Feedback and Support</h2>
              <p className="text-gray-700 mb-4">
                We welcome feedback on the accessibility of our website. If you encounter 
                any accessibility barriers or have suggestions for improvement, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Accessibility Support:</strong><br />
                  <strong>Email:</strong> accessibility@toyota.com<br />
                  <strong>Phone:</strong> 1-800-TOYOTA-8 (TTY: 1-800-TOYOTA-9)<br />
                  <strong>Hours:</strong> Monday-Friday, 8:00 AM - 8:00 PM EST
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ongoing Improvements</h2>
              <p className="text-gray-700 mb-4">
                We continuously work to improve the accessibility of our website through:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Regular accessibility audits and testing</li>
                <li>User feedback integration</li>
                <li>Staff training on accessibility best practices</li>
                <li>Implementation of new accessibility technologies</li>
              </ul>
            </section>

            <div className="mt-12 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This is a prototype application for demonstration purposes. 
                This accessibility statement is illustrative and may not reflect actual Toyota accessibility practices.
              </p>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  )
}
