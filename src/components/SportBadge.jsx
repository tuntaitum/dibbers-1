import React from "react";

const sportConfig = {
  Padel: { color: "bg-brand-orange text-white" },
  Squash: { color: "bg-brand-green text-white" },
  Pickleball: { color: "bg-brand-sky text-brand-brown" },
};

export default function SportBadge({ sport, size = "sm" }) {
  const cfg = sportConfig[sport] || { color: "bg-muted text-foreground" };
  const sizeClass = size === "lg" ? "px-3 py-1.5 text-sm" : "px-2.5 py-0.5 text-xs";
  return (
    <span className={`inline-flex items-center rounded-full font-body font-semibold ${cfg.color} ${sizeClass}`}>
      {sport}
    </span>
  );
}