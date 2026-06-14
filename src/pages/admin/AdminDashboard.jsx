import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Building2, Users, CalendarCheck, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Venue.list(),
      base44.entities.Booking.list("-created_date", 10),
    ]).then(([vs, bks]) => {
      setVenues(vs);
      setBookings(bks);
      setLoading(false);
    });
  }, []);

  const pending = venues.filter(v => v.status === "pending");
  const approved = venues.filter(v => v.status === "approved");
  const totalRevenue = bookings.filter(b => b.payment_status === "paid").reduce((s, b) => s + (b.price || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-brand-brown px-6 pt-8 pb-6">
        <h1 className="font-heading text-4xl font-bold text-white">ADMIN OVERVIEW</h1>
        <p className="text-white/60 text-sm mt-0.5">Platform health at a glance</p>
      </div>

      <div className="px-6 py-5 space-y-5">
        {pending.length > 0 && (
          <Link to="/admin/venues" className="block bg-brand-orange/10 border border-brand-orange/30 rounded-2xl p-4 hover:bg-brand-orange/15 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-heading text-lg font-bold text-brand-orange">{pending.length} VENUE{pending.length > 1 ? "S" : ""} PENDING REVIEW</p>
                <p className="text-brand-brown/70 text-sm">Tap to review and approve</p>
              </div>
              <span className="bg-brand-orange text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">{pending.length}</span>
            </div>
          </Link>
        )}

        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Building2, label: "LIVE VENUES", value: approved.length, color: "text-brand-green" },
            { icon: Clock, label: "PENDING", value: pending.length, color: "text-brand-orange" },
            { icon: CalendarCheck, label: "BOOKINGS", value: bookings.length, color: "text-brand-brown" },
            { icon: Users, label: "REVENUE", value: `฿${totalRevenue.toLocaleString()}`, color: "text-brand-orange" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className={color} />
                <span className="text-xs text-muted-foreground font-semibold">{label}</span>
              </div>
              <p className={`font-stat text-4xl ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-xl font-bold text-brand-brown">RECENT BOOKINGS</h2>
            <Link to="/admin/venues" className="text-brand-orange text-xs font-semibold">Manage venues →</Link>
          </div>
          <div className="space-y-2">
            {bookings.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">No bookings yet.</p>
            ) : bookings.slice(0, 5).map(b => (
              <div key={b.id} className="bg-white rounded-xl border border-border p-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-brand-brown text-sm">{b.venue_name}</p>
                  <p className="text-muted-foreground text-xs">{b.player_name} · {b.date} · {b.start_time}</p>
                </div>
                <span className="font-stat text-lg text-brand-orange">฿{b.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}