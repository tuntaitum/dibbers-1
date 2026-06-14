import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CalendarDays, Clock, User, Loader2 } from "lucide-react";
import SportBadge from "@/components/SportBadge";

export default function VenueBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming");

  useEffect(() => {
    base44.auth.me().then(async u => {
      const vs = await base44.entities.Venue.filter({ owner_id: u.id });
      const venueIds = new Set(vs.map(v => v.id));
      const bks = await base44.entities.Booking.list("-date", 200);
      setBookings(bks.filter(b => venueIds.has(b.venue_id)));
      setLoading(false);
    });
  }, []);

  const now = new Date().toISOString().split("T")[0];
  const upcoming = bookings.filter(b => b.date >= now && b.booking_status === "confirmed");
  const past = bookings.filter(b => b.date < now || b.booking_status !== "confirmed");
  const displayed = tab === "upcoming" ? upcoming : past;

  const payStatusColor = {
    paid: "bg-brand-green/10 text-brand-green",
    pending: "bg-amber-100 text-amber-700",
    refunded: "bg-muted text-muted-foreground",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-brand-green px-6 pt-8 pb-5">
        <h1 className="font-heading text-4xl font-bold text-white">BOOKINGS</h1>
        <p className="text-white/60 text-sm mt-0.5">All court reservations</p>
      </div>

      <div className="px-6 py-3 flex gap-2 bg-brand-cream border-b border-border sticky top-0 z-10">
        {[
          { key: "upcoming", label: `Upcoming (${upcoming.length})` },
          { key: "past", label: `Past (${past.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${tab === t.key ? "bg-brand-orange text-white" : "bg-white text-brand-brown border border-border"}`}>{t.label}</button>
        ))}
      </div>

      <div className="px-6 py-4">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-orange" size={28} /></div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20">
            <CalendarDays size={40} className="mx-auto text-muted-foreground mb-3" />
            <p className="font-heading text-xl text-brand-brown">{tab === "upcoming" ? "NO UPCOMING BOOKINGS" : "NO PAST BOOKINGS"}</p>
            <p className="text-muted-foreground text-sm mt-1">They will appear here once players book your courts.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map(b => (
              <div key={b.id} className="bg-white rounded-2xl border border-border p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="font-heading text-lg font-bold text-brand-brown">{b.court_name}</p>
                    <p className="text-muted-foreground text-xs">{b.venue_name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-stat text-xl text-brand-orange">฿{b.price}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${payStatusColor[b.payment_status] || "bg-muted text-muted-foreground"}`}>
                      {b.payment_status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <User size={12} />
                    <span>{b.player_name || b.player_email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays size={12} />
                    <span>{b.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock size={12} />
                    <span>{b.start_time} – {b.end_time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <SportBadge sport={b.sport} />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="font-mono text-xs text-muted-foreground">{b.reference_code}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${b.booking_status === "confirmed" ? "bg-brand-green/10 text-brand-green" : b.booking_status === "cancelled" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
                    {b.booking_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}