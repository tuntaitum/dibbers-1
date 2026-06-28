import React from "react";
import { Outlet } from "react-router-dom";
import TopNav from "@/components/TopNav";

const navItems = [
  { path: "/venue/dashboard", label: "Dashboard" },
  { path: "/venue/courts", label: "My Courts" },
  { path: "/venue/bookings", label: "Bookings" },
  { path: "/venue/settings", label: "Settings" },
];

export default function VenueLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-brand-cream">
      <TopNav items={navItems} logoLink="/venue/dashboard" activeBg="bg-brand-green" />
      <main className="pt-4 pb-8">
        <Outlet />
      </main>
    </div>
  );
}