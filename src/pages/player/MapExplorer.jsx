import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { base44 } from "@/api/base44Client";
import { noiseOverlay, frostedCard } from "@/lib/portalDesign";
import { ArrowLeft, Navigation, Check, Search, X, MapPin } from "lucide-react";

const centerIcon = L.divIcon({
  html: `<div style="width:22px;height:22px;background:#EA672D;border:3px solid white;border-radius:50%;box-shadow:0 2px 10px rgba(0,0,0,0.3);"></div>`,
  className: "",
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const venueIcon = L.divIcon({
  html: `<div style="width:14px;height:14px;background:#00452A;border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.2);"></div>`,
  className: "",
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const RADII = [1, 2, 5, 10, 25];
const DEFAULT_CENTER = { lat: 13.7563, lng: 100.5018 }; // Bangkok

function MapClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

function FlyToCenter({ center, trigger }) {
  const map = useMap();
  useEffect(() => {
    if (trigger > 0 && center) {
      map.flyTo([center.lat, center.lng], 14, { duration: 1 });
    }
  }, [trigger]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export default function MapExplorer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [venues, setVenues] = useState([]);
  const [center, setCenter] = useState(() => {
    const lat = parseFloat(searchParams.get("lat"));
    const lng = parseFloat(searchParams.get("lng"));
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
    return null;
  });
  const [radius, setRadius] = useState(() => parseInt(searchParams.get("radius")) || 5);
  const [locating, setLocating] = useState(false);
  const [flyTrigger, setFlyTrigger] = useState(0);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [searchingLocations, setSearchingLocations] = useState(false);
  const searchTimer = useRef(null);

  useEffect(() => {
    base44.entities.Venue.filter({ status: "approved" }).then(setVenues).catch(() => {});
  }, []);

  // Debounced location search via OpenStreetMap Nominatim
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (locationQuery.trim().length < 3) {
      setLocationResults([]);
      setSearchingLocations(false);
      return;
    }
    setSearchingLocations(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}&countrycodes=th&limit=5`
        );
        const data = await res.json();
        setLocationResults(data);
      } catch {
        setLocationResults([]);
      }
      setSearchingLocations(false);
    }, 400);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [locationQuery]);

  const selectLocation = (result) => {
    setCenter({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
    setFlyTrigger(t => t + 1);
    setLocationQuery(result.display_name.split(",")[0]);
    setLocationResults([]);
  };

  useEffect(() => {
    if (!center && navigator.geolocation) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setFlyTrigger(1);
          setLocating(false);
        },
        () => {
          setCenter(DEFAULT_CENTER);
          setLocating(false);
        }
      );
    } else if (!center) {
      setCenter(DEFAULT_CENTER);
    }
  }, []);

  const haversineKm = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const venuesInRadius = venues.filter(v =>
    v.latitude && v.longitude && center && haversineKm(center.lat, center.lng, v.latitude, v.longitude) <= radius
  );

  const getAreaLabel = () => {
    if (venuesInRadius.length > 0) {
      const nearest = venuesInRadius.reduce((min, v) => {
        const dist = haversineKm(center.lat, center.lng, v.latitude, v.longitude);
        return dist < min.dist ? { city: v.city, dist } : min;
      }, { city: null, dist: Infinity });
      if (nearest.city) return `${nearest.city} area`;
    }
    return `${radius}km area`;
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setFlyTrigger(t => t + 1);
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  const handleApply = () => {
    const params = new URLSearchParams();
    const sport = searchParams.get("sport");
    const price = searchParams.get("price");
    const search = searchParams.get("search");
    if (sport) params.set("sport", sport);
    if (price) params.set("price", price);
    if (search) params.set("search", search);
    if (center) {
      params.set("lat", center.lat.toFixed(6));
      params.set("lng", center.lng.toFixed(6));
      params.set("radius", String(radius));
      params.set("label", getAreaLabel());
    }
    navigate(`/explore?${params.toString()}`);
  };

  if (!center) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAFAFA" }}>
        <div className="w-8 h-8 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#FAFAFA" }}>
      {/* Header */}
      <div className="sticky top-4 z-50 mx-auto max-w-6xl px-3 md:px-4">
        <div className="relative rounded-2xl px-3 py-2.5 overflow-hidden" style={frostedCard}>
          <div className="absolute inset-0 rounded-2xl pointer-events-none" style={noiseOverlay} />
          <div className="relative z-10 flex items-center gap-3">
            <Link to="/explore" className="flex items-center gap-1.5 text-sm font-semibold text-[#1a1a1a]/60 hover:text-brand-orange transition-all flex-shrink-0">
              <ArrowLeft size={16} />
              <span className="hidden md:inline">Back to Explore</span>
            </Link>
            <div className="w-px h-6 bg-[#1a1a1a]/10" />
            <span className="text-sm font-bold text-[#1a1a1a] truncate">Select your area</span>
          </div>
        </div>
      </div>

      {/* Map + Controls */}
      <div className="px-3 md:px-4 pt-4 pb-8 max-w-6xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden" style={frostedCard}>
          <MapContainer
            center={[center.lat, center.lng]}
            zoom={13}
            className="w-full h-[55vh] md:h-[65vh]"
            style={{ background: "#e0e0e0" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <MapClickHandler onClick={(latlng) => setCenter({ lat: latlng.lat, lng: latlng.lng })} />
            <FlyToCenter center={center} trigger={flyTrigger} />
            {center && <Marker position={[center.lat, center.lng]} icon={centerIcon} />}
            {center && (
              <Circle
                center={[center.lat, center.lng]}
                radius={radius * 1000}
                pathOptions={{ color: "#EA672D", fillColor: "#EA672D", fillOpacity: 0.12, weight: 2 }}
              />
            )}
            {venuesInRadius.map(v => (
              <Marker key={v.id} position={[v.latitude, v.longitude]} icon={venueIcon}>
                <Popup>
                  <strong>{v.name}</strong>
                  <br />
                  {v.city || ""}
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Controls overlay */}
          <div className="relative z-10 p-4 md:p-5 space-y-4" style={{ background: "rgba(250,250,250,0.97)" }}>
            {/* Location search */}
            <div className="relative">
              <div className="flex items-center gap-2 bg-white/80 rounded-xl px-3 py-2.5 border border-[#1a1a1a]/10">
                <Search size={16} className="text-[#1a1a1a]/30 flex-shrink-0" />
                <input
                  value={locationQuery}
                  onChange={e => setLocationQuery(e.target.value)}
                  placeholder="Search for an area or address..."
                  className="flex-1 bg-transparent text-[#1a1a1a] placeholder-[#1a1a1a]/30 text-sm font-body focus:outline-none min-w-0"
                />
                {searchingLocations && (
                  <div className="w-4 h-4 border-2 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin flex-shrink-0" />
                )}
                {locationQuery && !searchingLocations && (
                  <button onClick={() => { setLocationQuery(""); setLocationResults([]); }} className="text-[#1a1a1a]/30 hover:text-[#1a1a1a] flex-shrink-0">
                    <X size={14} />
                  </button>
                )}
              </div>
              {locationResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-[#1a1a1a]/10 shadow-lg overflow-hidden z-20">
                  {locationResults.map((result, i) => (
                    <button
                      key={i}
                      onClick={() => selectLocation(result)}
                      className="w-full flex items-start gap-2 px-3 py-2.5 text-left hover:bg-brand-orange/5 transition-colors border-b border-[#1a1a1a]/5 last:border-0"
                    >
                      <MapPin size={14} className="text-brand-orange flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1a1a1a]/70 font-light leading-snug">{result.display_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Navigation size={16} className="text-brand-orange" />
                <p className="text-sm font-bold text-[#1a1a1a]">
                  {locating ? "Finding your location..." : `${venuesInRadius.length} venue${venuesInRadius.length !== 1 ? "s" : ""} within ${radius}km`}
                </p>
              </div>
              <button
                onClick={useMyLocation}
                disabled={locating}
                className="flex items-center gap-1.5 text-xs font-semibold text-brand-orange hover:underline transition-all"
              >
                <Navigation size={13} className={locating ? "animate-pulse" : ""} />
                Use my location
              </button>
            </div>

            {/* Radius selector */}
            <div>
              <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#1a1a1a]/30 mb-2">Search radius</p>
              <div className="flex items-center gap-2 flex-wrap">
                {RADII.map(r => (
                  <button
                    key={r}
                    onClick={() => setRadius(r)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      radius === r
                        ? "bg-brand-orange text-white border-brand-orange"
                        : "bg-white/60 text-[#1a1a1a]/50 border-[#1a1a1a]/12 hover:border-brand-orange/50"
                    }`}
                  >
                    {r}km
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-[#1a1a1a]/40 font-light">
              Tap anywhere on the map to move the center point
            </p>

            <button
              onClick={handleApply}
              className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-brand-orange transition-all shadow-lg shadow-black/10"
            >
              <Check size={16} />
              Apply area filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}