import React from "react";
import { Outlet } from "react-router-dom";
import TopNav from "@/components/TopNav";

const navItems = [
  { path: "/admin/dashboard", label: "Dashboard" },
  { path: "/admin/venues", label: "Venues" },
  { path: "/admin/users", label: "Users" },
  { path: "/admin/waitlist", label: "Waitlist" },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>
      <TopNav items={navItems} logoLink="/admin/dashboard" activeBg="bg-brand-orange" />
      <main className="pt-4 pb-8">
        <Outlet />
      </main>
    </div>
  );
}