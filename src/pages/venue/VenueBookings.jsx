import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";
import SportBadge from "@/components/SportBadge";
import { frostedCard } from "@/lib/portalDesign";
import PageBanner from "@/components/PageBanner";

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
    <div className="min-h-screen" style={{ background: "#F7F5F0" }}>
      <PageBanner title="BOOKINGS" subtitle="All court reservations" variant="dark" />

      {/* Tabs */}
      <div className="px-6 md:px-10 py-3 flex gap-2 border-b border-[#1a1a1a]/8 sticky top-0 z-10" style={{ background: "#F7F5F0" }}>
        {[
          { key: "upcoming", label: `Upcoming (${upcoming.length})` },
          { key: "past", label: `Past (${past.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${tab === t.key ? "bg-brand-orange text-white" : "text-[#1a1a1a]/50 border border-[#1a1a1a]/12"}`}>{t.label}</button>
        ))}
      </div>

      <div className="px-6 md:px-10 py-4">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-orange" size={28} /></div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-heading text-xl text-[#1a1a1a]">{tab === "upcoming" ? "NO UPCOMING BOOKINGS" : "NO PAST BOOKINGS"}</p>
            <p className="text-[#1a1a1a]/40 text-sm mt-1 font-light">They will appear here once players book your courts.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map(b => (
              <div key={b.id} className="rounded-2xl p-4" style={frostedCard}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="font-heading text-lg font-bold text-[#1a1a1a]">{b.court_name}</p>
                    <p className="text-[#1a1a1a]/40 text-xs font-light">{b.venue_name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-stat text-xl text-brand-orange">฿{b.price}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${payStatusColor[b.payment_status] || "bg-muted text-muted-foreground"}`}>
                      {b.payment_status}
                    </span>
                  </div>
                </div>
                {/* Detail rows — no icons */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <p className="text-xs text-[#1a1a1a]/40 font-light">Player: <span className="text-[#1a1a1a]/70">{b.player_name || b.player_email}</span></p>
                  <p className="text-xs text-[#1a1a1a]/40 font-light">Date: <span className="text-[#1a1a1a]/70">{b.date}</span></p>
                  <p className="text-xs text-[#1a1a1a]/40 font-light">Time: <span className="text-[#1a1a1a]/70">{b.start_time} – {b.end_time}</span></p>
                  <div><SportBadge sport={b.sport} /></div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a]/8">
                  <span className="font-mono text-xs text-[#1a1a1a]/40">{b.reference_code}</span>
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