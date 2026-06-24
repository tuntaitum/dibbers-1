import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { frostedCard, noiseOverlay } from "@/lib/portalDesign";

const navItems = [
  { path: "/venue/dashboard", label: "Dashboard" },
  { path: "/venue/courts", label: "My Courts" },
  { path: "/venue/bookings", label: "Bookings" },
  { path: "/venue/settings", label: "Settings" },
];

export default function VenueLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen" style={{ background: "#F7F5F0" }}>
      <main className="pb-28">
        <Outlet />
      </main>

      {/* Floating bottom-center frosted glass nav */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="relative rounded-2xl px-3 py-2 overflow-hidden" style={frostedCard}>
          <div className="absolute inset-0 rounded-2xl pointer-events-none" style={noiseOverlay} />
          <div className="relative z-10 flex items-center gap-1">
            {navItems.map(({ path, label }) => {
              const active = location.pathname === path || location.pathname.startsWith(path + "/");
              return (
                <Link
                  key={path}
                  to={path}
                  className={`px-4 py-2 rounded-xl font-body font-medium text-sm transition-all ${
                    active ? "bg-brand-green text-white" : "text-[#1a1a1a]/55 hover:bg-white/30 hover:text-[#1a1a1a]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}