import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Compass, CalendarDays, BarChart2, User } from "lucide-react";

const tabs = [
  { path: "/explore", label: "Explore", icon: Compass },
  { path: "/bookings", label: "Bookings", icon: CalendarDays },
  { path: "/stats", label: "Stats", icon: BarChart2 },
  { path: "/profile", label: "Profile", icon: User },
];

export default function PlayerLayout() {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-brand-brown border-t border-brand-brown/30 z-50 safe-area-pb">
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path || location.pathname.startsWith(path + "/");
            return (
              <Link key={path} to={path} className="flex flex-col items-center gap-0.5 px-3 py-1 group">
                <Icon
                  size={22}
                  className={active ? "text-brand-orange" : "text-white/50 group-hover:text-white/80 transition-colors"}
                />
                <span className={`text-[10px] font-body font-medium ${active ? "text-brand-orange" : "text-white/50 group-hover:text-white/80"} transition-colors`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}