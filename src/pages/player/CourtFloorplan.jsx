import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { MapPin, Building2, Info } from "lucide-react";
import useIsMobileApp from "@/hooks/useIsMobileApp";
import { frostedGradientOrange, noiseOverlayDark } from "@/lib/portalDesign";
import LoadingPage from "@/components/LoadingPage";
import SportBadge from "@/components/SportBadge";

const sportStyles = {
  Padel: { selectedBg: "bg-brand-orange", text: "text-white", label: "rgba(255,255,255,0.7)" },
  Squash: { selectedBg: "bg-brand-green", text: "text-white", label: "rgba(255,255,255,0.7)" },
  Pickleball: { selectedBg: "bg-brand-sky", text: "text-brand-brown", label: "rgba(93,55,42,0.6)" },
};

export default function CourtFloorplan() {
  const isMobile = useIsMobileApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [selectedVenueId, setSelectedVenueId] = useState(searchParams.get("venue") || "");
  const [venue, setVenue] = useState(null);
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Venue.filter({ status: "approved" }).then((v) => {
      setVenues(v);
      if (selectedVenueId) {
        setVenue(v.find((ven) => ven.id === selectedVenueId) || null);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedVenueId) {
      setCourts([]);
      setSelectedCourt(null);
      setVenue(null);
      return;
    }
    setVenue(venues.find((v) => v.id === selectedVenueId) || null);
    base44.entities.Court.filter({ venue_id: selectedVenueId, status: "active" }).then((c) => {
      setCourts(c);
      setSelectedCourt(null);
    });
  }, [selectedVenueId]);

  const handleVenueChange = (id) => {
    setSelectedVenueId(id);
    setSearchParams(id ? { venue: id } : {});
  };

  if (loading) return <LoadingPage />;

  const pad = isMobile ? "px-4" : "max-w-4xl mx-auto px-8";

  return (
    <div className="min-h-screen pb-8 overflow-x-hidden" style={{ background: "#FAFAFA" }}>
      {/* Hero */}
      <div className={`${isMobile ? "px-4" : "px-8"} pt-5`}>
        <div className="relative rounded-3xl px-5 md:px-8 py-6 md:py-8 overflow-hidden" style={frostedGradientOrange}>
          <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseOverlayDark} />
          <div className="relative z-10">
            <h1 className="font-heading text-4xl font-bold text-white">COURT FLOOR PLAN</h1>
            <p className="text-white/60 text-sm mt-1">Visualize court layouts before you book</p>
          </div>
        </div>
      </div>

      <div className={`${pad} py-5 space-y-5`}>
        {/* Venue selector */}
        <div className="bg-white rounded-2xl border border-border p-4">
          <label className="text-xs font-bold text-muted-foreground tracking-wide mb-2 block">SELECT VENUE</label>
          <select
            value={selectedVenueId}
            onChange={(e) => handleVenueChange(e.target.value)}
            className="w-full bg-[#FAFAFA] border border-border rounded-xl px-4 py-3 text-sm font-semibold text-brand-brown focus:outline-none focus:border-brand-orange"
          >
            <option value="">Choose a venue...</option>
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} — {v.city || "Bangkok"}
              </option>
            ))}
          </select>
        </div>

        {/* Floor plan */}
        {selectedVenueId && venue ? (
          <>
            {/* Venue info bar */}
            <div className="flex items-center gap-2 text-sm">
              <Building2 size={15} className="text-brand-brown flex-shrink-0" />
              <span className="font-semibold text-brand-brown truncate">{venue.name}</span>
              <span className="text-[#1a1a1a]/30 flex-shrink-0">·</span>
              <MapPin size={13} className="text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground truncate">{venue.address || venue.city || "Bangkok"}</span>
            </div>

            {courts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-border py-12 text-center">
                <Info size={28} className="mx-auto text-muted-foreground mb-2" />
                <p className="font-heading text-lg text-brand-brown">No courts listed</p>
                <p className="text-muted-foreground text-sm">This venue hasn't added court layouts yet.</p>
              </div>
            ) : (
              <>
                {/* Floor plan canvas */}
                <div className="relative rounded-2xl border border-border overflow-hidden" style={{ background: "#F2EFE8" }}>
                  <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                      backgroundImage:
                        "linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="relative z-10 flex items-center justify-between px-4 pt-3 pb-1">
                    <span className="text-[10px] font-light tracking-[0.15em] uppercase text-[#1a1a1a]/35">Floor Plan</span>
                    <span className="text-[10px] font-light text-[#1a1a1a]/35">↓ Entrance</span>
                  </div>
                  <div className={`relative z-10 grid gap-3 p-4 pt-2 ${isMobile ? "grid-cols-2" : "grid-cols-3"}`}>
                    {courts.map((court) => {
                      const isSelected = selectedCourt?.id === court.id;
                      const sport = sportStyles[court.sport] || sportStyles.Padel;
                      return (
                        <button
                          key={court.id}
                          onClick={() => setSelectedCourt(court)}
                          className={`relative aspect-[5/3] rounded-lg border-2 transition-all duration-200 overflow-hidden active:scale-[0.97] ${
                            isSelected
                              ? `${sport.selectedBg} ${sport.text} shadow-lg scale-[1.03]`
                              : "bg-white border-[#1a1a1a]/10 hover:border-brand-orange/40 hover:shadow-sm"
                          }`}
                        >
                          <div className={`absolute top-1/2 left-3 right-3 -translate-y-1/2 border-t-2 border-dashed ${isSelected ? "border-white/50" : "border-[#1a1a1a]/10"}`} />
                          <div className="absolute top-3 bottom-3 left-1/2 -translate-x-1/2 w-px" style={{ backgroundColor: isSelected ? "rgba(255,255,255,0.25)" : "rgba(26,26,26,0.08)" }} />
                          <span className={`absolute top-2 left-2.5 text-xs font-bold leading-none ${isSelected ? sport.text : "text-[#1a1a1a]/55"}`}>
                            {court.name}
                          </span>
                          {isSelected && (
                            <div className="absolute top-1.5 right-2 w-5 h-5 rounded-full bg-white/25 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-end justify-between">
                            <span className="text-[9px] font-medium leading-none" style={{ color: isSelected ? sport.label : "rgba(26,26,26,0.35)" }}>
                              {court.sport}
                            </span>
                            <span className={`text-xs font-bold leading-none ${isSelected ? sport.text : "text-brand-orange"}`}>
                              ฿{court.price_per_hour}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 px-1">
                  {Object.entries(sportStyles).map(([sport, style]) => (
                    <div key={sport} className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded ${style.selectedBg}`} />
                      <span className="text-xs text-muted-foreground font-medium">{sport}</span>
                    </div>
                  ))}
                </div>

                {/* Selected court details */}
                {selectedCourt && (
                  <div className="bg-white rounded-2xl border border-border p-5 animate-fade-in">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-heading text-xl font-bold text-brand-brown">{selectedCourt.name}</h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <SportBadge sport={selectedCourt.sport} />
                          <span className="font-stat text-lg text-brand-orange">฿{selectedCourt.price_per_hour}/hr</span>
                        </div>
                      </div>
                    </div>
                    {selectedCourt.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{selectedCourt.description}</p>
                    )}
                    <button
                      onClick={() => navigate(`/venue/${venue.id}`)}
                      className="block w-full bg-[#1a1a1a] text-white py-3 rounded-xl text-sm font-semibold hover:bg-brand-orange transition-colors text-center"
                    >
                      View Booking Options
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-border py-16 text-center">
            <Building2 size={36} className="mx-auto text-muted-foreground mb-3" />
            <p className="font-heading text-lg text-brand-brown">Select a venue</p>
            <p className="text-muted-foreground text-sm mt-1">Choose a venue above to view its court layout.</p>
          </div>
        )}
      </div>
    </div>
  );
}