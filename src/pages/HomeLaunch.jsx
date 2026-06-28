import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import ExploreSearch from "@/components/home/ExploreSearch";

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
  opacity: 0.4
};

const frostedCard = {
  background: "rgba(255,255,255,0.55)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.85)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)"
};

function useFadeIn(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {if (e.isIntersecting) {setVisible(true);obs.disconnect();}}, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

export default function HomeLaunch() {
  const [sportsRef, sportsVisible] = useFadeIn();
  const [featuresRef, featuresVisible] = useFadeIn();
  const [ctaRef, ctaVisible] = useFadeIn();
  const [venueRef, venueVisible] = useFadeIn();

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-body text-[#1a1a1a] overflow-x-hidden scroll-smooth" style={{ paddingBottom: "100px" }}>

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-[1400px] mx-auto">
        <img
          src="https://media.base44.com/images/public/6a2e6ee4a90a564f536f865d/0a7202968_Asset1.svg"
          alt="Dibbers"
          className="h-12 w-auto dark:hidden" />
        <img
          src="https://media.base44.com/images/public/6a2e6ee4a90a564f536f865d/b007a5a53_Asset3.svg"
          alt="Dibbers"
          className="h-12 w-auto hidden dark:block" />
        
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-[#1a1a1a]/60 font-medium text-sm hover:text-brand-orange transition-colors">Sign in</Link>
          <Link to="/register" className="bg-[#1a1a1a] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-orange transition-colors">
            Get started
          </Link>
        </div>
      </nav>

      {/* ══════════════════════════════════════
            HERO — gradient color block with noise
         ══════════════════════════════════════ */}
      <section
        className="relative min-h-[88vh] flex flex-col justify-between px-8 pt-16 pb-16 max-w-[1400px] mx-auto rounded-3xl mt-2 mb-8 overflow-hidden"
        style={{ background: "radial-gradient(ellipse at -5% 108%, #EA672D 0%, #EA672Dcc 18%, transparent 52%), radial-gradient(ellipse at 108% -5%, #00452A 0%, #00452Acc 18%, transparent 50%), #F2EFE8", boxShadow: "0 32px 80px -20px rgba(0,0,0,0.18), 0 8px 24px -8px rgba(0,0,0,0.10)" }}>
        
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseOverlay} />

        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center h-full">
          {/* Left: headline */}
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-orange/15 text-brand-orange px-3 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-wide">
              Thailand's sports lifestyle platform
            </div>
            <h1 className="font-heading font-bold text-[clamp(4rem,9vw,9rem)] leading-[0.88] tracking-[-0.04em] text-[#1a1a1a]">
              PLAY<br />
              <span className="text-brand-orange">MORE.</span><br />
              TRACK<br />
              IT.
            </h1>
            <p className="text-base font-light text-[#1a1a1a]/60 leading-relaxed mb-8 max-w-md mt-6">
              Discover and book Padel, Squash, and Pickleball courts across Thailand. Log your sessions, build streaks, and make every hour on court count.
            </p>
            <div className="flex items-center gap-3 flex-wrap hidden">
              <Link to="/register" className="bg-[#1a1a1a] text-white px-6 py-3.5 rounded-xl font-semibold text-center hover:bg-brand-orange transition-all duration-300">
                Start playing
              </Link>
              <Link to="/explore" className="text-[#1a1a1a] border border-[#1a1a1a]/15 px-6 py-3.5 rounded-xl font-semibold hover:bg-white/50 transition-colors backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.3)" }}>
                Browse courts
              </Link>
            </div>
          </div>

          {/* Right: search filters card */}
          <div className="relative scroll-mt-20" id="search-courts">
            <div className="mb-4">
              <h3 className="font-heading text-3xl font-bold text-[#1a1a1a] leading-tight tracking-[-0.03em] mt-4">
                Search courts<br />across Thailand.
              </h3>
              <p className="text-[#1a1a1a]/50 text-sm font-light mt-2">
                Filter by sport, location, and price — then dive straight into booking.
              </p>
            </div>
            <ExploreSearch />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
            HOW IT WORKS
         ══════════════════════════════════════ */}
      <section
        ref={featuresRef}
        className={`max-w-[1400px] mx-auto px-8 py-24 transition-all duration-700 ${featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-4">
          <h2 className="font-heading font-bold text-[clamp(2.5rem,5vw,5rem)] leading-none tracking-[-0.03em]">
            HOW IT<br />WORKS.
          </h2>
          <p className="text-sm font-light text-[#1a1a1a]/40 max-w-xs">
            From discovery to daily habit — three steps to your next session.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-[#1a1a1a]/8 rounded-2xl overflow-hidden shadow-xl shadow-black/5">
          {features.map(({ num, title, desc }, i) =>
          <div
            key={title}
            style={{ transitionDelay: `${i * 80}ms` }}
            className={`bg-[#FAFAFA] p-10 hover:bg-white hover:-translate-y-1 hover:shadow-xl transition-all duration-500 group cursor-default ${featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            
              <span className="text-xs font-light tracking-[0.2em] text-[#1a1a1a]/25 mb-6 block">{num}</span>
              <h3 className="font-heading font-bold text-2xl tracking-[-0.02em] mb-3 group-hover:text-brand-orange transition-colors">{title.toUpperCase()}</h3>
              <p className="text-sm font-light text-[#1a1a1a]/50 leading-relaxed">{desc}</p>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
            SPORTS — dark green gradient color block
         ══════════════════════════════════════ */}
      <section
        ref={sportsRef}
        className={`relative mx-8 rounded-3xl mb-8 px-10 py-20 max-w-[calc(1400px-4rem)] xl:mx-auto overflow-hidden transition-all duration-700 hidden ${sportsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        style={{
          background: "radial-gradient(ellipse at 0% 105%, #EA672D 0%, #c04e20 20%, transparent 50%), radial-gradient(ellipse at 100% -5%, #002a1a 0%, transparent 55%), #00452A",
          boxShadow: "0 40px 100px -20px rgba(0,69,42,0.5), 0 12px 32px -8px rgba(0,0,0,0.25)"
        }}>
        
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseOverlay} />
        <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
          <h2 className="font-heading font-bold text-[clamp(2.5rem,5vw,5rem)] leading-none tracking-[-0.03em] text-white">
            SPORTS<br />WE COVER.
          </h2>
          <p className="text-sm font-light text-white/40 max-w-xs leading-relaxed">
            Every court, every sport, one platform. Whether you play for fun or train to compete.
          </p>
        </div>

        <div className="relative z-10 grid md:grid-cols-3 gap-4">
          {sports.map((s, i) =>
          <div
            key={s.name}
            style={{ transitionDelay: `${i * 80}ms`, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
            className={`rounded-2xl p-8 hover:bg-white/12 hover:-translate-y-1 hover:shadow-2xl transition-all duration-400 group cursor-default ${sportsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            
                <h3 className="font-heading font-bold text-2xl tracking-[-0.02em] text-white mb-2">{s.name.toUpperCase()}</h3>
              <p className="text-sm font-light text-white/45 leading-relaxed">{s.desc}</p>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
            CTA — orange gradient color block
         ══════════════════════════════════════ */}
      <section
        ref={ctaRef}
        className={`relative mx-8 rounded-3xl mb-8 px-10 py-20 max-w-[calc(1400px-4rem)] xl:mx-auto overflow-hidden transition-all duration-700 ${ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        style={{
          background: "radial-gradient(ellipse at 100% 100%, #EA672D 0%, #d4581f 25%, transparent 60%), radial-gradient(ellipse at 0% 0%, #1a1a1a 0%, transparent 50%), #111",
          boxShadow: "0 40px 100px -20px rgba(234,103,45,0.35), 0 12px 32px -8px rgba(0,0,0,0.3)"
        }}>
        
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseOverlay} />
        <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />

        <div className="relative z-10 text-center">
          <h2 className="font-heading font-bold text-[clamp(3rem,7vw,8rem)] leading-[0.88] tracking-[-0.04em] text-white mb-4">
            READY TO<br /><span className="text-brand-orange">PLAY?</span>
          </h2>
          <p className="text-white/50 mb-8 text-lg font-light">Join thousands of players across Thailand.</p>
          <Link to="/register" className="inline-flex items-center justify-center bg-white text-brand-orange px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#FAFAFA] hover:scale-[1.02] transition-all duration-300">
            Create your account
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════
            VENUE OWNERS — frosted glass
         ══════════════════════════════════════ */}
      <section
        ref={venueRef}
        className={`max-w-[1400px] mx-auto px-8 pb-24 transition-all duration-700 ${venueVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        
        <div
          className="relative rounded-3xl p-10 md:p-14 grid md:grid-cols-2 gap-10 items-center overflow-hidden"
          style={frostedCard}>
          
          <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ ...noiseOverlay, opacity: 0.25 }} />
          <div className="relative z-10">
            <p className="text-xs font-light tracking-[0.2em] uppercase text-[#1a1a1a]/30 mb-6">For venue owners</p>
            <h2 className="font-heading font-bold text-[clamp(2rem,4vw,4.5rem)] leading-none tracking-[-0.03em] mb-6">
              OWN A<br />COURT?
            </h2>
            <p className="text-base font-light text-[#1a1a1a]/50 leading-relaxed max-w-sm">
              We're partnering with Padel, Squash, and Pickleball venues across Thailand. Get your courts in front of thousands of active players — manage bookings, set availability, grow your community.
            </p>
          </div>
          <div className="relative z-10 flex flex-col items-start gap-6">
            <p className="text-sm font-light text-[#1a1a1a]/40 leading-relaxed">
              Our team will walk you through everything — no commitment required.
            </p>
            <a
              href="mailto:admin@dibbers.app"
              className="inline-flex items-center justify-center bg-[#1a1a1a] text-white px-6 py-4 rounded-xl font-medium text-sm hover:bg-brand-orange hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-black/20">
              
              admin@dibbers.app
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1a1a1a]/8 px-8 py-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <span className="text-xs font-light tracking-wide text-[#1a1a1a]/30">© 2026 Dibbers · Thailand's Court Sports Platform</span>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="text-xs font-light text-[#1a1a1a]/30 hover:text-[#1a1a1a]/60 transition-colors tracking-wide">Terms of Service</Link>
            <Link to="/privacy" className="text-xs font-light text-[#1a1a1a]/30 hover:text-[#1a1a1a]/60 transition-colors tracking-wide">Privacy Policy</Link>
          </div>
        </div>
      </footer>

      {/* ── Sticky "Find Your Court" button ── */}
      <a
        href="#search-courts"
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-3.5 rounded-full text-xs font-bold tracking-wide shadow-xl shadow-brand-orange/30 hover:bg-brand-brown transition-all duration-300">
        
        FIND YOUR COURT
      </a>
    </div>);

}