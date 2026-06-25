import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { frostedCard, noiseOverlay } from "@/lib/portalDesign";

export default function TopNav({ items = [], logoLink = "/explore", activeBg = "bg-brand-orange", showSignIn = false }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <nav className="sticky top-4 z-50 mx-auto max-w-6xl px-4">
      <div className="relative rounded-2xl px-4 py-2.5 overflow-hidden" style={frostedCard}>
        <div className="absolute inset-0 rounded-2xl pointer-events-none" style={noiseOverlay} />
        <div className="relative z-10 flex items-center justify-between">
          <Link to={logoLink}>
            <img
              src="https://media.base44.com/images/public/6a2e6ee4a90a564f536f865d/2e92b8183_260620_LogoDesign-Negative.png"
              alt="Dibbers"
              className="h-9 w-auto brightness-0"
            />
          </Link>
          {items.length > 0 && (
            <div className="flex items-center gap-1">
              {items.map(({ path, label, icon: Icon }) => {
                const active = location.pathname === path || location.pathname.startsWith(path + "/");
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      active
                        ? `${activeBg} text-white`
                        : "text-[#1a1a1a]/55 hover:bg-white/30 hover:text-[#1a1a1a]"
                    }`}
                  >
                    {Icon && <Icon size={16} />}
                    {label}
                  </Link>
                );
              })}
              {showSignIn && !isAuthenticated && (
                <Link
                  to="/login"
                  className="ml-2 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#1a1a1a] text-white hover:bg-brand-orange transition-all"
                >
                  <LogIn size={16} />
                  Sign in
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}