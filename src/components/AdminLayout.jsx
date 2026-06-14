import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Building2, Users, ShieldCheck, Menu, X, ChevronRight } from "lucide-react";

const navItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/venues", label: "Venues", icon: Building2 },
  { path: "/admin/users", label: "Users", icon: Users },
];

export default function AdminLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden md:flex flex-col w-64 bg-brand-brown min-h-screen fixed left-0 top-0 z-40">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-brand-orange" />
            <span className="font-heading text-2xl font-bold text-white tracking-wide">Dibbers</span>
          </div>
          <p className="text-white/50 text-xs mt-0.5 font-body">Admin Panel</p>
        </div>
        <nav className="flex-1 py-4 px-3">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path || location.pathname.startsWith(path + "/");
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 font-body font-medium text-sm transition-all ${
                  active ? "bg-brand-orange text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-brand-brown px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-brand-orange" />
          <span className="font-heading text-xl font-bold text-white">Dibbers Admin</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white p-1">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-brand-brown pt-16 px-4">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path} onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-4 py-4 rounded-xl mb-2 bg-white/10 text-white font-body font-medium">
              <div className="flex items-center gap-3"><Icon size={18} />{label}</div>
              <ChevronRight size={16} className="text-white/40" />
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