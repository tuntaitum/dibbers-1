import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, XCircle, AlertCircle, Loader2, Building2, MapPin, Phone } from "lucide-react";
import SportBadge from "@/components/SportBadge";

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
    <div className="min-h-screen bg-background">
      <div className="bg-brand-brown px-6 pt-8 pb-5">
        <h1 className="font-heading text-4xl font-bold text-white">VENUES</h1>
        <p className="text-white/60 text-sm mt-0.5">Review and manage venue applications</p>
      </div>

      <div className="px-6 py-3 overflow-x-auto no-scrollbar bg-brand-cream border-b border-border sticky top-0 z-10">
        <div className="flex gap-2 min-w-max">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${tab === t.key ? "bg-brand-orange text-white" : "bg-white text-brand-brown border border-border"}`}>{t.label}</button>
          ))}
        </div>
      </div>

      <div className="px-6 py-4">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-orange" size={28} /></div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20">
            <Building2 size={36} className="mx-auto text-muted-foreground mb-2" />
            <p className="font-heading text-xl text-brand-brown">No {tab} venues</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map(venue => (
              <div key={venue.id} className="bg-white rounded-2xl border border-border p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-brand-brown">{venue.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <MapPin size={11} />
                      <span>{venue.address || venue.city}</span>
                    </div>
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
                  {venue.owner_name && <p className="text-xs text-muted-foreground">Owner: <span className="font-semibold text-brand-brown">{venue.owner_name}</span></p>}
                  {venue.owner_email && <p className="text-xs text-muted-foreground">Email: <span className="text-brand-brown">{venue.owner_email}</span></p>}
                  {venue.phone && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone size={11} />
                      <span>{venue.phone}</span>
                    </div>
                  )}
                  {venue.price_per_hour && <p className="text-xs text-muted-foreground">Price: <span className="font-semibold text-brand-orange">฿{venue.price_per_hour}/hr</span></p>}
                  {venue.court_count && <p className="text-xs text-muted-foreground">Courts: <span className="font-semibold text-brand-brown">{venue.court_count}</span></p>}
                  {venue.description && <p className="text-xs text-muted-foreground leading-relaxed mt-1">{venue.description}</p>}
                </div>

                <div className="flex gap-2 mb-3 flex-wrap">
                  {(venue.sports || []).map(s => <SportBadge key={s} sport={s} />)}
                </div>

                {venue.rejection_reason && (
                  <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-2 mb-3">
                    <p className="text-xs text-destructive">Rejection reason: {venue.rejection_reason}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  {venue.status === "pending" && (
                    <>
                      <button onClick={() => approve(venue)} disabled={acting === venue.id} className="flex-1 flex items-center justify-center gap-1.5 bg-brand-green text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">
                        <CheckCircle2 size={15} /> Approve
                      </button>
                      <button onClick={() => setRejectId(venue.id)} disabled={acting === venue.id} className="flex-1 flex items-center justify-center gap-1.5 bg-destructive text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">
                        <XCircle size={15} /> Reject
                      </button>
                    </>
                  )}
                  {venue.status === "approved" && (
                    <button onClick={() => suspend(venue)} disabled={acting === venue.id} className="flex items-center justify-center gap-1.5 bg-muted text-muted-foreground py-2.5 px-4 rounded-xl text-sm font-semibold disabled:opacity-60 hover:bg-muted/80">
                      <AlertCircle size={15} /> Suspend
                    </button>
                  )}
                  {(venue.status === "suspended" || venue.status === "rejected") && (
                    <button onClick={() => reactivate(venue)} disabled={acting === venue.id} className="flex items-center justify-center gap-1.5 bg-brand-green text-white py-2.5 px-4 rounded-xl text-sm font-semibold disabled:opacity-60">
                      <CheckCircle2 size={15} /> Reactivate
                    </button>
                  )}
                </div>

                {rejectId === venue.id && (
                  <div className="mt-3 animate-fade-in">
                    <textarea
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      placeholder="Reason for rejection (optional)..."
                      rows={2}
                      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-destructive text-brand-brown resize-none mb-2"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setRejectId(null)} className="flex-1 py-2 border border-border rounded-xl text-sm text-brand-brown font-semibold">Cancel</button>
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