import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, ChevronRight } from "lucide-react";
import SportBadge from "@/components/SportBadge";
import TopNav from "@/components/TopNav";

const PLAYER_TABS = [
  { path: "/explore", label: "Explore" },
  { path: "/bookings", label: "Bookings" },
  { path: "/stats", label: "Stats" },
  { path: "/profile", label: "Profile" },
];

export default function VenueDetailWeb({ venue, courts, slots, selectedCourt, setSelectedCourt, selectedDate, setSelectedDate, dates }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: "#F7F5F0" }}>
      <TopNav items={PLAYER_TABS} showSignIn />

      <div className="max-w-6xl mx-auto px-8 py-8">
        <button onClick={() => navigate(-1)} className="text-[#1a1a1a]/50 hover:text-[#1a1a1a] text-sm font-semibold mb-4 transition-colors">
          Back
        </button>
        <div className="grid grid-cols-5 gap-8">
          {/* Left: venue info */}
          <div className="col-span-3">
            {venue.photos?.[0] ? (
              <img src={venue.photos[0]} alt={venue.name} className="w-full h-80 object-cover rounded-2xl mb-6" />
            ) : (
              <div className="w-full h-80 bg-brand-brown/10 rounded-2xl mb-6 flex items-center justify-center">
                <span className="text-8xl">🏟️</span>
              </div>
            )}

            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="font-heading text-4xl font-bold text-brand-brown">{venue.name}</h2>
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                  <MapPin size={14} />
                  <span>{venue.address || venue.city || "Bangkok"}</span>
                </div>
              </div>
              {venue.price_per_hour && (
                <div className="text-right flex-shrink-0">
                  <p className="font-stat text-3xl text-brand-orange">฿{venue.price_per_hour}</p>
                  <p className="text-sm text-muted-foreground">from / hr</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {(venue.sports || []).map(s => <SportBadge key={s} sport={s} size="lg" />)}
              {venue.payment_mode && (
                <span className="bg-brand-sky text-brand-brown px-3 py-1 rounded-full text-sm font-semibold">
                  {venue.payment_mode === "in_app" ? "💳 Online payment" :
                   venue.payment_mode === "pay_at_venue" ? "🏦 Pay at venue" : "💳 Flexible payment"}
                </span>
              )}
            </div>

            {venue.description && (
              <p className="text-muted-foreground leading-relaxed mb-6">{venue.description}</p>
            )}

            {venue.amenities?.length > 0 && (
              <div>
                <h3 className="font-heading text-xl font-bold text-brand-brown mb-3">AMENITIES</h3>
                <div className="flex flex-wrap gap-2">
                  {venue.amenities.map(a => (
                    <span key={a} className="bg-white border border-border text-brand-brown text-sm px-4 py-1.5 rounded-full font-medium">{a}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: booking panel */}
          <div className="col-span-2">
            <div className="bg-white rounded-2xl border border-border p-6 sticky top-6">
              <h3 className="font-heading text-2xl font-bold text-brand-brown mb-5">BOOK A SLOT</h3>

              {courts.length > 1 && (
                <div className="mb-5">
                  <p className="text-xs font-bold text-muted-foreground mb-2 tracking-wide">SELECT COURT</p>
                  <div className="flex flex-wrap gap-2">
                    {courts.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCourt(c)}
                        className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                          selectedCourt?.id === c.id
                            ? "bg-brand-orange text-white border-brand-orange"
                            : "bg-white text-brand-brown border-border hover:border-brand-orange/50"
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-5">
                <p className="text-xs font-bold text-muted-foreground mb-2 tracking-wide">SELECT DATE</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {dates.map(d => (
                    <button
                      key={d.value}
                      onClick={() => setSelectedDate(d.value)}
                      className={`flex-shrink-0 flex flex-col items-center px-3 py-2.5 rounded-xl border transition-all ${
                        selectedDate === d.value
                          ? "bg-brand-orange text-white border-brand-orange"
                          : "bg-white text-brand-brown border-border hover:border-brand-orange/50"
                      }`}
                    >
                      <span className="text-xs font-semibold opacity-70">{d.label}</span>
                      <span className="font-stat text-xl">{d.day}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground mb-2 tracking-wide">AVAILABLE SLOTS</p>
                {slots.length === 0 ? (
                  <div className="bg-muted rounded-xl py-8 text-center">
                    <Clock size={24} className="mx-auto text-muted-foreground mb-2" />
                    <p className="font-heading text-lg text-brand-brown">No slots available</p>
                    <p className="text-muted-foreground text-sm">Try another date or court.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {slots.map(slot => (
                      <button
                        key={slot.id}
                        onClick={() => navigate(`/book/${slot.id}?venue=${venue.id}&court=${selectedCourt?.id}`)}
                        className="bg-white border border-border rounded-xl p-3 text-left hover:border-brand-orange hover:bg-brand-orange/5 transition-all group"
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
        </div>
      </div>
    </div>
  );
}