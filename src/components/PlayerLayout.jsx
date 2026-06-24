import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Compass, CalendarDays, BarChart2, User, LogIn } from "lucide-react";
import useIsMobileApp from "@/hooks/useIsMobileApp";
import { useAuth } from "@/lib/AuthContext";
import { frostedCard, noiseOverlay } from "@/lib/portalDesign";

const tabs = [
  { path: "/explore", label: "Explore", icon: Compass },
  { path: "/bookings", label: "Bookings", icon: CalendarDays },
  { path: "/stats", label: "Stats", icon: BarChart2 },
  { path: "/profile", label: "Profile", icon: User },
];

export default function PlayerLayout() {
  const location = useLocation();
  const isMobile = useIsMobileApp();
  const { isAuthenticated } = useAuth();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-zinc-200 flex items-start justify-center">
        {/* Phone shell — max 430px, centered on desktop */}
        <div className="relative w-full max-w-[430px] min-h-screen bg-background flex flex-col shadow-2xl">
          {/* iOS-style status bar spacer */}
          <div className="h-[44px] bg-brand-brown flex-shrink-0" />

          <main className="flex-1 overflow-y-auto pb-[80px]">
            <Outlet />
          </main>

          {/* Bottom tab bar — iOS style */}
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-brand-brown/95 backdrop-blur border-t border-white/10 z-50">
            <div className="flex items-center justify-around px-2 pt-2 pb-[18px]">
              {tabs.map(({ path, label, icon: Icon }) => {
                const active = location.pathname === path || location.pathname.startsWith(path + "/");
                return (
                  <Link key={path} to={path} className="flex flex-col items-center gap-1 px-4 py-1 group">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${active ? "bg-brand-orange/20" : ""}`}>
                      <Icon
                        size={22}
                        className={active ? "text-brand-orange" : "text-white/45 group-hover:text-white/70 transition-colors"}
                      />
                    </div>
                    <span className={`text-[10px] font-body font-semibold tracking-wide ${active ? "text-brand-orange" : "text-white/45 group-hover:text-white/70"} transition-colors`}>
                      {label}
                    </span>
                  </Link>
                );
              })}
            </div>
            {/* iOS home indicator line */}
            <div className="flex justify-center pb-1">
              <div className="w-32 h-1 bg-white/20 rounded-full" />
            </div>
          </nav>
        </div>
      </div>
    );
  }

  // Web layout — floating frosted glass top nav
  return (
    <div className="min-h-screen" style={{ background: "#F7F5F0" }}>
      {/* Floating top nav */}
      <nav className="sticky top-4 z-50 mx-auto max-w-6xl px-4">
        <div className="relative rounded-2xl px-4 py-2.5 overflow-hidden" style={frostedCard}>
          <div className="absolute inset-0 rounded-2xl pointer-events-none" style={noiseOverlay} />
          <div className="relative z-10 flex items-center justify-between">
            <Link to="/explore"><img src="https://media.base44.com/images/public/6a2e6ee4a90a564f536f865d/2e92b8183_260620_LogoDesign-Negative.png" alt="Dibbers" className="h-9 w-auto brightness-0" /></Link>
            <div className="flex items-center gap-1">
              {tabs.map(({ path, label, icon: Icon }) => {
                const active = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      active ? "bg-brand-orange text-white" : "text-[#1a1a1a]/55 hover:bg-white/30 hover:text-[#1a1a1a]"
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                );
              })}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="ml-2 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#1a1a1a] text-white hover:bg-brand-orange transition-all"
                >
                  <LogIn size={16} />
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}