import React, { useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MapPin, RefreshCw, Navigation } from "lucide-react";
import SportBadge from "@/components/SportBadge";
import { noiseOverlay, frostedCard, gradientBannerExploreBold } from "@/lib/portalDesign";
import ExploreFilterBar, { SPORTS, PRICE_RANGES } from "@/components/explore/ExploreFilterBar";

export default function ExploreWeb({ venues, loading, userCoords, locating, getLocation, distanceLabel, geoFilter, setGeoFilter }) {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sport, setSport] = useState(() => {
    const s = searchParams.get("sport");
    return s ? s.split(",") : [];
  });
  const [priceIdx, setPriceIdx] = useState(parseInt(searchParams.get("price")) || 0);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const heroRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
  };

  const haversineKm = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const filtered = venues.filter(v => {
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || (v.city || "").toLowerCase().includes(search.toLowerCase());
    const matchSport = sport.length === 0 || (v.sports || []).some(s => sport.includes(s));
    const matchGeo = !geoFilter || (v.latitude && v.longitude && haversineKm(geoFilter.lat, geoFilter.lng, v.latitude, v.longitude) <= geoFilter.radius);
    const pr = PRICE_RANGES[priceIdx];
    const matchPrice = !v.price_per_hour || (v.price_per_hour >= pr.min && v.price_per_hour <= pr.max);
    return matchSearch && matchSport && matchGeo && matchPrice;
  });

  const blobOrange = {
    transform: `translate(${(mouse.x - 0.5) * -50}px, ${(mouse.y - 0.5) * -30}px)`,
    transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  };
  const blobGreen = {
    transform: `translate(${(mouse.x - 0.5) * 40}px, ${(mouse.y - 0.5) * 25}px)`,
    transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  };
  const blobSky = {
    transform: `translate(${(mouse.x - 0.5) * 30}px, ${(mouse.y - 0.5) * -20}px)`,
    transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* ── Dynamic Hero ── */}
      <div className="px-8 pt-20">
        <div
          ref={heroRef}
          onMouseMove={handleMouseMove}
          className="relative rounded-3xl px-8 py-10 overflow-hidden"
          style={gradientBannerExploreBold}
        >
          <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseOverlay} />

          {/* Animated parallax blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div style={blobOrange} className="absolute -bottom-20 -left-20 w-[300px] h-[300px]">
              <div className="w-full h-full rounded-full bg-brand-orange opacity-20 blur-[80px] animate-streak-pulse" />
            </div>
            <div style={blobGreen} className="absolute -top-16 -right-16 w-[260px] h-[260px]">
              <div className="w-full h-full rounded-full bg-brand-green opacity-15 blur-[90px] animate-streak-pulse" style={{ animationDelay: "0.5s" }} />
            </div>
            <div style={blobSky} className="absolute top-1/3 right-1/3 w-[200px] h-[200px]">
              <div className="w-full h-full rounded-full bg-brand-sky opacity-25 blur-[70px] animate-streak-pulse" style={{ animationDelay: "1s" }} />
            </div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-xs font-light tracking-[0.15em] uppercase text-[#1a1a1a]/40">
              {loading ? "Loading venues..." : `${filtered.length} venues across Thailand`}
              </span>
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-[-0.04em] text-[#1a1a1a] leading-[0.9]">
              EXPLORE<br />
              <span className="text-brand-orange">COURTS.</span>
            </h1>
            <p className="text-[#1a1a1a]/45 font-light mt-3 max-w-md">
              Discover and book padel, squash & pickleball courts. Filter by sport, price, and proximity.
            </p>

            {/* Quick stats */}
            <div className="flex items-center gap-6 mt-6">
              <div>
                <p className="font-stat text-3xl text-brand-brown">{loading ? "—" : filtered.length}</p>
                <p className="text-xs text-[#1a1a1a]/35 font-light">venues found</p>
              </div>
              <div className="w-px h-8 bg-[#1a1a1a]/10" />
              <div>
                <p className="font-stat text-3xl text-brand-green">{loading ? "—" : SPORTS.length}</p>
                <p className="text-xs text-[#1a1a1a]/35 font-light">sports</p>
              </div>
              {userCoords && (
                <>
                  <div className="w-px h-8 bg-[#1a1a1a]/10" />
                  <div className="flex items-center gap-1.5">
                    <Navigation size={14} className="text-brand-orange" />
                    <p className="text-xs text-[#1a1a1a]/40 font-light">Near you</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-[#1a1a1a]/40 font-light">
            {loading ? "Loading..." : `Showing ${filtered.length} venue${filtered.length !== 1 ? "s" : ""}`}
          </p>
          <button
            onClick={getLocation}
            disabled={locating}
            className="text-sm text-brand-orange font-semibold hover:underline transition-all"
          >
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
          <div className="text-center py-24 animate-fade-in">
            <p className="font-heading text-3xl font-bold text-[#1a1a1a] mb-2">NO COURTS FOUND</p>
            <p className="text-[#1a1a1a]/40 font-light">Try adjusting your filters or search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((venue, i) => (
              <Link
                key={venue.id}
                to={`/venue/${venue.id}`}
                className="block group animate-fade-in"
                style={{ animationDelay: `${Math.min(i * 50, 400)}ms` }}
              >
                <div className="rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300" style={frostedCard}>
                  {venue.photos?.[0] ? (
                    <div className="relative overflow-hidden">
                      <img
                        src={venue.photos[0]}
                        alt={venue.name}
                        className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ) : (
                    <div className="w-full h-44 flex items-center justify-center group-hover:scale-110 transition-transform duration-500" style={{ background: "rgba(210,232,255,0.3)" }}>
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

      {/* ── Floating top filter bar ── */}
      <ExploreFilterBar
        search={search}
        setSearch={setSearch}
        sport={sport}
        setSport={setSport}
        priceIdx={priceIdx}
        setPriceIdx={setPriceIdx}
        geoFilter={geoFilter}
        setGeoFilter={setGeoFilter}
        topClass="top-4"
      />
    </div>
  );
}