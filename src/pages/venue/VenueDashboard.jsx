import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { CalendarCheck, Building2, TrendingUp, Clock, Plus, AlertCircle } from "lucide-react";
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
      // Filter bookings for this owner's venues
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

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-brand-green px-6 pt-8 pb-6">
        <h1 className="font-heading text-4xl font-bold text-white">DASHBOARD</h1>
        <p className="text-white/60 text-sm mt-0.5">Welcome back, {user?.full_name || "Venue Owner"}</p>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Pending approval notice */}
        {pendingVenues.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 text-sm">Venue pending approval</p>
              <p className="text-amber-700 text-xs mt-0.5">{pendingVenues.map(v => v.name).join(", ")} — awaiting admin review.</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <CalendarCheck size={16} className="text-brand-orange" />
              <span className="text-xs text-muted-foreground font-semibold">TODAY</span>
            </div>
            <p className="font-stat text-4xl text-brand-brown">{todayBookings.length}</p>
            <p className="text-xs text-muted-foreground">bookings today</p>
          </div>
          <div className="bg-white rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-brand-green" />
              <span className="text-xs text-muted-foreground font-semibold">UPCOMING</span>
            </div>
            <p className="font-stat text-4xl text-brand-brown">{upcoming.length}</p>
            <p className="text-xs text-muted-foreground">total upcoming</p>
          </div>
          <div className="bg-white rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 size={16} className="text-brand-orange" />
              <span className="text-xs text-muted-foreground font-semibold">VENUES</span>
            </div>
            <p className="font-stat text-4xl text-brand-brown">{approvedVenues.length}</p>
            <p className="text-xs text-muted-foreground">live venues</p>
          </div>
          <div className="bg-white rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-brand-green" />
              <span className="text-xs text-muted-foreground font-semibold">REVENUE</span>
            </div>
            <p className="font-stat text-4xl text-brand-brown">฿{bookings.filter(b => b.payment_status === "paid").reduce((s, b) => s + (b.price || 0), 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">total collected</p>
          </div>
        </div>

        {/* My Venues */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-xl font-bold text-brand-brown">MY VENUES</h2>
            <Link to="/venue/new" className="flex items-center gap-1 bg-brand-orange text-white px-3 py-1.5 rounded-full text-xs font-semibold">
              <Plus size={12} /> Add Venue
            </Link>
          </div>
          {venues.length === 0 ? (
            <div className="bg-white rounded-2xl border border-border p-8 text-center">
              <Building2 size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="font-heading text-lg text-brand-brown mb-1">NO VENUES YET</p>
              <p className="text-muted-foreground text-sm mb-4">List your first court to start accepting bookings.</p>
              <Link to="/venue/new" className="bg-brand-orange text-white px-5 py-2 rounded-full text-sm font-semibold">Add your venue</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {venues.map(v => (
                <Link key={v.id} to={`/venue/courts?venueId=${v.id}`} className="block bg-white rounded-2xl border border-border p-4 hover:border-brand-orange/40 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading text-lg font-bold text-brand-brown">{v.name}</h3>
                      <p className="text-muted-foreground text-xs">{v.address}</p>
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
              <h2 className="font-heading text-xl font-bold text-brand-brown">UPCOMING BOOKINGS</h2>
              <Link to="/venue/bookings" className="text-brand-orange text-xs font-semibold">View all</Link>
            </div>
            <div className="space-y-2">
              {upcoming.slice(0, 3).map(b => (
                <div key={b.id} className="bg-white rounded-xl border border-border p-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-brand-brown text-sm">{b.player_name}</p>
                    <p className="text-muted-foreground text-xs">{b.court_name} · {b.date} · {b.start_time}–{b.end_time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-stat text-lg text-brand-orange">฿{b.price}</p>
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