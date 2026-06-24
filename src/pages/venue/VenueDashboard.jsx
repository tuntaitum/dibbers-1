import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { frostedCard } from "@/lib/portalDesign";
import PageBanner from "@/components/PageBanner";
import SportBadge from "@/components/SportBadge";

export default function VenueDashboard() {
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const [vs, bks] = await Promise.all([
        base44.entities.Venue.filter({ owner_id: u.id }),
        base44.entities.Booking.filter({}, "-created_date", 20),
      ]);
      setVenues(vs);
      const venueIds = new Set(vs.map(v => v.id));
      setBookings(bks.filter(b => venueIds.has(b.venue_id)));
      setLoading(false);
    });
  }, []);

  const now = new Date().toISOString().split("T")[0];
  const upcoming = bookings.filter(b => b.date >= now && b.booking_status === "confirmed");
  const todayBookings = bookings.filter(b => b.date === now && b.booking_status === "confirmed");
  const pendingVenues = venues.filter(v => v.status === "pending");
  const approvedVenues = venues.filter(v => v.status === "approved");

  const stats = [
    { label: "Today", value: todayBookings.length, sub: "bookings today", color: "text-brand-orange" },
    { label: "Upcoming", value: upcoming.length, sub: "total upcoming", color: "text-brand-green" },
    { label: "Venues", value: approvedVenues.length, sub: "live venues", color: "text-brand-brown" },
    { label: "Revenue", value: `฿${bookings.filter(b => b.payment_status === "paid").reduce((s, b) => s + (b.price || 0), 0).toLocaleString()}`, sub: "total collected", color: "text-brand-green" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#F7F5F0" }}>
      <PageBanner title="DASHBOARD" subtitle={`Welcome back, ${user?.full_name || "Venue Owner"}`} />

      <div className="px-6 md:px-10 py-5 space-y-5">
        {/* Pending approval notice */}
        {pendingVenues.length > 0 && (
          <div className="rounded-2xl p-4" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <p className="font-semibold text-amber-800 text-sm">Venue pending approval</p>
            <p className="text-amber-700 text-xs mt-0.5 font-light">{pendingVenues.map(v => v.name).join(", ")} — awaiting admin review.</p>
          </div>
        )}

        {/* Stats — no icons */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ label, value, sub, color }) => (
            <div key={label} className="rounded-2xl p-5" style={frostedCard}>
              <span className="text-xs text-[#1a1a1a]/35 font-semibold tracking-[0.15em] uppercase">{label}</span>
              <p className={`font-stat text-4xl mt-2 ${color}`}>{value}</p>
              <p className="text-xs text-[#1a1a1a]/35 mt-1 font-light">{sub}</p>
            </div>
          ))}
        </div>

        {/* My Venues */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-xl font-bold text-[#1a1a1a]">MY VENUES</h2>
            <Link to="/venue/new" className="bg-brand-orange text-white px-4 py-1.5 rounded-full text-xs font-semibold">Add Venue</Link>
          </div>
          {venues.length === 0 ? (
            <div className="rounded-2xl p-8 text-center" style={frostedCard}>
              <p className="font-heading text-lg text-[#1a1a1a] mb-1">NO VENUES YET</p>
              <p className="text-[#1a1a1a]/40 text-sm mb-4 font-light">List your first court to start accepting bookings.</p>
              <Link to="/venue/new" className="bg-brand-orange text-white px-5 py-2 rounded-full text-sm font-semibold">Add your venue</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {venues.map(v => (
                <Link key={v.id} to={`/venue/courts?venueId=${v.id}`} className="block rounded-2xl p-4 hover:scale-[1.01] transition-transform" style={frostedCard}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading text-lg font-bold text-[#1a1a1a]">{v.name}</h3>
                      <p className="text-[#1a1a1a]/40 text-xs font-light">{v.address}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      v.status === "approved" ? "bg-brand-green/10 text-brand-green" :
                      v.status === "pending" ? "bg-amber-100 text-amber-700" :
                      "bg-destructive/10 text-destructive"
                    }`}>
                      {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {(v.sports || []).map(s => <SportBadge key={s} sport={s} />)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent bookings */}
        {upcoming.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading text-xl font-bold text-[#1a1a1a]">UPCOMING BOOKINGS</h2>
              <Link to="/venue/bookings" className="text-brand-orange text-xs font-semibold">View all</Link>
            </div>
            <div className="space-y-2">
              {upcoming.slice(0, 3).map(b => (
                <div key={b.id} className="rounded-xl p-3 flex items-center justify-between" style={frostedCard}>
                  <div>
                    <p className="font-semibold text-[#1a1a1a] text-sm">{b.player_name}</p>
                    <p className="text-[#1a1a1a]/40 text-xs font-light">{b.court_name} · {b.date} · {b.start_time}–{b.end_time}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="font-stat text-lg text-brand-orange">฿{b.price}</span>
                    <SportBadge sport={b.sport} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}