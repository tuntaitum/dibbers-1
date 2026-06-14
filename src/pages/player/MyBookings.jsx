import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CalendarDays, Clock, Loader2 } from "lucide-react";
import SportBadge from "@/components/SportBadge";
import useIsMobileApp from "@/hooks/useIsMobileApp";

const statusConfig = {
  confirmed: { label: "Confirmed", color: "bg-brand-green/10 text-brand-green" },
  cancelled: { label: "Cancelled", color: "bg-destructive/10 text-destructive" },
  completed: { label: "Completed", color: "bg-muted text-muted-foreground" },
};

export default function MyBookings() {
  const isMobile = useIsMobileApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming");
  const [user, setUser] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      base44.entities.Booking.filter({ player_id: u.id }, "-created_date", 50)
        .then(setBookings)
        .finally(() => setLoading(false));
    });
  }, []);

  const now = new Date().toISOString().split("T")[0];
  const upcoming = bookings.filter(b => b.date >= now && b.booking_status === "confirmed");
  const past = bookings.filter(b => b.date < now || b.booking_status !== "confirmed");

  const cancel = async (booking) => {
    if (!window.confirm("Cancel this booking?")) return;
    setCancelling(booking.id);
    await base44.entities.Booking.update(booking.id, { booking_status: "cancelled" });
    if (booking.slot_id) {
      await base44.entities.TimeSlot.update(booking.slot_id, { status: "available" });
    }
    setBookings(bs => bs.map(b => b.id === booking.id ? { ...b, booking_status: "cancelled" } : b));
    setCancelling(null);
  };

  const displayed = tab === "upcoming" ? upcoming : past;

  const pad = isMobile ? "px-4" : "max-w-3xl mx-auto px-8";

  return (
    <div className="min-h-screen bg-background">
      <div className={`bg-brand-brown ${isMobile ? "px-4 pt-5 pb-5" : "px-8 py-8"}`}>
        <div className={isMobile ? "" : "max-w-3xl mx-auto"}>
          <h1 className="font-heading text-4xl font-bold text-white">MY BOOKINGS</h1>
          <p className="text-white/60 text-sm mt-0.5">Manage your court time</p>
        </div>
      </div>

      <div className={`${pad} py-3 flex gap-2 border-b border-border bg-brand-cream sticky top-0 z-10`}>
        {[
          { key: "upcoming", label: `Upcoming (${upcoming.length})` },
          { key: "past", label: `Past (${past.length})` },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              tab === t.key ? "bg-brand-orange text-white" : "bg-white text-brand-brown border border-border"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={`${pad} py-4`}>
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-orange" size={28} /></div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20">
            <CalendarDays size={40} className="mx-auto text-muted-foreground mb-3" />
            <p className="font-heading text-2xl text-brand-brown mb-1">
              {tab === "upcoming" ? "NO UPCOMING BOOKINGS" : "NO PAST BOOKINGS"}
            </p>
            <p className="text-muted-foreground text-sm">
              {tab === "upcoming" ? "Time to get on the court." : "Your completed sessions will appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map(b => {
              const status = statusConfig[b.booking_status] || statusConfig.confirmed;
              return (
                <div key={b.id} className="bg-white rounded-2xl border border-border p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-heading text-lg font-bold text-brand-brown leading-tight">{b.venue_name}</h3>
                      <p className="text-muted-foreground text-xs">{b.court_name}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>{status.label}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays size={12} />
                      <span>{b.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock size={12} />
                      <span>{b.start_time} – {b.end_time}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SportBadge sport={b.sport} />
                      <span className="font-stat text-xl text-brand-orange">฿{b.price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{b.reference_code}</span>
                      {b.booking_status === "confirmed" && b.date >= now && (
                        <button
                          onClick={() => cancel(b)}
                          disabled={cancelling === b.id}
                          className="text-xs text-destructive font-semibold hover:underline disabled:opacity-50"
                        >
                          {cancelling === b.id ? "..." : "Cancel"}
                        </button>
                      )}
                    </div>
                  </div>

                  {b.payment_status === "pending" && b.payment_mode === "pay_at_venue" && b.booking_status === "confirmed" && (
                    <div className="mt-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 text-xs text-amber-700">
                      💳 Please pay at the venue. Present your reference code.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}