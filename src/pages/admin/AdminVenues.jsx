import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";
import SportBadge from "@/components/SportBadge";
import { noiseOverlay, frostedCard } from "@/lib/portalDesign";

export default function AdminVenues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [acting, setActing] = useState(null);

  useEffect(() => {
    base44.entities.Venue.list().then(vs => { setVenues(vs); setLoading(false); });
  }, []);

  const approve = async (venue) => {
    setActing(venue.id);
    const updated = await base44.entities.Venue.update(venue.id, { status: "approved" });
    setVenues(vs => vs.map(v => v.id === venue.id ? updated : v));
    setActing(null);
  };

  const reject = async (venue) => {
    setActing(venue.id);
    const updated = await base44.entities.Venue.update(venue.id, { status: "rejected", rejection_reason: rejectReason });
    setVenues(vs => vs.map(v => v.id === venue.id ? updated : v));
    setRejectId(null);
    setRejectReason("");
    setActing(null);
  };

  const suspend = async (venue) => {
    setActing(venue.id);
    const updated = await base44.entities.Venue.update(venue.id, { status: "suspended" });
    setVenues(vs => vs.map(v => v.id === venue.id ? updated : v));
    setActing(null);
  };

  const reactivate = async (venue) => {
    setActing(venue.id);
    const updated = await base44.entities.Venue.update(venue.id, { status: "approved" });
    setVenues(vs => vs.map(v => v.id === venue.id ? updated : v));
    setActing(null);
  };

  const tabs = [
    { key: "pending", label: `Pending (${venues.filter(v => v.status === "pending").length})` },
    { key: "approved", label: `Approved (${venues.filter(v => v.status === "approved").length})` },
    { key: "rejected", label: `Rejected (${venues.filter(v => v.status === "rejected").length})` },
    { key: "suspended", label: `Suspended (${venues.filter(v => v.status === "suspended").length})` },
  ];

  const displayed = venues.filter(v => v.status === tab);

  return (
    <div className="min-h-screen" style={{ background: "#F7F5F0" }}>
      {/* Header */}
      <div className="relative px-6 md:px-10 pt-8 pb-6 overflow-hidden">
        <div className="absolute inset-0" style={noiseOverlay} />
        <h1 className="relative z-10 font-heading text-4xl md:text-5xl font-bold tracking-[-0.03em] text-[#1a1a1a]">VENUES</h1>
        <p className="relative z-10 text-[#1a1a1a]/40 text-sm mt-1 font-light">Review and manage venue applications</p>
      </div>

      {/* Tabs */}
      <div className="px-6 md:px-10 py-3 overflow-x-auto no-scrollbar border-b border-[#1a1a1a]/8 sticky top-0 z-10" style={{ background: "#F7F5F0" }}>
        <div className="flex gap-2 min-w-max">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${tab === t.key ? "bg-brand-orange text-white" : "text-[#1a1a1a]/50 border border-[#1a1a1a]/12"}`}>{t.label}</button>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-10 py-4">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-orange" size={28} /></div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-heading text-xl text-[#1a1a1a]">No {tab} venues</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map(venue => (
              <div key={venue.id} className="rounded-2xl p-5" style={frostedCard}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-[#1a1a1a]">{venue.name}</h3>
                    <p className="text-xs text-[#1a1a1a]/40 mt-0.5 font-light">{venue.address || venue.city}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    venue.status === "approved" ? "bg-brand-green/10 text-brand-green" :
                    venue.status === "pending" ? "bg-amber-100 text-amber-700" :
                    venue.status === "suspended" ? "bg-muted text-muted-foreground" :
                    "bg-destructive/10 text-destructive"
                  }`}>
                    {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-1.5 mb-3">
                  {venue.owner_name && <p className="text-xs text-[#1a1a1a]/40 font-light">Owner: <span className="font-semibold text-[#1a1a1a]">{venue.owner_name}</span></p>}
                  {venue.owner_email && <p className="text-xs text-[#1a1a1a]/40 font-light">Email: <span className="text-[#1a1a1a]">{venue.owner_email}</span></p>}
                  {venue.phone && <p className="text-xs text-[#1a1a1a]/40 font-light">Phone: <span className="text-[#1a1a1a]">{venue.phone}</span></p>}
                  {venue.price_per_hour && <p className="text-xs text-[#1a1a1a]/40 font-light">Price: <span className="font-semibold text-brand-orange">฿{venue.price_per_hour}/hr</span></p>}
                  {venue.court_count && <p className="text-xs text-[#1a1a1a]/40 font-light">Courts: <span className="font-semibold text-[#1a1a1a]">{venue.court_count}</span></p>}
                  {venue.description && <p className="text-xs text-[#1a1a1a]/40 font-light leading-relaxed mt-1">{venue.description}</p>}
                </div>

                <div className="flex gap-2 mb-3 flex-wrap">
                  {(venue.sports || []).map(s => <SportBadge key={s} sport={s} />)}
                </div>

                {venue.rejection_reason && (
                  <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-2 mb-3">
                    <p className="text-xs text-destructive">Rejection reason: {venue.rejection_reason}</p>
                  </div>
                )}

                {/* Actions — no icons */}
                <div className="flex gap-2 flex-wrap">
                  {venue.status === "pending" && (
                    <>
                      <button onClick={() => approve(venue)} disabled={acting === venue.id} className="flex-1 bg-brand-green text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">Approve</button>
                      <button onClick={() => setRejectId(venue.id)} disabled={acting === venue.id} className="flex-1 bg-destructive text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">Reject</button>
                    </>
                  )}
                  {venue.status === "approved" && (
                    <button onClick={() => suspend(venue)} disabled={acting === venue.id} className="bg-muted text-muted-foreground py-2.5 px-4 rounded-xl text-sm font-semibold disabled:opacity-60 hover:bg-muted/80">Suspend</button>
                  )}
                  {(venue.status === "suspended" || venue.status === "rejected") && (
                    <button onClick={() => reactivate(venue)} disabled={acting === venue.id} className="bg-brand-green text-white py-2.5 px-4 rounded-xl text-sm font-semibold disabled:opacity-60">Reactivate</button>
                  )}
                </div>

                {rejectId === venue.id && (
                  <div className="mt-3 animate-fade-in">
                    <textarea
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      placeholder="Reason for rejection (optional)..."
                      rows={2}
                      className="w-full border border-[#1a1a1a]/12 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-destructive text-[#1a1a1a] resize-none mb-2"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setRejectId(null)} className="flex-1 py-2 border border-[#1a1a1a]/12 rounded-xl text-sm text-[#1a1a1a] font-semibold">Cancel</button>
                      <button onClick={() => reject(venue)} disabled={acting === venue.id} className="flex-1 py-2 bg-destructive text-white rounded-xl text-sm font-semibold disabled:opacity-60">
                        {acting === venue.id ? "Rejecting..." : "Confirm reject"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}