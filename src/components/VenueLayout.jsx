import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronRight } from "lucide-react";
import { noiseOverlayDark, venueSidebarBg } from "@/lib/portalDesign";

const navItems = [
  { path: "/venue/dashboard", label: "Dashboard" },
  { path: "/venue/courts", label: "My Courts" },
  { path: "/venue/bookings", label: "Bookings" },
  { path: "/venue/settings", label: "Settings" },
];

export default function VenueLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: "#F7F5F0" }}>
      {/* Desktop Sidebar — dark green gradient with noise */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen fixed left-0 top-0 z-40" style={venueSidebarBg}>
        <div className="absolute inset-0 pointer-events-none" style={noiseOverlayDark} />
        <div className="relative z-10 p-6 border-b border-white/10">
          <span className="font-heading text-2xl font-bold text-white tracking-[-0.02em]">Dibbers</span>
          <p className="text-white/40 text-xs mt-0.5 font-body font-light tracking-[0.15em] uppercase">Venue Portal</p>
        </div>
        <nav className="relative z-10 flex-1 py-4 px-3">
          {navItems.map(({ path, label }) => {
            const active = location.pathname === path || location.pathname.startsWith(path + "/");
            return (
              <Link
                key={path}
                to={path}
                className={`block px-4 py-3 rounded-xl mb-1 font-body font-medium text-sm transition-all ${
                  active ? "bg-brand-orange text-white" : "text-white/55 hover:bg-white/8 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between" style={venueSidebarBg}>
        <div className="absolute inset-0 pointer-events-none" style={noiseOverlayDark} />
        <span className="relative font-heading text-xl font-bold text-white tracking-[-0.02em]">Dibbers</span>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="relative text-white p-1">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 pt-16 px-4" style={venueSidebarBg}>
          <div className="absolute inset-0 pointer-events-none" style={noiseOverlayDark} />
          {navItems.map(({ path, label }) => (
            <Link key={path} to={path} onClick={() => setMobileOpen(false)}
              className="relative flex items-center justify-between px-4 py-4 rounded-xl mb-2 bg-white/8 text-white font-body font-medium">
              {label}
              <ChevronRight size={16} className="text-white/30" />
            </Link>
          ))}
        </div>
      )}

      <main className="flex-1 md:ml-64">
        <div className="pt-14 md:pt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}