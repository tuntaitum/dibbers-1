import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { MapPin, Search, SlidersHorizontal, RefreshCw } from "lucide-react";
import SportBadge from "@/components/SportBadge";
import { noiseOverlay, frostedCard, gradientBannerExploreBold } from "@/lib/portalDesign";

const SPORTS = ["All", "Padel", "Squash", "Pickleball"];
const PRICE_RANGES = [
  { label: "Any price", min: 0, max: 99999 },
  { label: "Under ฿300", min: 0, max: 300 },
  { label: "฿300–600", min: 300, max: 600 },
  { label: "฿600+", min: 600, max: 99999 },
];

export default function ExploreWeb({ venues, loading, userCoords, locating, getLocation, distanceLabel }) {
  const [search, setSearch] = useState("");
  const [sport, setSport] = useState("All");
  const [priceIdx, setPriceIdx] = useState(0);

  const filtered = venues.filter(v => {
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || (v.city || "").toLowerCase().includes(search.toLowerCase());
    const matchSport = sport === "All" || (v.sports || []).includes(sport);
    const pr = PRICE_RANGES[priceIdx];
    const matchPrice = !v.price_per_hour || (v.price_per_hour >= pr.min && v.price_per_hour <= pr.max);
    return matchSearch && matchSport && matchPrice;
  });

  return (
    <div className="min-h-screen" style={{ background: "#F7F5F0" }}>
      {/* Header — sky gradient banner */}
      <div className="px-8 pt-8">
        <div className="relative rounded-3xl px-8 py-8 overflow-hidden" style={gradientBannerExploreBold}>
          <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseOverlay} />
          <div className="relative z-10 max-w-6xl mx-auto">
            <h1 className="font-heading text-5xl font-bold tracking-[-0.03em] text-[#1a1a1a] mb-1">EXPLORE COURTS</h1>
            <p className="text-[#1a1a1a]/45 font-light mb-6">Find and book padel, squash & pickleball courts in Thailand</p>
            <div className="relative max-w-xl">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search venues or cities..."
                className="w-full bg-white/70 text-[#1a1a1a] placeholder-[#1a1a1a]/30 rounded-xl pl-11 pr-4 py-3.5 text-sm font-body border border-white/60 focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 flex gap-8">
        {/* Sidebar filters */}
        <aside className="w-56 flex-shrink-0">
          <div className="sticky top-6 space-y-6">
            <div>
              <h3 className="font-heading text-sm font-bold text-[#1a1a1a] mb-3 tracking-wide">SPORT</h3>
              <div className="flex flex-col gap-1.5">
                {SPORTS.map(s => (
                  <button
                    key={s}
                    onClick={() => setSport(s)}
                    className={`text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      sport === s ? "bg-brand-orange text-white" : "text-[#1a1a1a]/60 hover:bg-white/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-[#1a1a1a] mb-3 tracking-wide">PRICE / HOUR</h3>
              <div className="flex flex-col gap-1.5">
                {PRICE_RANGES.map((pr, i) => (
                  <button
                    key={pr.label}
                    onClick={() => setPriceIdx(i)}
                    className={`text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      priceIdx === i ? "bg-brand-green text-white" : "text-[#1a1a1a]/60 hover:bg-white/50"
                    }`}
                  >
                    {pr.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-[#1a1a1a]/40 font-light">{filtered.length} venues found</p>
            <button
              onClick={getLocation}
              disabled={locating}
              className="flex items-center gap-1.5 text-sm text-brand-orange font-semibold hover:underline"
            >
              <RefreshCw size={13} className={locating ? "animate-spin" : ""} />
              {userCoords ? "Refresh location" : "Get my location"}
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="rounded-2xl h-64 animate-pulse" style={frostedCard} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🏟️</div>
              <p className="font-heading text-3xl font-bold text-[#1a1a1a] mb-2">NO COURTS FOUND</p>
              <p className="text-[#1a1a1a]/40 font-light">Try adjusting your filters or search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(venue => (
                <Link key={venue.id} to={`/venue/${venue.id}`} className="block group">
                  <div className="rounded-2xl overflow-hidden hover:shadow-lg transition-all" style={frostedCard}>
                    {venue.photos?.[0] ? (
                      <img src={venue.photos[0]} alt={venue.name} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-44 flex items-center justify-center" style={{ background: "rgba(210,232,255,0.3)" }}>
                        <span className="text-5xl">🏟️</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-heading text-xl font-bold text-[#1a1a1a] leading-tight mb-1">{venue.name}</h3>
                      <div className="flex items-center gap-1 text-[#1a1a1a]/40 text-xs mb-3 font-light">
                        <MapPin size={11} />
                        <span className="truncate">{venue.address || venue.city || "Bangkok"}</span>
                        {distanceLabel(venue) && (
                          <span className="flex-shrink-0 bg-brand-sky text-brand-brown px-1.5 py-0.5 rounded-full font-semibold ml-1">
                            {distanceLabel(venue)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {(venue.sports || []).map(s => <SportBadge key={s} sport={s} />)}
                        </div>
                        {venue.price_per_hour && (
                          <p className="font-stat text-lg text-brand-orange">฿{venue.price_per_hour}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}