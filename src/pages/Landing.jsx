import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

const sports = [
  { name: "Padel", emoji: "🎾", desc: "Find courts across Bangkok & beyond" },
  { name: "Pickleball", emoji: "🏓", desc: "Thailand's fastest growing sport" },
  { name: "Squash", emoji: "🏸", desc: "Premium indoor courts near you" },
];

const features = [
  { num: "01", title: "Discover", desc: "Browse courts near you. Filter by sport, price, and availability in seconds." },
  { num: "02", title: "Book", desc: "Reserve any slot instantly. Pay in-app or at the venue — your choice." },
  { num: "03", title: "Track", desc: "Log every session, build weekly streaks, and watch your game hours grow." },
];

export default function Landing() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = async (e, source = "hero") => {
    e.preventDefault();
    if (!email) return;
    await base44.entities.WaitlistEntry.create({
      email,
      source,
      submitted_at: new Date().toISOString(),
    });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-body text-[#1a1a1a]">

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-[1400px] mx-auto">
        <img
          src="https://media.base44.com/images/public/6a2e6ee4a90a564f536f865d/2e92b8183_260620_LogoDesign-Negative.png"
          alt="Dibbers"
          className="h-12 w-auto brightness-0"
        />
        <div className="flex items-center gap-6">
          <span className="text-xs font-light tracking-[0.15em] uppercase text-[#1a1a1a]/40">
            Thailand · Launching 2026
          </span>
          <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="gradient-hero noise min-h-[92vh] flex flex-col justify-between px-8 pt-16 pb-16 max-w-[1400px] mx-auto rounded-3xl mt-2 mb-8 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12">
          {/* Left: headline */}
          <div className="flex-1">
            <p className="text-xs font-light tracking-[0.2em] uppercase text-[#1a1a1a]/50 mb-8">
              Padel · Squash · Pickleball
            </p>
            <h1 className="font-heading font-bold text-[clamp(4rem,9vw,9rem)] leading-[0.9] tracking-[-0.04em] text-[#1a1a1a] mb-0">
              PLAY<br />
              <span className="text-brand-orange">MORE.</span><br />
              TRACK<br />
              IT.
            </h1>
          </div>

          {/* Right: sub-copy + form */}
          <div className="md:max-w-xs">
            <p className="text-base font-light text-[#1a1a1a]/60 leading-relaxed mb-8">
              Dibbers is coming to Thailand. Discover and book courts — log sessions, build streaks, and make every hour on court count.
            </p>

            {submitted ? (
              <div className="flex items-center gap-3 text-brand-green">
                <div className="w-5 h-5 rounded-full border-2 border-brand-green flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-brand-green" />
                </div>
                <span className="text-sm font-medium tracking-wide">You're on the list.</span>
              </div>
            ) : (
              <form onSubmit={handleNotify} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-3.5 rounded-xl border border-[#1a1a1a]/15 bg-white/60 backdrop-blur-sm text-[#1a1a1a] text-sm placeholder:text-[#1a1a1a]/30 focus:outline-none focus:border-brand-orange transition-colors font-light"
                />
                <button
                  type="submit"
                  className="w-full bg-[#1a1a1a] text-white py-3.5 rounded-xl text-sm font-medium tracking-wide hover:bg-brand-orange transition-colors duration-300 flex items-center justify-center gap-2 group"
                >
                  Notify me when we launch
                  <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </form>
            )}

            <p className="text-xs font-light text-[#1a1a1a]/30 mt-3 tracking-wide">
              Be the first to know. No spam.
            </p>
          </div>
        </div>

        {/* Sports tags at the bottom */}
        <div className="flex items-center gap-4 mt-16 flex-wrap">
          {sports.map(s => (
            <div key={s.name} className="flex items-center gap-2 border border-[#1a1a1a]/15 bg-white/40 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-base">{s.emoji}</span>
              <span className="text-xs font-medium tracking-[0.1em] uppercase text-[#1a1a1a]/70">{s.name}</span>
            </div>
          ))}
          <span className="text-xs font-light text-[#1a1a1a]/30 tracking-wide ml-2">Available at launch</span>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-[1400px] mx-auto px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-4">
          <h2 className="font-heading font-bold text-[clamp(2.5rem,5vw,5rem)] leading-none tracking-[-0.03em] text-[#1a1a1a]">
            HOW IT<br />WORKS.
          </h2>
          <p className="text-sm font-light text-[#1a1a1a]/40 tracking-wide max-w-xs">
            From discovery to daily habit — three steps to your next session.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-[#1a1a1a]/10 rounded-2xl overflow-hidden">
          {features.map(({ num, title, desc }) => (
            <div key={title}               className="bg-[#F7F5F0] p-10 hover:bg-white transition-colors duration-500 group">
              <span className="text-xs font-light tracking-[0.2em] text-[#1a1a1a]/30 mb-6 block">{num}</span>
              <h3 className="font-heading font-bold text-2xl tracking-[-0.02em] text-[#1a1a1a] mb-3 group-hover:text-brand-orange transition-colors">{title.toUpperCase()}</h3>
              <p className="text-sm font-light text-[#1a1a1a]/50 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sports section ── */}
      <section className="gradient-green-block noise mx-8 rounded-3xl mb-8 px-10 py-20 max-w-[calc(1400px-4rem)] xl:mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
          <h2 className="font-heading font-bold text-[clamp(2.5rem,5vw,5rem)] leading-none tracking-[-0.03em] text-white">
            SPORTS<br />WE COVER.
          </h2>
          <p className="text-sm font-light text-white/40 max-w-xs leading-relaxed">
            Every court, every sport, one platform. Whether you play for fun or train to compete.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {sports.map(s => (
            <div key={s.name} className="border border-white/10 rounded-2xl p-8 hover:border-white/25 hover:bg-white/5 transition-all duration-500 group">
              <div className="text-4xl mb-6">{s.emoji}</div>
              <h3 className="font-heading font-bold text-2xl tracking-[-0.02em] text-white mb-2">{s.name.toUpperCase()}</h3>
              <p className="text-sm font-light text-white/40 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Coming soon CTA ── */}
      <section className="max-w-[1400px] mx-auto px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12">
          <div className="flex-1">
            <p className="text-xs font-light tracking-[0.2em] uppercase text-[#1a1a1a]/30 mb-6">Coming soon</p>
            <h2 className="font-heading font-bold text-[clamp(3rem,7vw,8rem)] leading-[0.88] tracking-[-0.04em] text-[#1a1a1a]">
              DON'T<br />
              MISS<br />
              <span className="text-brand-orange">LAUNCH.</span>
            </h2>
          </div>
          <div className="md:max-w-sm w-full">
            {submitted ? (
              <div className="bg-brand-green/10 border border-brand-green/20 rounded-2xl p-8 text-center">
                <div className="text-3xl mb-3">✅</div>
                <p className="font-medium text-brand-green">You're on the list!</p>
                <p className="text-sm font-light text-[#1a1a1a]/40 mt-1">We'll reach out when we go live.</p>
              </div>
            ) : (
              <form onSubmit={(e) => handleNotify(e, "bottom_cta")} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-3.5 rounded-xl border border-[#1a1a1a]/15 bg-white text-[#1a1a1a] text-sm placeholder:text-[#1a1a1a]/30 focus:outline-none focus:border-brand-orange transition-colors font-light"
                />
                <button
                  type="submit"
                  className="w-full bg-brand-orange text-white py-3.5 rounded-xl text-sm font-medium tracking-wide hover:bg-[#d4581f] transition-colors duration-300"
                >
                  Get notified
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Venue owners ── */}
      <section className="max-w-[1400px] mx-auto px-8 pb-24">
        <div className="border border-[#1a1a1a]/10 rounded-3xl p-10 md:p-14 grid md:grid-cols-2 gap-10 items-center bg-white/60 backdrop-blur-sm">
          <div>
            <p className="text-xs font-light tracking-[0.2em] uppercase text-[#1a1a1a]/30 mb-6">For venue owners</p>
            <h2 className="font-heading font-bold text-[clamp(2rem,4vw,4.5rem)] leading-none tracking-[-0.03em] text-[#1a1a1a] mb-6">
              OWN A<br />COURT?
            </h2>
            <p className="text-base font-light text-[#1a1a1a]/50 leading-relaxed max-w-sm">
              We're partnering with venues across Thailand. Get your courts in front of thousands of active players — manage bookings, set availability, grow your community.
            </p>
          </div>
          <div className="flex flex-col items-start gap-6">
            <p className="text-sm font-light text-[#1a1a1a]/40 leading-relaxed">
              Our team will walk you through everything — no commitment required.
            </p>
            <a
              href="mailto:admin@dibbers.app"
              className="inline-flex items-center gap-3 bg-[#1a1a1a] text-white px-6 py-4 rounded-xl font-medium text-sm hover:bg-brand-orange transition-colors duration-300 group"
            >
              admin@dibbers.app
              <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1a1a1a]/10 px-8 py-8 max-w-[1400px] mx-auto">
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