import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, TrendingUp, Clock, RotateCcw, Receipt } from "lucide-react";
import { frostedCard } from "@/lib/portalDesign";
import PageBanner from "@/components/PageBanner";

const fmt = (n) => `฿${(n || 0).toLocaleString()}`;

const sportBarColor = {
  Padel: "bg-brand-orange",
  Squash: "bg-brand-green",
  Pickleball: "bg-brand-sky",
};

const payStatusCls = {
  paid: "bg-brand-green/10 text-brand-green",
  pending: "bg-amber-100 text-amber-700",
  refunded: "bg-destructive/10 text-destructive",
};

export default function AdminFinance() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Booking.list().then((bs) => {
      setBookings(bs);
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center" style={{ background: "#FAFAFA" }}>
        <Loader2 className="animate-spin text-brand-orange" size={28} />
      </div>
    );

  const paid = bookings.filter((b) => b.payment_status === "paid");
  const pending = bookings.filter((b) => b.payment_status === "pending");
  const refunded = bookings.filter((b) => b.payment_status === "refunded");

  const totalRevenue = paid.reduce((s, b) => s + (b.price || 0), 0);
  const pendingAmount = pending.reduce((s, b) => s + (b.price || 0), 0);
  const refundedAmount = refunded.reduce((s, b) => s + (b.price || 0), 0);

  const kpis = [
    { label: "Total Revenue", value: fmt(totalRevenue), icon: TrendingUp, color: "text-brand-green" },
    { label: "Pending", value: fmt(pendingAmount), icon: Clock, color: "text-amber-600" },
    { label: "Refunded", value: fmt(refundedAmount), icon: RotateCcw, color: "text-destructive" },
    { label: "Transactions", value: bookings.length, icon: Receipt, color: "text-brand-orange" },
  ];

  // Revenue by sport
  const sports = ["Padel", "Squash", "Pickleball"];
  const bySport = sports
    .map((s) => {
      const sb = paid.filter((b) => b.sport === s);
      return { sport: s, revenue: sb.reduce((sum, b) => sum + (b.price || 0), 0), count: sb.length };
    })
    .filter((s) => s.count > 0);
  const maxSport = Math.max(...bySport.map((s) => s.revenue), 1);

  // Revenue by venue
  const venueMap = {};
  paid.forEach((b) => {
    const name = b.venue_name || "Unknown";
    if (!venueMap[name]) venueMap[name] = { revenue: 0, count: 0 };
    venueMap[name].revenue += b.price || 0;
    venueMap[name].count += 1;
  });
  const byVenue = Object.entries(venueMap).sort((a, b) => b[1].revenue - a[1].revenue);
  const maxVenue = Math.max(...byVenue.map(([, v]) => v.revenue), 1);

  // Payment mode split
  const inApp = paid.filter((b) => b.payment_mode === "in_app").reduce((s, b) => s + (b.price || 0), 0);
  const atVenue = paid.filter((b) => b.payment_mode === "pay_at_venue").reduce((s, b) => s + (b.price || 0), 0);

  // Recent transactions
  const recent = [...bookings]
    .sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0))
    .slice(0, 12);

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>
      <PageBanner title="FINANCE" subtitle="Track revenue and payments across all venues" variant="green" />

      <div className="px-6 md:px-10 py-5 space-y-5">
        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-2xl p-4" style={frostedCard}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-[#1a1a1a]/40 tracking-wider">{kpi.label.toUpperCase()}</span>
                <kpi.icon size={16} className={kpi.color} />
              </div>
              <p className="font-stat text-2xl text-[#1a1a1a]">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Breakdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Revenue by sport */}
          <div className="rounded-2xl p-5" style={frostedCard}>
            <h3 className="font-heading text-sm font-bold text-[#1a1a1a] mb-4">REVENUE BY SPORT</h3>
            {bySport.length === 0 ? (
              <p className="text-sm text-[#1a1a1a]/40 font-light">No paid bookings yet.</p>
            ) : (
              <div className="space-y-3">
                {bySport.map((s) => (
                  <div key={s.sport}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#1a1a1a]">{s.sport}</span>
                      <span className="font-stat text-sm text-[#1a1a1a]">{fmt(s.revenue)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#1a1a1a]/8 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${sportBarColor[s.sport] || "bg-brand-orange"}`}
                        style={{ width: `${(s.revenue / maxSport) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-[#1a1a1a]/35 font-light mt-0.5">{s.count} booking{s.count !== 1 ? "s" : ""}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Revenue by venue */}
          <div className="rounded-2xl p-5" style={frostedCard}>
            <h3 className="font-heading text-sm font-bold text-[#1a1a1a] mb-4">REVENUE BY VENUE</h3>
            {byVenue.length === 0 ? (
              <p className="text-sm text-[#1a1a1a]/40 font-light">No paid bookings yet.</p>
            ) : (
              <div className="space-y-3">
                {byVenue.slice(0, 6).map(([name, v]) => (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#1a1a1a] truncate min-w-0 mr-2">{name}</span>
                      <span className="font-stat text-sm text-[#1a1a1a] flex-shrink-0">{fmt(v.revenue)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#1a1a1a]/8 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-orange"
                        style={{ width: `${(v.revenue / maxVenue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Payment mode split */}
        <div className="rounded-2xl p-5" style={frostedCard}>
          <h3 className="font-heading text-sm font-bold text-[#1a1a1a] mb-4">PAYMENT MODE BREAKDOWN</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold text-[#1a1a1a]/40 tracking-wider mb-1">ONLINE PAYMENT</p>
              <p className="font-stat text-xl text-brand-orange">{fmt(inApp)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#1a1a1a]/40 tracking-wider mb-1">PAY AT VENUE</p>
              <p className="font-stat text-xl text-brand-green">{fmt(atVenue)}</p>
            </div>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="rounded-2xl p-5" style={frostedCard}>
          <h3 className="font-heading text-sm font-bold text-[#1a1a1a] mb-4">RECENT TRANSACTIONS</h3>
          {recent.length === 0 ? (
            <p className="text-sm text-[#1a1a1a]/40 font-light">No bookings yet.</p>
          ) : (
            <div className="space-y-1.5">
              {recent.map((b) => (
                <div key={b.id} className="flex items-center gap-3 py-2 border-b border-[#1a1a1a]/6 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#1a1a1a] truncate">{b.venue_name || "Unknown venue"}</p>
                    <p className="text-[10px] text-[#1a1a1a]/35 font-light">
                      {b.sport} · {b.court_name || "—"} · {b.date} · {b.start_time}
                    </p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${payStatusCls[b.payment_status] || payStatusCls.pending}`}>
                    {b.payment_status}
                  </span>
                  <span className="font-stat text-sm text-[#1a1a1a] flex-shrink-0 min-w-[4rem] text-right">{fmt(b.price)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}