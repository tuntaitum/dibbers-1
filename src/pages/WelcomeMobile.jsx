import React from "react";
import { Link } from "react-router-dom";

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const noiseOverlay = {
  backgroundImage: NOISE_SVG,
  backgroundSize: "180px 180px",
  mixBlendMode: "overlay",
  opacity: 0.55,
};

export default function WelcomeMobile() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-body text-[#1a1a1a] overflow-x-hidden flex flex-col">

      {/* ── Top bar ── */}
      <nav className="flex items-center justify-between px-5 py-4">
        <img
          src="https://media.base44.com/images/public/6a2e6ee4a90a564f536f865d/0a7202968_Asset1.svg"
          alt="Dibbers"
          className="h-9 w-auto dark:hidden"
        />
        <img
          src="https://media.base44.com/images/public/6a2e6ee4a90a564f536f865d/b007a5a53_Asset3.svg"
          alt="Dibbers"
          className="h-9 w-auto hidden dark:block"
        />
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-light tracking-[0.12em] uppercase text-[#1a1a1a]/40">Thailand</span>
          <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
        </div>
      </nav>

      {/* ══════════════════════════════════════
           HERO — full screen welcome
        ══════════════════════════════════════ */}
      <section
        className="relative flex-1 flex flex-col mx-4 rounded-3xl overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at -5% 108%, #EA672D 0%, #EA672Dcc 18%, transparent 52%), radial-gradient(ellipse at 108% -5%, #00452A 0%, #00452Acc 18%, transparent 50%), var(--banner-base)",
        }}
      >
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseOverlay} />

        {/* Animated blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          <div className="absolute -bottom-20 -left-16 w-[280px] h-[280px] animate-streak-pulse">
            <div className="w-full h-full rounded-full bg-brand-orange opacity-25 blur-[80px]" />
          </div>
          <div
            className="absolute -top-16 -right-16 w-[220px] h-[220px] animate-streak-pulse"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="w-full h-full rounded-full bg-brand-green opacity-20 blur-[90px]" />
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-between px-7 py-10">
          {/* Top content */}
          <div>
            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-[#1a1a1a]/50 mb-5">
              Padel · Squash · Pickleball
            </p>
            <h1 className="font-heading font-bold text-[3rem] leading-[0.92] tracking-[-0.04em] text-[#1a1a1a]">
              WELCOME<br />
              TO<br />
              <span className="text-brand-orange drop-shadow-sm">DIBBERS.</span>
            </h1>
            <p className="text-sm font-light text-[#1a1a1a]/55 leading-relaxed mt-6 max-w-[260px]">
              Your home for court sports in Thailand. Discover, book, and track every session — all in one place.
            </p>
          </div>

          {/* Bottom CTAs */}
          <div className="flex flex-col gap-3">
            {/* Frosted glass card wrapping actions */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.45)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.6)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
              }}
            >
              <Link
                to="/register"
                className="block w-full bg-[#1a1a1a] text-white py-3.5 rounded-xl text-sm font-medium tracking-wide hover:bg-brand-orange transition-colors duration-300 text-center"
              >
                Sign Up
              </Link>
              <Link
                to="/explore"
                className="block w-full bg-white/80 text-[#1a1a1a] py-3.5 rounded-xl text-sm font-medium tracking-wide hover:bg-white transition-colors duration-300 text-center mt-2.5 border border-[#1a1a1a]/12"
              >
                Browse as Guest
              </Link>
            </div>

            <p className="text-center text-[12px] font-light text-[#1a1a1a]/40 tracking-wide">
              Already have an account?{" "}
              <Link to="/login" className="text-brand-orange font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-5 py-5">
        <span className="text-[11px] font-light tracking-wide text-[#1a1a1a]/30">
          © 2026 Dibbers · Thailand's Court Sports Platform
        </span>
      </footer>
    </div>
  );
}