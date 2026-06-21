import React from "react";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="min-h-screen bg-brand-cream font-body">
      <nav className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto">
        <Link to="/">
          <img src="https://media.base44.com/images/public/6a2e6ee4a90a564f536f865d/2e92b8183_260620_LogoDesign-Negative.png" alt="Dibbers" className="h-12 w-auto" />
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-heading text-5xl font-bold text-brand-brown mb-2">TERMS OF SERVICE</h1>
        <p className="text-brand-brown/50 text-sm mb-10">Last updated: June 2026</p>

        <div className="prose prose-sm max-w-none space-y-8 text-brand-brown/80 leading-relaxed">
          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-brown mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using the Dibbers platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-brown mb-2">2. Description of Service</h2>
            <p>Dibbers is a sports court discovery and booking platform operating in Thailand. We connect players with Padel, Squash, and Pickleball venues. Dibbers acts as an intermediary and is not responsible for the quality, safety, or availability of any venue or court.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-brown mb-2">3. User Accounts</h2>
            <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-brown mb-2">4. Bookings and Payments</h2>
            <p>All bookings made through Dibbers are subject to venue availability and confirmation. Payment terms vary by venue — some venues accept in-app payment while others require payment on-site. Cancellation and refund policies are set by individual venues. Dibbers is not liable for disputes between users and venues.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-brown mb-2">5. Venue Owners</h2>
            <p>Venue owners listing courts on Dibbers are responsible for maintaining accurate information, pricing, and availability. Dibbers reserves the right to suspend or remove any venue listing that violates our policies or provides inaccurate information.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-brown mb-2">6. Prohibited Conduct</h2>
            <p>You agree not to use the Service for any unlawful purpose, to post false information, to interfere with the platform's operation, or to harass other users or venue owners.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-brown mb-2">7. Limitation of Liability</h2>
            <p>Dibbers is provided "as is" without warranties of any kind. To the maximum extent permitted by law, Dibbers shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-brown mb-2">8. Changes to Terms</h2>
            <p>We may update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the updated Terms.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-brown mb-2">9. Contact</h2>
            <p>For questions about these Terms, contact us at <a href="mailto:admin@dibbers.app" className="text-brand-orange hover:underline">admin@dibbers.app</a>.</p>
          </section>
        </div>
      </main>

      <footer className="bg-brand-brown text-white/40 text-center py-6 text-sm mt-16">
        <div className="flex items-center justify-center gap-4">
          <span>© 2026 Dibbers</span>
          <Link to="/terms" className="hover:text-white/70 transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}