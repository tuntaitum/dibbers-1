import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { MapPin, Search, SlidersHorizontal, RefreshCw } from "lucide-react";
import SportBadge from "@/components/SportBadge";

const SPORTS = ["All", "Padel", "Squash", "Pickleball"];
const PRICE_RANGES = [
  { label: "Any price", min: 0, max: 99999 },
  { label: "Under ฿300", min: 0, max: 300 },
  { label: "฿300–600", min: 300, max: 600 },
  { label: "฿600+", min: 600, max: 99999 },
];

export default function Explore() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sport, setSport] = useState("All");
  const [priceIdx, setPriceIdx] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
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

  const filtered = venues.filter(v => {
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || (v.city || "").toLowerCase().includes(search.toLowerCase());
    const matchSport = sport === "All" || (v.sports || []).includes(sport);
    const pr = PRICE_RANGES[priceIdx];
    const matchPrice = !v.price_per_hour || (v.price_per_hour >= pr.min && v.price_per_hour <= pr.max);
    return matchSearch && matchSport && matchPrice;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-brand-brown px-4 pt-5 pb-6">
        <h1 className="font-heading text-4xl font-bold text-white mb-1">EXPLORE</h1>
        <p className="text-white/60 text-sm font-body">Find courts near you</p>
        <div className="mt-4 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search venues or cities..."
            className="w-full bg-white/10 text-white placeholder-white/40 rounded-xl pl-9 pr-4 py-3 text-sm font-body border border-white/10 focus:outline-none focus:border-brand-orange"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-3 bg-brand-cream border-b border-border sticky top-0 z-10">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {SPORTS.map(s => (
            <button
              key={s}
              onClick={() => setSport(s)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                sport === s
                  ? "bg-brand-orange text-white border-brand-orange"
                  : "bg-white text-brand-brown border-border hover:border-brand-orange/50"
              }`}
            >
              {s}
            </button>
          ))}
          <div className="flex-shrink-0 w-px h-4 bg-border mx-1" />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              showFilters ? "bg-brand-brown text-white border-brand-brown" : "bg-white text-brand-brown border-border"
            }`}
          >
            <SlidersHorizontal size={12} /> Filters
          </button>
        </div>
        {showFilters && (
          <div className="mt-3 flex gap-2 flex-wrap animate-fade-in">
            {PRICE_RANGES.map((pr, i) => (
              <button
                key={pr.label}
                onClick={() => setPriceIdx(i)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  priceIdx === i ? "bg-brand-green text-white border-brand-green" : "bg-white text-brand-brown border-border"
                }`}
              >
                {pr.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-32 animate-pulse border border-border" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏟️</div>
            <p className="font-heading text-2xl font-bold text-brand-brown mb-2">NO COURTS FOUND</p>
            <p className="text-muted-foreground text-sm">Try adjusting your filters or search.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-body">{filtered.length} venues found</p>
              <button
                onClick={getLocation}
                disabled={locating}
                className="flex items-center gap-1 text-xs text-brand-orange font-semibold"
              >
                <RefreshCw size={11} className={locating ? "animate-spin" : ""} />
                {userCoords ? "Refresh location" : "Get my location"}
              </button>
            </div>
            {filtered.map(venue => (
              <Link key={venue.id} to={`/venue/${venue.id}`} className="block">
                <div className="bg-white rounded-2xl border border-border p-4 hover:border-brand-orange/50 transition-all hover:shadow-md active:scale-[0.99]">
                  {venue.photos?.[0] ? (
                    <img src={venue.photos[0]} alt={venue.name} className="w-full h-36 object-cover rounded-xl mb-3" />
                  ) : (
                    <div className="w-full h-36 bg-brand-cream rounded-xl mb-3 flex items-center justify-center">
                      <span className="text-4xl">🏟️</span>
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-lg font-bold text-brand-brown leading-tight">{venue.name}</h3>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs mt-0.5">
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
                        <p className="font-heading text-lg font-bold text-brand-orange">฿{venue.price_per_hour}</p>
                        <p className="text-xs text-muted-foreground">per hour</p>
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}