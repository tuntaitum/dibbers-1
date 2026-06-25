import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Link, useSearchParams } from "react-router-dom";
import { MapPin, RefreshCw } from "lucide-react";
import SportBadge from "@/components/SportBadge";
import useIsMobileApp from "@/hooks/useIsMobileApp";
import ExploreWeb from "@/pages/player/web/ExploreWeb";
import ExploreFilterBar, { SPORTS, PRICE_RANGES } from "@/components/explore/ExploreFilterBar";
import { noiseOverlay, frostedCard, gradientBannerExploreBold } from "@/lib/portalDesign";

export default function Explore() {
  const isMobile = useIsMobileApp();
  const [searchParams] = useSearchParams();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sport, setSport] = useState(searchParams.get("sport") || "All");
  const [priceIdx, setPriceIdx] = useState(parseInt(searchParams.get("price")) || 0);
  const [location, setLocation] = useState(searchParams.get("location") || "All");
  const [userCoords, setUserCoords] = useState(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    base44.entities.Venue.filter({ status: "approved" })
      .then(setVenues)
      .finally(() => setLoading(false));
  }, []);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => setLocating(false)
    );
  }, []);

  useEffect(() => { getLocation(); }, []);

  const haversineKm = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  const distanceLabel = (venue) => {
    if (!userCoords || !venue.latitude || !venue.longitude) return null;
    const km = haversineKm(userCoords.lat, userCoords.lng, venue.latitude, venue.longitude);
    return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
  };

  const locations = [...new Set(venues.map(v => v.city).filter(Boolean))].sort();

  if (!isMobile) {
    return (
      <ExploreWeb
        venues={venues}
        loading={loading}
        userCoords={userCoords}
        locating={locating}
        getLocation={getLocation}
        distanceLabel={distanceLabel}
        locations={locations}
        location={location}
        setLocation={setLocation}
      />
    );
  }

  const filtered = venues.filter(v => {
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || (v.city || "").toLowerCase().includes(search.toLowerCase());
    const matchSport = sport === "All" || (v.sports || []).includes(sport);
    const matchLocation = location === "All" || v.city === location;
    const pr = PRICE_RANGES[priceIdx];
    const matchPrice = !v.price_per_hour || (v.price_per_hour >= pr.min && v.price_per_hour <= pr.max);
    return matchSearch && matchSport && matchLocation && matchPrice;
  });

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#FAFAFA" }}>
      {/* ── Dynamic Hero ── */}
      <div className="px-4 pt-20">
        <div className="relative rounded-3xl px-5 py-7 overflow-hidden" style={gradientBannerExploreBold}>
          <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseOverlay} />

          {/* Animated blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div className="absolute -bottom-16 -left-16 w-[220px] h-[220px] animate-streak-pulse">
              <div className="w-full h-full rounded-full bg-brand-orange opacity-20 blur-[70px]" />
            </div>
            <div className="absolute -top-12 -right-12 w-[180px] h-[180px] animate-streak-pulse" style={{ animationDelay: "0.5s" }}>
              <div className="w-full h-full rounded-full bg-brand-green opacity-15 blur-[80px]" />
            </div>
            <div className="absolute top-1/4 right-1/4 w-[140px] h-[140px] animate-streak-pulse" style={{ animationDelay: "1s" }}>
              <div className="w-full h-full rounded-full bg-brand-sky opacity-20 blur-[60px]" />
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-xs font-light tracking-[0.12em] uppercase text-[#1a1a1a]/40">
                {loading ? "Loading..." : `${filtered.length} venues`}
              </span>
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-[-0.04em] text-[#1a1a1a] leading-[0.9]">
              EXPLORE<br />
              <span className="text-brand-orange">COURTS.</span>
            </h1>
            <p className="text-[#1a1a1a]/45 text-sm font-light mt-2">Find and book courts near you</p>

            {/* Quick stats */}
            <div className="flex items-center gap-5 mt-5">
              <div>
                <p className="font-stat text-2xl text-brand-brown">{loading ? "—" : filtered.length}</p>
                <p className="text-[10px] text-[#1a1a1a]/35 font-light">venues</p>
              </div>
              <div className="w-px h-7 bg-[#1a1a1a]/10" />
              <div>
                <p className="font-stat text-2xl text-brand-green">{SPORTS.length - 1}</p>
                <p className="text-[10px] text-[#1a1a1a]/35 font-light">sports</p>
              </div>
              <div className="w-px h-7 bg-[#1a1a1a]/10" />
              <button
                onClick={getLocation}
                disabled={locating}
                className="flex items-center gap-1 text-xs text-brand-orange font-semibold"
              >
                <RefreshCw size={12} className={locating ? "animate-spin" : ""} />
                {userCoords ? "Near me" : "Locate"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl h-32 animate-pulse" style={frostedCard} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-5xl mb-4">🏟️</div>
            <p className="font-heading text-2xl font-bold text-[#1a1a1a] mb-2">NO COURTS FOUND</p>
            <p className="text-[#1a1a1a]/40 text-sm font-light">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-[#1a1a1a]/40 font-light">{filtered.length} venues found</p>
            {filtered.map((venue, i) => (
              <Link
                key={venue.id}
                to={`/venue/${venue.id}`}
                className="block animate-fade-in"
                style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}
              >
                <div className="rounded-2xl overflow-hidden hover:scale-[1.01] transition-all active:scale-[0.99]" style={frostedCard}>
                  {venue.photos?.[0] ? (
                    <div className="relative overflow-hidden">
                      <img
                        src={venue.photos[0]}
                        alt={venue.name}
                        className="w-full h-36 object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-36 flex items-center justify-center" style={{ background: "rgba(210,232,255,0.4)" }}>
                      <span className="text-4xl">🏟️</span>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-lg font-bold text-[#1a1a1a] leading-tight">{venue.name}</h3>
                        <div className="flex items-center gap-1 text-[#1a1a1a]/40 text-xs mt-0.5 font-light">
                          <MapPin size={11} />
                          <span className="truncate">{venue.address || venue.city || "Bangkok"}</span>
                          {distanceLabel(venue) && (
                            <span className="flex-shrink-0 bg-brand-sky text-brand-brown px-1.5 py-0.5 rounded-full font-semibold ml-1">
                              {distanceLabel(venue)}
                            </span>
                          )}
                        </div>
                      </div>
                      {venue.price_per_hour && (
                        <div className="text-right flex-shrink-0">
                          <p className="font-stat text-lg text-brand-orange">฿{venue.price_per_hour}</p>
                          <p className="text-xs text-[#1a1a1a]/35 font-light">per hour</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {(venue.sports || []).map(s => <SportBadge key={s} sport={s} />)}
                      <span className={`ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        venue.payment_mode === "in_app" ? "bg-brand-sky text-brand-brown" :
                        venue.payment_mode === "pay_at_venue" ? "bg-muted text-muted-foreground" :
                        "bg-brand-green/10 text-brand-green"
                      }`}>
                        {venue.payment_mode === "in_app" ? "Online payment" :
                         venue.payment_mode === "pay_at_venue" ? "Pay at venue" : "Flexible payment"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Floating bottom-center filter bar (above bottom nav) ── */}
      <ExploreFilterBar
        search={search}
        setSearch={setSearch}
        sport={sport}
        setSport={setSport}
        priceIdx={priceIdx}
        setPriceIdx={setPriceIdx}
        location={location}
        setLocation={setLocation}
        locations={locations}
        topClass="top-4"
        maxW="max-w-[420px]"
      />
    </div>
  );
}