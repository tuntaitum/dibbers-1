import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import useIsMobileApp from "@/hooks/useIsMobileApp";
import LandingMobile from "@/pages/LandingMobile";
import WelcomeMobile from "@/pages/WelcomeMobile";

const sports = [
  { name: "Padel", desc: "Find courts across Bangkok & beyond" },
  { name: "Pickleball", desc: "Thailand's fastest growing sport" },
  { name: "Squash", desc: "Premium indoor courts near you" },
];

const features = [
  { num: "01", title: "Discover", desc: "Browse courts near you. Filter by sport, price, and availability in seconds." },
  { num: "02", title: "Book", desc: "Reserve any slot instantly. Pay in-app or at the venue — your choice." },
  { num: "03", title: "Track", desc: "Log every session, build weekly streaks, and watch your game hours grow." },
];

function useFadeIn(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* Inline SVG noise as data URL — grayscale fractal */
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const noiseOverlay = {
  backgroundImage: NOISE_SVG,
  backgroundSize: "180px 180px",
  mixBlendMode: "overlay",
  opacity: 0.55,
};

export default function Landing() {
  const isMobile = useIsMobileApp();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const heroRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
  };

  const handleNotify = async (e, source = "hero") => {
    e.preventDefault();
    if (!email) return;
    await base44.entities.WaitlistEntry.create({ email, source, submitted_at: new Date().toISOString() });
    setSubmitted(true);
  };

  const [howRef, howVisible] = useFadeIn();
  const [sportsRef, sportsVisible] = useFadeIn();
  const [ctaRef, ctaVisible] = useFadeIn();
  const [venueRef, venueVisible] = useFadeIn();

  if (isMobile) return <WelcomeMobile />;

  const blobOrange = {
    transform: `translate(${(mouse.x - 0.5) * -40}px, ${(mouse.y - 0.5) * -25}px)`,
    transition: "transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  };
  const blobGreen = {
    transform: `translate(${(mouse.x - 0.5) * 35}px, ${(mouse.y - 0.5) * 20}px)`,
    transition: "transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  };

  return (
    <div className="min-h-screen bg-brand-cream font-body text-[#1a1a1a] overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-[1400px] mx-auto">
        <img
          src="https://media.base44.com/images/public/6a2e6ee4a90a564f536f865d/0a7202968_Asset1.svg"
          alt="Dibbers"
          className="h-12 w-auto dark:hidden"
        />
        <img
          src="https://media.base44.com/images/public/6a2e6ee4a90a564f536f865d/b007a5a53_Asset3.svg"
          alt="Dibbers"
          className="h-12 w-auto hidden dark:block"
        />
        <div className="flex items-center gap-6">
          <span className="text-xs font-light tracking-[0.15em] uppercase text-[#1a1a1a]/40">
            Thailand · Launching 2026
          </span>
          <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
        </div>
      </nav>

      {/* ══════════════════════════════════════
          HERO — gradient color block with noise
      ══════════════════════════════════════ */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-[92vh] flex flex-col justify-between px-8 pt-16 pb-16 max-w-[1400px] mx-auto rounded-3xl mt-2 mb-8 overflow-hidden"
        style={{ background: "var(--page-bg)", boxShadow: "0 32px 80px -20px rgba(0,0,0,0.18), 0 8px 24px -8px rgba(0,0,0,0.10)" }}
      >
        {/* Gradient base */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: "radial-gradient(ellipse at -5% 108%, #EA672D 0%, #EA672Dcc 18%, transparent 52%), radial-gradient(ellipse at 108% -5%, #00452A 0%, #00452Acc 18%, transparent 50%), var(--banner-base)",
          }}
        />
        {/* Noise overlay */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseOverlay} />

        {/* Parallax blobs (softer, secondary layer) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          <div style={blobOrange} className="absolute -bottom-32 -left-32 w-[480px] h-[480px]">
            <div className="w-full h-full rounded-full bg-brand-orange opacity-30 blur-[100px]" />
          </div>
          <div style={blobGreen} className="absolute -top-32 -right-32 w-[400px] h-[400px]">
            <div className="w-full h-full rounded-full bg-brand-green opacity-25 blur-[110px]" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-12">
          <div className="flex-1">
            <p className="text-xs font-light tracking-[0.2em] uppercase text-[#1a1a1a]/50 mb-8">
              Padel · Squash · Pickleball
            </p>
            <h1 className="font-heading font-bold text-[clamp(4rem,9vw,9rem)] leading-[0.9] tracking-[-0.04em] text-[#1a1a1a]">
              DISCOVER<br />
              <span className="text-brand-orange drop-shadow-sm">MORE.</span><br />
              TRACK<br />
              <span className="text-brand-orange drop-shadow-sm">MORE.</span>
            </h1>
          </div>

          <div className="md:max-w-xs relative z-10">
            {/* Frosted glass card */}
            <div
              className="rounded-2xl p-6 mb-2"
              style={{
                background: "rgba(255,255,255,0.45)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.6)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
              }}
            >
              {/* Inner noise on frosted card */}
              <div className="relative overflow-hidden rounded-xl">
                <p className="text-base font-light text-[#1a1a1a]/65 leading-relaxed mb-6">
                  Dibbers is coming to Thailand. Discover and book courts — log sessions, build streaks, and make every hour on court count.
                </p>

                {submitted ? (
                  <div className="flex items-center gap-3 text-brand-green py-2">
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
                      className="w-full px-4 py-3.5 rounded-xl border border-[#1a1a1a]/12 bg-white/80 text-[#1a1a1a] text-sm placeholder:text-[#1a1a1a]/30 focus:outline-none focus:border-brand-orange transition-colors font-light"
                    />
                    <button
                      type="submit"
                      className="w-full bg-[#1a1a1a] text-white py-3.5 rounded-xl text-sm font-medium tracking-wide hover:bg-brand-orange transition-colors duration-300 text-center"
                    >
                      Notify me when we launch
                    </button>
                  </form>
                )}
              </div>
              <p className="text-xs font-light text-[#1a1a1a]/30 mt-3 tracking-wide">Be the first to know. No spam.</p>
            </div>
          </div>
        </div>

        {/* Sports tags */}
        <div className="relative z-10 flex items-center gap-3 mt-12 flex-wrap">
          {sports.map(s => (
            <div
              key={s.name}
              className="flex items-center gap-2 rounded-full px-4 py-2 hover:scale-105 transition-transform duration-200"
              style={{
                background: "rgba(255,255,255,0.5)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.7)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <span className="text-xs font-medium tracking-[0.1em] uppercase text-[#1a1a1a]/70">{s.name}</span>
            </div>
          ))}
          <span className="text-xs font-light text-[#1a1a1a]/35 tracking-wide ml-1">Available at launch</span>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section
        ref={howRef}
        className={`max-w-[1400px] mx-auto px-8 py-24 transition-all duration-700 ${howVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-4">
          <h2 className="font-heading font-bold text-[clamp(2.5rem,5vw,5rem)] leading-none tracking-[-0.03em]">
            HOW IT<br />WORKS.
          </h2>
          <p className="text-sm font-light text-[#1a1a1a]/40 max-w-xs">
            From discovery to daily habit — three steps to your next session.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-[#1a1a1a]/8 rounded-2xl overflow-hidden shadow-xl shadow-black/5">
          {features.map(({ num, title, desc }, i) => (
            <div
              key={title}
              style={{ transitionDelay: `${i * 80}ms` }}
              className={`bg-[#FAFAFA] p-10 hover:bg-white hover:-translate-y-1 hover:shadow-xl transition-all duration-500 group cursor-default ${howVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="text-xs font-light tracking-[0.2em] text-[#1a1a1a]/25 mb-6 block">{num}</span>
              <h3 className="font-heading font-bold text-2xl tracking-[-0.02em] mb-3 group-hover:text-brand-orange transition-colors">{title.toUpperCase()}</h3>
              <p className="text-sm font-light text-[#1a1a1a]/50 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SPORTS — dark green gradient color block
      ══════════════════════════════════════ */}
      <section
        ref={sportsRef}
        className={`relative mx-8 rounded-3xl mb-8 px-10 py-20 max-w-[calc(1400px-4rem)] xl:mx-auto overflow-hidden transition-all duration-700 ${sportsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        style={{
          background: "radial-gradient(ellipse at 0% 105%, #EA672D 0%, #c04e20 20%, transparent 50%), radial-gradient(ellipse at 100% -5%, #002a1a 0%, transparent 55%), #00452A",
          boxShadow: "0 40px 100px -20px rgba(0,69,42,0.5), 0 12px 32px -8px rgba(0,0,0,0.25)",
        }}
      >
        {/* Noise */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseOverlay} />

        {/* Frosted inner glow */}
        <div
          className="absolute top-0 left-0 right-0 h-px rounded-t-3xl"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
          <h2 className="font-heading font-bold text-[clamp(2.5rem,5vw,5rem)] leading-none tracking-[-0.03em] text-white">
            SPORTS<br />WE COVER.
          </h2>
          <p className="text-sm font-light text-white/40 max-w-xs leading-relaxed">
            Every court, every sport, one platform.
          </p>
        </div>

        <div className="relative z-10 grid md:grid-cols-3 gap-4">
          {sports.map((s, i) => (
            <div
              key={s.name}
              style={{
                transitionDelay: `${i * 80}ms`,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
              className={`rounded-2xl p-8 hover:bg-white/12 hover:-translate-y-1 hover:shadow-2xl transition-all duration-400 group cursor-default ${sportsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <h3 className="font-heading font-bold text-2xl tracking-[-0.02em] text-white mb-2">{s.name.toUpperCase()}</h3>
              <p className="text-sm font-light text-white/45 leading-relaxed">{s.desc}</p>
            </div>
          ))}
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
          boxShadow: "0 40px 100px -20px rgba(234,103,45,0.35), 0 12px 32px -8px rgba(0,0,0,0.3)",
        }}
      >
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseOverlay} />
        <div
          className="absolute top-0 left-0 right-0 h-px rounded-t-3xl"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-12">
          <div className="flex-1">
            <p className="text-xs font-light tracking-[0.2em] uppercase text-white/30 mb-6">Coming soon</p>
            <h2 className="font-heading font-bold text-[clamp(3rem,7vw,8rem)] leading-[0.88] tracking-[-0.04em] text-white">
              DON'T<br />
              MISS<br />
              <span className="text-brand-orange">LAUNCH.</span>
            </h2>
          </div>
          <div className="md:max-w-sm w-full">
            {submitted ? (
              <div
                className="rounded-2xl p-8 text-center"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(16px)" }}
              >
                <div className="text-3xl mb-3">✅</div>
                <p className="font-medium text-white">You're on the list!</p>
                <p className="text-sm font-light text-white/40 mt-1">We'll reach out when we go live.</p>
              </div>
            ) : (
              <div
                className="rounded-2xl p-6"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(16px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
              >
                <form onSubmit={(e) => handleNotify(e, "bottom_cta")} className="flex flex-col gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-4 py-3.5 rounded-xl border border-white/15 bg-white/10 text-white text-sm placeholder:text-white/35 focus:outline-none focus:border-brand-orange transition-colors font-light"
                  />
                  <button
                    type="submit"
                    className="w-full bg-brand-orange text-white py-3.5 rounded-xl text-sm font-medium tracking-wide hover:bg-[#ff7a3d] transition-colors duration-300"
                  >
                    Get notified
                  </button>
                </form>
                <p className="text-xs font-light text-white/25 mt-3 tracking-wide">No spam. Unsubscribe anytime.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          VENUE OWNERS
      ══════════════════════════════════════ */}
      <section
        ref={venueRef}
        className={`max-w-[1400px] mx-auto px-8 pb-24 transition-all duration-700 ${venueVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div
          className="relative rounded-3xl p-10 md:p-14 grid md:grid-cols-2 gap-10 items-center overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.9)",
            boxShadow: "0 24px 64px -12px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,1)",
          }}
        >
          <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ ...noiseOverlay, opacity: 0.25 }} />
          <div className="relative z-10">
            <p className="text-xs font-light tracking-[0.2em] uppercase text-[#1a1a1a]/30 mb-6">For venue owners</p>
            <h2 className="font-heading font-bold text-[clamp(2rem,4vw,4.5rem)] leading-none tracking-[-0.03em] mb-6">
              OWN A<br />COURT?
            </h2>
            <p className="text-base font-light text-[#1a1a1a]/50 leading-relaxed max-w-sm">
              We're partnering with venues across Thailand. Get your courts in front of thousands of active players.
            </p>
          </div>
          <div className="relative z-10 flex flex-col items-start gap-6">
            <p className="text-sm font-light text-[#1a1a1a]/40 leading-relaxed">
              Our team will walk you through everything — no commitment required.
            </p>
            <a
              href="mailto:admin@dibbers.app"
              className="inline-flex items-center justify-center bg-[#1a1a1a] text-white px-6 py-4 rounded-xl font-medium text-sm hover:bg-brand-orange hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-black/20"
            >
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
    </div>
  );
}