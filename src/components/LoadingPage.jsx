import React from "react";

const LOGO_LIGHT = "https://media.base44.com/images/public/6a2e6ee4a90a564f536f865d/0a7202968_Asset1.svg";
const LOGO_DARK = "https://media.base44.com/images/public/6a2e6ee4a90a564f536f865d/b007a5a53_Asset3.svg";

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-brand-cream overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-brand-orange opacity-10 blur-[100px] animate-pulse" />
      <div className="absolute -top-32 -right-32 w-[350px] h-[350px] rounded-full bg-brand-green opacity-8 blur-[110px] animate-pulse" style={{ animationDelay: "0.5s" }} />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo with entrance + pulse animation */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-brand-orange/20 blur-2xl animate-pulse" />
          <img
            src={LOGO_LIGHT}
            alt="Dibbers"
            className="relative h-16 md:h-20 w-auto dark:hidden dibbers-logo-enter"
          />
          <img
            src={LOGO_DARK}
            alt="Dibbers"
            className="relative h-16 md:h-20 w-auto hidden dark:block dibbers-logo-enter"
          />
        </div>

        {/* Animated loading bar */}
        <div className="w-32 h-[3px] rounded-full bg-[#1a1a1a]/8 overflow-hidden dark:bg-white/8">
          <div className="h-full rounded-full bg-brand-orange dibbers-loading-bar" />
        </div>
      </div>

      <style>{`
        @keyframes dibbers-logo-enter {
          0% {
            opacity: 0;
            transform: scale(0.7) translateY(12px);
            filter: blur(8px);
          }
          60% {
            opacity: 1;
            transform: scale(1.06) translateY(0);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }
        .dibbers-logo-enter {
          animation: dibbers-logo-enter 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes dibbers-loading-bar {
          0% { transform: scaleX(0); transform-origin: left; }
          50% { transform: scaleX(1); transform-origin: left; }
          51% { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
        .dibbers-loading-bar {
          animation: dibbers-loading-bar 1.4s ease-in-out infinite;
          width: 100%;
        }
      `}</style>
    </div>
  );
}