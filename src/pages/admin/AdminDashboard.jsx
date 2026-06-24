import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { frostedCard } from "@/lib/portalDesign";
import PageBanner from "@/components/PageBanner";

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

  const stats = [
    { label: "Live Venues", value: approved.length, color: "text-brand-green" },
    { label: "Pending", value: pending.length, color: "text-brand-orange" },
    { label: "Bookings", value: bookings.length, color: "text-brand-brown" },
    { label: "Revenue", value: `฿${totalRevenue.toLocaleString()}`, color: "text-brand-orange" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#F7F5F0" }}>
      <PageBanner title="ADMIN OVERVIEW" subtitle="Platform health at a glance" variant="orange" />

      <div className="px-6 md:px-10 py-5 space-y-5">
        {pending.length > 0 && (
          <Link to="/admin/venues" className="block rounded-2xl p-5 hover:scale-[1.01] transition-transform" style={{ background: "rgba(234,103,45,0.08)", border: "1px solid rgba(234,103,45,0.2)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-heading text-lg font-bold text-brand-orange">{pending.length} VENUE{pending.length > 1 ? "S" : ""} PENDING REVIEW</p>
                <p className="text-[#1a1a1a]/50 text-sm font-light">Tap to review and approve</p>
              </div>
              <span className="bg-brand-orange text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">{pending.length}</span>
            </div>
          </Link>
        )}

        {/* Stats — no icons, frosted cards */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ label, value, color }) => (
            <div key={label} className="rounded-2xl p-5" style={frostedCard}>
              <span className="text-xs text-[#1a1a1a]/35 font-semibold tracking-[0.15em] uppercase">{label}</span>
              <p className={`font-stat text-4xl mt-2 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Recent bookings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-xl font-bold text-[#1a1a1a]">RECENT BOOKINGS</h2>
            <Link to="/admin/venues" className="text-brand-orange text-xs font-semibold">Manage venues →</Link>
          </div>
          <div className="space-y-2">
            {bookings.length === 0 ? (
              <p className="text-[#1a1a1a]/40 text-sm text-center py-6 font-light">No bookings yet.</p>
            ) : bookings.slice(0, 5).map(b => (
              <div key={b.id} className="rounded-xl p-3 flex items-center justify-between" style={frostedCard}>
                <div>
                  <p className="font-semibold text-[#1a1a1a] text-sm">{b.venue_name}</p>
                  <p className="text-[#1a1a1a]/40 text-xs font-light">{b.player_name} · {b.date} · {b.start_time}</p>
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