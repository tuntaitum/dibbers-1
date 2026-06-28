import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, MapPin, Clock, ChevronRight } from "lucide-react";
import SportBadge from "@/components/SportBadge";
import { format, addDays } from "date-fns";
import useIsMobileApp from "@/hooks/useIsMobileApp";
import VenueDetailWeb from "@/pages/player/web/VenueDetailWeb";

export default function VenueDetail() {
  const isMobile = useIsMobileApp();
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [courts, setCourts] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(true);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(new Date(), i);
    return { value: format(d, "yyyy-MM-dd"), label: format(d, "EEE"), day: format(d, "d") };
  });

  useEffect(() => {
    Promise.all([
      base44.entities.Venue.filter({ id }),
      base44.entities.Court.filter({ venue_id: id, status: "active" }),
    ]).then(([vs, cs]) => {
      const v = vs[0];
      setVenue(v);
      setCourts(cs);
      if (cs.length > 0) setSelectedCourt(cs[0]);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!selectedCourt || !selectedDate) return;
    base44.entities.TimeSlot.filter({
      court_id: selectedCourt.id,
      date: selectedDate,
    }).then(s => setSlots(s.filter(sl => sl.status === "available")));
  }, [selectedCourt, selectedDate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center overflow-x-hidden" style={{ background: "#FAFAFA" }}>
      <div className="w-8 h-8 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
    </div>
  );

  if (!venue) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 overflow-x-hidden" style={{ background: "#FAFAFA" }}>
      <p className="text-2xl">🏟️</p>
      <p className="font-heading text-xl text-brand-brown">Venue not found</p>
      <button onClick={() => navigate(-1)} className="text-brand-orange text-sm font-semibold">← Go back</button>
    </div>
  );

  if (!isMobile) {
    return (
      <VenueDetailWeb
        venue={venue}
        courts={courts}
        slots={slots}
        selectedCourt={selectedCourt}
        setSelectedCourt={setSelectedCourt}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        dates={dates}
      />
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#FAFAFA" }}>
      {/* Hero — full bleed */}
      <div className="relative">
        {venue.photos?.[0] ? (
          <img src={venue.photos[0]} alt={venue.name} className="w-full h-60 object-cover" />
        ) : (
          <div className="w-full h-60 bg-brand-brown flex items-center justify-center">
            <span className="text-6xl">🏟️</span>
          </div>
        )}
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg active:scale-95 transition-transform z-10">
          <ArrowLeft size={20} className="text-brand-brown" />
        </button>
      </div>

      <div className="px-4 py-5">
        {/* Venue Info */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-2xl font-bold text-brand-brown leading-tight">{venue.name}</h1>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
              <MapPin size={13} />
              <span className="truncate">{venue.address || venue.city || "Bangkok"}</span>
            </div>
          </div>
          {venue.price_per_hour && (
            <div className="text-right flex-shrink-0">
              <p className="font-stat text-2xl text-brand-orange">฿{venue.price_per_hour}</p>
              <p className="text-xs text-muted-foreground">from / hr</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {(venue.sports || []).map(s => <SportBadge key={s} sport={s} size="lg" />)}
          {venue.payment_mode && (
            <span className="bg-brand-sky text-brand-brown px-3 py-1 rounded-full text-xs font-semibold">
              {venue.payment_mode === "in_app" ? "💳 Online payment" :
               venue.payment_mode === "pay_at_venue" ? "🏦 Pay at venue" : "💳 Flexible payment"}
            </span>
          )}
        </div>

        {venue.description && (
          <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{venue.description}</p>
        )}

        {venue.amenities?.length > 0 && (
          <div className="mb-5">
            <h3 className="font-heading text-lg font-bold text-brand-brown mb-2">AMENITIES</h3>
            <div className="flex flex-wrap gap-2">
              {venue.amenities.map(a => (
                <span key={a} className="bg-white border border-border text-brand-brown text-xs px-3 py-1 rounded-full font-medium">{a}</span>
              ))}
            </div>
          </div>
        )}

        {/* Court Select */}
        {courts.length > 1 && (
          <div className="mb-5">
            <h3 className="font-heading text-lg font-bold text-brand-brown mb-2">SELECT COURT</h3>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {courts.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCourt(c)}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    selectedCourt?.id === c.id
                      ? "bg-brand-orange text-white border-brand-orange"
                      : "bg-white text-brand-brown border-border"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Date picker */}
        <div className="mb-5">
          <h3 className="font-heading text-lg font-bold text-brand-brown mb-2">SELECT DATE</h3>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {dates.map(d => (
              <button
                key={d.value}
                onClick={() => setSelectedDate(d.value)}
                className={`flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-xl border transition-all ${
                  selectedDate === d.value
                    ? "bg-brand-orange text-white border-brand-orange"
                    : "bg-white text-brand-brown border-border"
                }`}
              >
                <span className="text-xs font-semibold opacity-70">{d.label}</span>
                <span className="font-stat text-xl">{d.day}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Slots */}
        <div>
          <h3 className="font-heading text-lg font-bold text-brand-brown mb-2">AVAILABLE SLOTS</h3>
          {slots.length === 0 ? (
            <div className="bg-white rounded-2xl border border-border py-10 text-center">
              <Clock size={28} className="mx-auto text-muted-foreground mb-2" />
              <p className="font-heading text-lg text-brand-brown">No slots available</p>
              <p className="text-muted-foreground text-sm">Try another date or court.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {slots.map(slot => (
                <button
                  key={slot.id}
                  onClick={() => navigate(`/book/${slot.id}?venue=${venue.id}&court=${selectedCourt?.id}`)}
                  className="bg-white border border-border rounded-xl p-3 text-left hover:border-brand-orange hover:bg-brand-orange/5 transition-all active:scale-[0.98]"
                >
                  <p className="font-semibold text-brand-brown text-sm">{slot.start_time} – {slot.end_time}</p>
                  <p className="font-stat text-brand-orange text-lg mt-0.5">฿{slot.price}</p>
                  <div className="flex items-center justify-center mt-1">
                    <span className="text-xs text-muted-foreground">Available</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}