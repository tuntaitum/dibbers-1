import React from "react";

const sportConfig = {
  Padel: { color: "bg-brand-orange text-white", icon: "🎾" },
  Squash: { color: "bg-brand-green text-white", icon: "🏸" },
  Pickleball: { color: "bg-brand-sky text-brand-brown", icon: "🏓" },
};

export default function SportBadge({ sport, size = "sm" }) {
  const cfg = sportConfig[sport] || { color: "bg-muted text-foreground", icon: "🏅" };
  const sizeClass = size === "lg" ? "px-3 py-1.5 text-sm" : "px-2.5 py-0.5 text-xs";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-body font-semibold ${cfg.color} ${sizeClass}`}>
      <span>{cfg.icon}</span>
      {sport}
    </span>
  );
}