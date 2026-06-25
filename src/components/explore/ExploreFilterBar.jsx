import React, { useState } from "react";
import { Search, X, Check, MapPin } from "lucide-react";
import { noiseOverlay, frostedCard } from "@/lib/portalDesign";

export const SPORTS = [
  { key: "All", emoji: "✨", label: "All" },
  { key: "Padel", emoji: "🎾", label: "Padel" },
  { key: "Pickleball", emoji: "🏓", label: "Pickleball" },
  { key: "Squash", emoji: "🏸", label: "Squash" },
];

export const PRICE_RANGES = [
  { label: "Any price", min: 0, max: 99999 },
  { label: "Under ฿300", min: 0, max: 300 },
  { label: "฿300–600", min: 300, max: 600 },
  { label: "฿600+", min: 600, max: 99999 },
];

export default function ExploreFilterBar({
  search, setSearch, sport, setSport, priceIdx, setPriceIdx,
  location, setLocation, locations = [],
  bottomClass = "bottom-6",
  maxW = "max-w-3xl",
}) {
  const [panel, setPanel] = useState("none"); // "none" | "search" | "price" | "location"
  const hasFilters = search.trim() || sport !== "All" || priceIdx !== 0 || location !== "All";

  const togglePanel = (p) => setPanel(panel === p ? "none" : p);
  const clearAll = () => { setSearch(""); setSport("All"); setPriceIdx(0); setLocation("All"); setPanel("none"); };

  return (
    <div className={`fixed ${bottomClass} left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] ${maxW} z-40`}>
      <div className="relative rounded-2xl overflow-hidden animate-fade-in" style={frostedCard}>
        <div className="absolute inset-0 rounded-2xl pointer-events-none" style={noiseOverlay} />

        {/* Expandable panel */}
        {panel !== "none" && (
          <div className="relative z-10 border-b border-[#1a1a1a]/8 px-3 py-3 animate-fade-in" style={{ background: "rgba(247,245,240,0.6)" }}>
            {panel === "search" && (
              <div className="flex items-center gap-2">
                <Search size={16} className="text-[#1a1a1a]/30 flex-shrink-0" />
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search venues or cities..."
                  className="flex-1 bg-transparent text-[#1a1a1a] placeholder-[#1a1a1a]/30 text-sm font-body focus:outline-none"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-[#1a1a1a]/30 hover:text-[#1a1a1a]">
                    <X size={14} />
                  </button>
                )}
              </div>
            )}
            {panel === "price" && (
              <div className="flex items-center gap-2 flex-wrap">
                {PRICE_RANGES.map((pr, i) => (
                  <button
                    key={pr.label}
                    onClick={() => setPriceIdx(i)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      priceIdx === i
                        ? "bg-brand-green text-white border-brand-green"
                        : "bg-white/60 text-[#1a1a1a]/50 border-[#1a1a1a]/12 hover:border-brand-green/50"
                    }`}
                  >
                    {pr.label}
                  </button>
                ))}
              </div>
            )}
            {panel === "location" && (
              <div className="flex items-center gap-2 flex-wrap max-h-40 overflow-y-auto">
                {["All", ...locations].map(loc => (
                  <button
                    key={loc}
                    onClick={() => setLocation(loc)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      location === loc
                        ? "bg-brand-brown text-white border-brand-brown"
                        : "bg-white/60 text-[#1a1a1a]/50 border-[#1a1a1a]/12 hover:border-brand-brown/50"
                    }`}
                  >
                    {loc === "All" ? "All locations" : loc}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main bar */}
        <div className="relative z-10 flex items-center gap-1 px-2 py-2">
          {/* Location toggle */}
          <button
            onClick={() => togglePanel("location")}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              panel === "location" || location !== "All"
                ? "bg-brand-brown text-white"
                : "bg-brand-brown/10 text-brand-brown"
            }`}
          >
            <MapPin size={16} />
            <span className="max-w-[110px] truncate">{location === "All" ? "Location" : location}</span>
          </button>

          {/* Sport pills */}
          <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
            {SPORTS.map(s => {
              const active = sport === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setSport(s.key)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? "bg-brand-orange text-white"
                      : "text-[#1a1a1a]/50 hover:bg-white/40 hover:text-[#1a1a1a]/70"
                  }`}
                >
                  <span>{s.emoji}</span>
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Price toggle */}
          <button
            onClick={() => togglePanel("price")}
            className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold transition-all ${
              panel === "price" || priceIdx !== 0
                ? "bg-brand-green text-white"
                : "text-[#1a1a1a]/50 hover:bg-white/40"
            }`}
          >
            ฿
            {priceIdx !== 0 && <Check size={12} className="ml-0.5" />}
          </button>

          {/* Search toggle */}
          <button
            onClick={() => togglePanel("search")}
            className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
              panel === "search" || search
                ? "bg-brand-brown text-white"
                : "text-[#1a1a1a]/50 hover:bg-white/40"
            }`}
          >
            <Search size={16} />
          </button>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={clearAll}
              className="flex-shrink-0 flex items-center justify-center w-9 h-10 rounded-xl text-destructive/60 hover:text-destructive hover:bg-destructive/5 transition-all"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}