import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Compass, CalendarDays, BarChart2, User, Sun, Moon } from "lucide-react";
import useIsMobileApp from "@/hooks/useIsMobileApp";
import { frostedCard, noiseOverlay } from "@/lib/portalDesign";
import TopNav from "@/components/TopNav";
import { useTheme } from "@/lib/ThemeContext";

const tabs = [
  { path: "/explore", label: "Explore", icon: Compass },
  { path: "/bookings", label: "Bookings", icon: CalendarDays },
  { path: "/stats", label: "Stats", icon: BarChart2 },
  { path: "/profile", label: "Profile", icon: User },
];

export default function PlayerLayout() {
  const location = useLocation();
  const isMobile = useIsMobileApp();
  const { theme, toggle } = useTheme();

  if (isMobile) {
    return (
      <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-brand-cream">
        <main className="flex-1 pb-28 overflow-x-hidden">
          <Outlet />
        </main>

        {/* Floating bottom frosted glass tab bar */}
        <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-[420px] z-50">
          <div className="relative rounded-2xl px-1.5 py-1.5 overflow-hidden" style={frostedCard}>
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={noiseOverlay} />
            <div className="relative z-10 flex items-center justify-around">
              {tabs.map(({ path, label, icon: Icon }) => {
                const active = location.pathname === path || location.pathname.startsWith(path + "/");
                return (
                  <Link key={path} to={path} className="flex flex-col items-center gap-0.5 px-4 py-2 group">
                    <div className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${active ? "bg-brand-orange/20" : ""}`}>
                      <Icon
                        size={21}
                        className={active ? "text-brand-orange" : "text-[#1a1a1a]/40 group-hover:text-[#1a1a1a]/70 transition-colors"}
                      />
                    </div>
                    <span className={`text-[9px] font-body font-semibold tracking-wide ${active ? "text-brand-orange" : "text-[#1a1a1a]/40 group-hover:text-[#1a1a1a]/70"} transition-colors`}>
                      {label}
                    </span>
                  </Link>
                );
              })}
              <button onClick={toggle} className="no-frost flex flex-col items-center gap-0.5 px-4 py-2 group">
                <div className="w-7 h-7 flex items-center justify-center rounded-lg">
                  {theme === "dark" ? <Sun size={21} className="text-[#1a1a1a]/40 group-hover:text-[#1a1a1a]/70 transition-colors" /> : <Moon size={21} className="text-[#1a1a1a]/40 group-hover:text-[#1a1a1a]/70 transition-colors" />}
                </div>
                <span className="text-[9px] font-body font-semibold tracking-wide text-[#1a1a1a]/40 group-hover:text-[#1a1a1a]/70 transition-colors">
                  {theme === "dark" ? "Light" : "Dark"}
                </span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <TopNav items={tabs} showSignIn />
      <main className="pt-4">
        <Outlet />
      </main>
    </div>
  );
}