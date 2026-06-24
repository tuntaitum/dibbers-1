import React from "react";
import { Link } from "react-router-dom";
import { noiseOverlay, gradientBanner } from "@/lib/portalDesign";

export default function Privacy() {
  return (
    <div className="min-h-screen font-body" style={{ background: "#F7F5F0" }}>
      <nav className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto">
        <Link to="/">
          <img src="https://media.base44.com/images/public/6a2e6ee4a90a564f536f865d/2e92b8183_260620_LogoDesign-Negative.png" alt="Dibbers" className="h-12 w-auto" />
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-8">
        <div className="relative rounded-3xl px-6 md:px-8 py-8 mb-10 overflow-hidden" style={gradientBanner}>
          <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseOverlay} />
          <div className="relative z-10">
            <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-[-0.03em] text-[#1a1a1a]">PRIVACY POLICY</h1>
            <p className="text-[#1a1a1a]/40 text-sm mt-1 font-light">Last updated: June 2026</p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none space-y-8 text-brand-brown/80 leading-relaxed">
          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-brown mb-2">1. Information We Collect</h2>
            <p>We collect information you provide directly, such as your name, email address, and phone number when you register or make a booking. We also collect usage data including pages visited, searches performed, and bookings made.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-brown mb-2">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Process and confirm your court bookings</li>
              <li>Send booking confirmations and reminders</li>
              <li>Improve and personalise your experience on Dibbers</li>
              <li>Communicate platform updates and relevant offers</li>
              <li>Resolve disputes and enforce our Terms of Service</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-brown mb-2">3. Sharing Your Information</h2>
            <p>We share your booking details (name, contact) with the venue you book with, as necessary to complete your reservation. We do not sell your personal data to third parties. We may share data with service providers who assist us in operating the platform, under strict confidentiality agreements.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-brown mb-2">4. Cookies</h2>
            <p>We use cookies and similar technologies to maintain your session, remember your preferences, and analyse platform usage. You can disable cookies in your browser settings, though some features may not function correctly as a result.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-brown mb-2">5. Data Retention</h2>
            <p>We retain your personal data for as long as your account is active or as needed to provide you with our services. You may request deletion of your account and associated data at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-brown mb-2">6. Security</h2>
            <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-brown mb-2">7. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at <a href="mailto:admin@dibbers.app" className="text-brand-orange hover:underline">admin@dibbers.app</a>.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-brown mb-2">8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or via a notice on the platform.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-brown mb-2">9. Contact</h2>
            <p>For privacy-related questions, contact us at <a href="mailto:admin@dibbers.app" className="text-brand-orange hover:underline">admin@dibbers.app</a>.</p>
          </section>
        </div>
      </main>

      <footer className="border-t border-[#1a1a1a]/8 px-6 py-8 max-w-4xl mx-auto mt-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <span className="text-xs font-light tracking-wide text-[#1a1a1a]/30">© 2026 Dibbers · Thailand's Court Sports Platform</span>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="text-xs font-light text-[#1a1a1a]/30 hover:text-[#1a1a1a]/60 transition-colors tracking-wide">Terms of Service</Link>
            <Link to="/privacy" className="text-xs font-light text-[#1a1a1a]/30 hover:text-[#1a1a1a]/60 transition-colors tracking-wide">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}