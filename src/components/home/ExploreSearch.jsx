import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ChevronDown, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

const SPORTS = [
  { key: "All", emoji: "✨", label: "All" },
  { key: "Padel", emoji: "🎾", label: "Padel" },
  { key: "Pickleball", emoji: "🏓", label: "Pickleball" },
  { key: "Squash", emoji: "🏸", label: "Squash" },
];

const PRICE_RANGES = [
  { label: "Any price", min: 0, max: 99999 },
  { label: "Under ฿300", min: 0, max: 300 },
  { label: "฿300–600", min: 300, max: 600 },
  { label: "฿600+", min: 600, max: 99999 },
];

export default function ExploreSearch() {
  const navigate = useNavigate();
  const [sport, setSport] = useState("All");
  const [location, setLocation] = useState("All");
  const [priceIdx, setPriceIdx] = useState(0);
  const [search, setSearch] = useState("");
  const [cities, setCities] = useState([]);
  const [openSection, setOpenSection] = useState(null); // "location" | "price" | null

  useEffect(() => {
    base44.entities.Venue.filter({ status: "approved" })
      .then(venues => {
        const unique = [...new Set(venues.map(v => v.city).filter(Boolean))].sort();
        setCities(unique);
      })
      .catch(() => {});
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (sport !== "All") params.set("sport", sport);
    if (location !== "All") params.set("location", location);
    if (priceIdx !== 0) params.set("price", String(priceIdx));
    if (search.trim()) params.set("search", search.trim());
    navigate(`/explore?${params.toString()}`);
  };

  const toggle = (section) => setOpenSection(openSection === section ? null : section);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}>
      {/* Sport pills */}
      <div className="px-5 pt-5 pb-3">
        <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#1a1a1a]/30 mb-3">Sport</p>
        <div className="grid grid-cols-4 gap-2">
          {SPORTS.map(s => {
            const active = sport === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setSport(s.key)}
                className={`flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/25"
                    : "bg-white/60 text-[#1a1a1a]/55 hover:bg-white hover:text-[#1a1a1a]/80 border border-[#1a1a1a]/8"
                }`}
              >
                <span>{s.emoji}</span>
                <span className="truncate">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Location + Price row */}
      <div className="px-5 pb-3 grid grid-cols-2 gap-3">
        {/* Location */}
        <div>
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#1a1a1a]/30 mb-2">Location</p>
          <button
            onClick={() => toggle("location")}
            className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
              location !== "All"
                ? "bg-brand-brown text-white border-brand-brown"
                : "bg-white/60 text-[#1a1a1a]/55 border-[#1a1a1a]/8 hover:bg-white"
            }`}
          >
            <span className="flex items-center gap-1.5 truncate">
              <MapPin size={14} />
              <span className="truncate">{location === "All" ? "All locations" : location}</span>
            </span>
            <ChevronDown size={14} className={`flex-shrink-0 transition-transform ${openSection === "location" ? "rotate-180" : ""}`} />
          </button>
          {openSection === "location" && (
            <div className="mt-2 grid grid-cols-2 gap-1.5 animate-fade-in max-h-32 overflow-y-auto">
              {["All", ...cities].map(loc => (
                <button
                  key={loc}
                  onClick={() => { setLocation(loc); setOpenSection(null); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border truncate ${
                    location === loc
                      ? "bg-brand-brown text-white border-brand-brown"
                      : "bg-white/60 text-[#1a1a1a]/50 border-[#1a1a1a]/10 hover:border-brand-brown/40"
                  }`}
                >
                  {loc === "All" ? "All locations" : loc}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div>
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#1a1a1a]/30 mb-2">Price</p>
          <button
            onClick={() => toggle("price")}
            className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
              priceIdx !== 0
                ? "bg-brand-green text-white border-brand-green"
                : "bg-white/60 text-[#1a1a1a]/55 border-[#1a1a1a]/8 hover:bg-white"
            }`}
          >
            <span className="truncate">{PRICE_RANGES[priceIdx].label}</span>
            <ChevronDown size={14} className={`flex-shrink-0 transition-transform ${openSection === "price" ? "rotate-180" : ""}`} />
          </button>
          {openSection === "price" && (
            <div className="mt-2 grid grid-cols-2 gap-1.5 animate-fade-in">
              {PRICE_RANGES.map((pr, i) => (
                <button
                  key={pr.label}
                  onClick={() => { setPriceIdx(i); setOpenSection(null); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border truncate ${
                    priceIdx === i
                      ? "bg-brand-green text-white border-brand-green"
                      : "bg-white/60 text-[#1a1a1a]/50 border-[#1a1a1a]/10 hover:border-brand-green/40"
                  }`}
                >
                  {pr.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search input */}
      <div className="px-5 pb-3">
        <div className="flex items-center gap-2 bg-white/60 rounded-xl px-4 py-2.5 border border-[#1a1a1a]/8">
          <Search size={16} className="text-[#1a1a1a]/30 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="Search venues or cities..."
            className="flex-1 bg-transparent text-[#1a1a1a] placeholder-[#1a1a1a]/30 text-sm font-body focus:outline-none"
          />
        </div>
      </div>

      {/* Search button */}
      <div className="px-5 pb-5">
        <button
          onClick={handleSearch}
          className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-brand-orange transition-all duration-300 group shadow-lg shadow-black/15"
        >
          Search courts
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}