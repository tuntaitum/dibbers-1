import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

const sports = [
{ name: "Padel", desc: "Find courts across Bangkok & beyond" },
{ name: "Pickleball", desc: "Thailand's fastest growing sport" },
{ name: "Squash", desc: "Premium indoor courts near you" }];


const features = [
{ num: "01", title: "Discover", desc: "Browse courts near you. Filter by sport, price, and availability in seconds." },
{ num: "02", title: "Book", desc: "Reserve any slot instantly. Pay in-app or at the venue — your choice." },
{ num: "03", title: "Track", desc: "Log every session, build weekly streaks, and watch your game hours grow." }];


const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const noiseOverlay = {
  backgroundImage: NOISE_SVG,
  backgroundSize: "180px 180px",
  mixBlendMode: "overlay",
  opacity: 0.55
};

export default function LandingMobile() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = async (e, source = "hero") => {
    e.preventDefault();
    if (!email) return;
    await base44.entities.WaitlistEntry.create({ email, source, submitted_at: new Date().toISOString() });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-body text-[#1a1a1a] overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-5 py-4">
        <img
          src="https://media.base44.com/images/public/6a2e6ee4a90a564f536f865d/0a7202968_Asset1.svg"
          alt="Dibbers"
          className="h-9 w-auto dark:hidden" />
        
        <img
          src="https://media.base44.com/images/public/6a2e6ee4a90a564f536f865d/b007a5a53_Asset3.svg"
          alt="Dibbers"
          className="h-9 w-auto hidden dark:block" />
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-light tracking-[0.12em] uppercase text-[#1a1a1a]/40">Launching 2026</span>
          <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
        </div>
      </nav>

      {/* ══════════════════════════════════════
           HERO
        ══════════════════════════════════════ */}
      <section className="relative px-4 pt-8 pb-10 mx-4 rounded-3xl overflow-hidden mb-6"
      style={{ background: "#FAFAFA", boxShadow: "0 24px 60px -20px rgba(0,0,0,0.15), 0 6px 18px -8px rgba(0,0,0,0.08)" }}>
        <div className="absolute inset-0 rounded-3xl" style={{
          background: "radial-gradient(ellipse at -5% 108%, #EA672D 0%, #EA672Dcc 18%, transparent 52%), radial-gradient(ellipse at 108% -5%, #00452A 0%, #00452Acc 18%, transparent 50%), #F2EFE8"
        }} />
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseOverlay} />

        {/* Animated blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          <div className="absolute -bottom-20 -left-16 w-[280px] h-[280px] animate-streak-pulse">
            <div className="w-full h-full rounded-full bg-brand-orange opacity-25 blur-[80px]" />
          </div>
          <div className="absolute -top-16 -right-16 w-[220px] h-[220px] animate-streak-pulse" style={{ animationDelay: "0.5s" }}>
            <div className="w-full h-full rounded-full bg-brand-green opacity-20 blur-[90px]" />
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-[10px] font-light tracking-[0.2em] uppercase text-[#1a1a1a]/50 mb-4">
            Padel · Squash · Pickleball
          </p>
          <h1 className="font-heading font-bold text-[3.2rem] leading-[0.9] tracking-[-0.04em] text-[#1a1a1a]">
            DISCOVER<br />
            <span className="text-brand-orange drop-shadow-sm">MORE.</span><br />
            TRACK<br />
            <span className="text-brand-orange drop-shadow-sm">MORE.</span>
          </h1>

          {/* Frosted glass card */}
          <div className="mt-8 rounded-2xl p-5"
          style={{
            background: "rgba(255,255,255,0.45)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.6)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)"
          }}>
            <p className="text-sm font-light text-[#1a1a1a]/65 leading-relaxed mb-5">
              Dibbers is coming to Thailand. Discover and book courts — log sessions, build streaks, and make every hour on court count.
            </p>

            {submitted ?
            <div className="flex items-center gap-3 text-brand-green py-2">
                <div className="w-5 h-5 rounded-full border-2 border-brand-green flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-brand-green" />
                </div>
                <span className="text-sm font-medium tracking-wide">You're on the list.</span>
              </div> :

            <form onSubmit={handleNotify} className="flex flex-col gap-2.5">
                <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-4 py-3.5 rounded-xl border border-[#1a1a1a]/12 bg-white/80 text-[#1a1a1a] text-sm placeholder:text-[#1a1a1a]/30 focus:outline-none focus:border-brand-orange transition-colors font-light" />
              
                <button
                type="submit"
                className="w-full bg-[#1a1a1a] text-white py-3.5 rounded-xl text-sm font-medium tracking-wide hover:bg-brand-orange transition-colors duration-300 text-center">
                
                  Notify me when we launch
                </button>
              </form>
            }
            <p className="text-[11px] font-light text-[#1a1a1a]/30 mt-3 tracking-wide">Be the first to know. No spam.</p>
          </div>

          {/* Sports tags */}
          <div className="flex items-center gap-2 mt-6 flex-wrap">
            {sports.map((s) =>
            <div key={s.name}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{
              background: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.7)"
            }}>
                <span className="text-[10px] font-medium tracking-[0.08em] uppercase text-[#1a1a1a]/70">{s.name}</span>
              </div>
            )}
          </div>
          <span className="text-[11px] font-light text-[#1a1a1a]/35 tracking-wide block mt-3">Available at launch</span>
        </div>
      </section>

      {/* ══════════════════════════════════════
           HOW IT WORKS
        ══════════════════════════════════════ */}
      <section className="px-4 py-12">
        <h2 className="font-heading font-bold text-[2.2rem] leading-none tracking-[-0.03em] mb-2">
          HOW IT<br />WORKS.
        </h2>
        <p className="text-sm font-light text-[#1a1a1a]/40 max-w-xs mb-8">
          From discovery to daily habit — three steps to your next session.
        </p>

        <div className="grid gap-px bg-[#1a1a1a]/8 rounded-2xl overflow-hidden">
          {features.map(({ num, title, desc }) =>
          <div key={title} className="bg-[#FAFAFA] p-6">
              <span className="text-xs font-light tracking-[0.2em] text-[#1a1a1a]/25 mb-3 block">{num}</span>
              <h3 className="font-heading font-bold text-xl tracking-[-0.02em] mb-2 text-brand-orange">{title.toUpperCase()}</h3>
              <p className="text-sm font-light text-[#1a1a1a]/50 leading-relaxed">{desc}</p>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
           SPORTS
        ══════════════════════════════════════ */}
      <section className="relative mx-4 rounded-3xl mb-6 px-6 py-12 overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 0% 105%, #EA672D 0%, #c04e20 20%, transparent 50%), radial-gradient(ellipse at 100% -5%, #002a1a 0%, transparent 55%), #00452A",
        boxShadow: "0 24px 60px -20px rgba(0,69,42,0.5), 0 8px 20px -8px rgba(0,0,0,0.2)"
      }}>
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseOverlay} />
        <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }} />

        <div className="relative z-10 mb-8">
          <h2 className="font-heading font-bold text-[2.2rem] leading-none tracking-[-0.03em] text-white">
            SPORTS<br />WE COVER.
          </h2>
          <p className="text-sm font-light text-white/40 max-w-xs leading-relaxed mt-3">
            Every court, every sport, one platform.
          </p>
        </div>

        <div className="relative z-10 grid gap-3">
          {sports.map((s) =>
          <div key={s.name}
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)"
          }}
          className="rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-heading font-bold text-lg tracking-[-0.02em] text-white">{s.name.toUpperCase()}</h3>
              </div>
              <p className="text-sm font-light text-white/45 leading-relaxed">{s.desc}</p>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
           CTA
        ══════════════════════════════════════ */}
      <section className="relative mx-4 rounded-3xl mb-6 px-6 py-12 overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 100% 100%, #EA672D 0%, #d4581f 25%, transparent 60%), radial-gradient(ellipse at 0% 0%, #1a1a1a 0%, transparent 50%), #111",
        boxShadow: "0 24px 60px -20px rgba(234,103,45,0.3), 0 8px 20px -8px rgba(0,0,0,0.25)"
      }}>
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseOverlay} />
        <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />

        <div className="relative z-10">
          <p className="text-[10px] font-light tracking-[0.2em] uppercase text-white/30 mb-4">Coming soon</p>
          <h2 className="font-heading font-bold text-[2.8rem] leading-[0.88] tracking-[-0.04em] text-white mb-8">
            DON'T<br />
            MISS<br />
            <span className="text-brand-orange">LAUNCH.</span>
          </h2>

          {submitted ?
          <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(16px)" }}>
              <div className="text-3xl mb-3">✅</div>
              <p className="font-medium text-white">You're on the list!</p>
              <p className="text-sm font-light text-white/40 mt-1">We'll reach out when we go live.</p>
            </div> :

          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(16px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}>
              <form onSubmit={(e) => handleNotify(e, "bottom_cta")} className="flex flex-col gap-2.5">
                <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-4 py-3.5 rounded-xl border border-white/15 bg-white/10 text-white text-sm placeholder:text-white/35 focus:outline-none focus:border-brand-orange transition-colors font-light" />
              
                <button type="submit" className="w-full bg-brand-orange text-white py-3.5 rounded-xl text-sm font-medium tracking-wide hover:bg-[#ff7a3d] transition-colors duration-300">
                  Get notified
                </button>
              </form>
              <p className="text-[11px] font-light text-white/25 mt-3 tracking-wide">No spam. Unsubscribe anytime.</p>
            </div>
          }
        </div>
      </section>

      {/* ══════════════════════════════════════
           VENUE OWNERS
        ══════════════════════════════════════ */}
      <section className="px-4 pb-12">
        <div className="relative rounded-3xl p-6 overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.9)",
          boxShadow: "0 16px 40px -12px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,1)"
        }}>
          <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ ...noiseOverlay, opacity: 0.25 }} />
          <div className="relative z-10">
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-[#1a1a1a]/30 mb-4">For venue owners</p>
            <h2 className="font-heading font-bold text-[2rem] leading-none tracking-[-0.03em] mb-4">
              OWN A<br />COURT?
            </h2>
            <p className="text-sm font-light text-[#1a1a1a]/50 leading-relaxed mb-5">
              We're partnering with venues across Thailand. Get your courts in front of thousands of active players.
            </p>
            <p className="text-sm font-light text-[#1a1a1a]/40 leading-relaxed mb-6">
              Our team will walk you through everything — no commitment required.
            </p>
            <a
              href="mailto:admin@dibbers.app"
              className="inline-flex items-center justify-center bg-[#1a1a1a] text-white px-5 py-3.5 rounded-xl font-medium text-sm hover:bg-brand-orange transition-all duration-300 shadow-lg shadow-black/20">
              
              admin@dibbers.app
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1a1a1a]/8 px-5 py-6">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-light tracking-wide text-[#1a1a1a]/30">© 2026 Dibbers · Thailand's Court Sports Platform</span>
          <div className="flex items-center gap-5">
            <Link to="/terms" className="text-[11px] font-light text-[#1a1a1a]/30 hover:text-[#1a1a1a]/60 transition-colors tracking-wide">Terms of Service</Link>
            <Link to="/privacy" className="text-[11px] font-light text-[#1a1a1a]/30 hover:text-[#1a1a1a]/60 transition-colors tracking-wide">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>);

}