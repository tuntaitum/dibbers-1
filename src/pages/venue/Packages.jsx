import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useSearchParams } from "react-router-dom";
import { Trash2, Plus, Clock, Users, Package, ChevronDown, ChevronUp, X } from "lucide-react";
import { frostedCard } from "@/lib/portalDesign";
import PageBanner from "@/components/PageBanner";
import SportBadge from "@/components/SportBadge";

const SPORTS = ["Padel", "Squash", "Pickleball", "Any"];
const EXPIRY_OPTIONS = [
  { label: "Never", days: 0 },
  { label: "1 month", days: 30 },
  { label: "3 months", days: 90 },
  { label: "6 months", days: 180 },
  { label: "1 year", days: 365 },
];

export default function Packages() {
  const [searchParams] = useSearchParams();
  const venueIdParam = searchParams.get("venueId");
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [packages, setPackages] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [usages, setUsages] = useState([]);
  const [tab, setTab] = useState("packages");
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newPkg, setNewPkg] = useState({ name: "", description: "", total_hours: "10", price: "1950", expiry_days: 30, sport: "Any" });
  const [expandedPurchase, setExpandedPurchase] = useState(null);
  const [showRecordUsage, setShowRecordUsage] = useState(null);

  useEffect(() => {
    base44.auth.me().then(async u => {
      const vs = await base44.entities.Venue.filter({ owner_id: u.id });
      setVenues(vs);
      const firstVenue = venueIdParam ? vs.find(v => v.id === venueIdParam) || vs[0] : vs[0];
      if (firstVenue) {
        setSelectedVenue(firstVenue);
        await loadData(firstVenue.id);
      }
      setLoading(false);
    });
  }, []);

  const loadData = async (vid) => {
    const [pkgs, purs, usg] = await Promise.all([
      base44.entities.VenuePackage.filter({ venue_id: vid }, "-created_date"),
      base44.entities.PackagePurchase.filter({ venue_id: vid }, "-created_date"),
      base44.entities.PackageUsage.filter({ venue_id: vid }, "-created_date"),
    ]);
    setPackages(pkgs);
    setPurchases(purs);
    setUsages(usg);
  };

  const switchVenue = async (v) => {
    setSelectedVenue(v);
    setLoading(true);
    await loadData(v.id);
    setLoading(false);
  };

  const createPackage = async () => {
    if (!newPkg.name || !newPkg.total_hours || !newPkg.price || !selectedVenue) return;
    const pkg = await base44.entities.VenuePackage.create({
      venue_id: selectedVenue.id,
      venue_name: selectedVenue.name,
      name: newPkg.name,
      description: newPkg.description,
      total_hours: parseFloat(newPkg.total_hours),
      price: parseFloat(newPkg.price),
      expiry_days: parseInt(newPkg.expiry_days) || 0,
      sport: newPkg.sport,
      status: "active",
    });
    setPackages(ps => [pkg, ...ps]);
    setNewPkg({ name: "", description: "", total_hours: "10", price: "1950", expiry_days: 30, sport: "Any" });
    setShowCreate(false);
  };

  const togglePackageStatus = async (pkg) => {
    const newStatus = pkg.status === "active" ? "inactive" : "active";
    await base44.entities.VenuePackage.update(pkg.id, { status: newStatus });
    setPackages(ps => ps.map(p => p.id === pkg.id ? { ...p, status: newStatus } : p));
  };

  const deletePackage = async (id) => {
    if (!confirm("Delete this package? Existing purchases will remain.")) return;
    await base44.entities.VenuePackage.delete(id);
    setPackages(ps => ps.filter(p => p.id !== id));
  };

  const recordUsage = async (purchase, hours, courtName, note) => {
    const usage = await base44.entities.PackageUsage.create({
      purchase_id: purchase.id,
      package_id: purchase.package_id,
      package_name: purchase.package_name,
      venue_id: selectedVenue.id,
      user_id: purchase.user_id,
      user_name: purchase.user_name,
      date: new Date().toISOString().split("T")[0],
      hours_used: parseFloat(hours),
      court_name: courtName || "",
      note: note || "",
    });
    const newUsed = (purchase.used_hours || 0) + parseFloat(hours);
    const newRemaining = purchase.total_hours - newUsed;
    const newStatus = newRemaining <= 0 ? "exhausted" : "active";
    await base44.entities.PackagePurchase.update(purchase.id, {
      used_hours: newUsed,
      remaining_hours: newRemaining,
      status: newStatus,
    });
    setUsages(us => [usage, ...us]);
    setPurchases(ps => ps.map(p => p.id === purchase.id ? { ...p, used_hours: newUsed, remaining_hours: newRemaining, status: newStatus } : p));
    setShowRecordUsage(null);
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAFAFA" }}>
      <div className="w-8 h-8 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
    </div>
  );

  const tabs = [
    { key: "packages", label: "Packages", icon: Package, count: packages.length },
    { key: "customers", label: "Customers", icon: Users, count: purchases.length },
    { key: "usage", label: "Usage Log", icon: Clock, count: usages.length },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#FAFAFA" }}>
      <PageBanner title="PACKAGES" subtitle="Create hour packages, track buyers and usage" variant="orange">
        {venues.length > 1 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {venues.map(v => (
              <button key={v.id} onClick={() => switchVenue(v)} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${selectedVenue?.id === v.id ? "bg-brand-orange text-white border-brand-orange" : "text-[#1a1a1a]/50 border-[#1a1a1a]/12"}`}>
                {v.name}
              </button>
            ))}
          </div>
        )}
      </PageBanner>

      <div className="px-6 md:px-10 py-5">
        {!selectedVenue ? (
          <div className="text-center py-20">
            <p className="font-heading text-xl text-[#1a1a1a]">No approved venues yet.</p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-1 mb-5 rounded-2xl p-1" style={frostedCard}>
              {tabs.map(({ key, label, icon: Icon, count }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === key ? "bg-brand-orange text-white" : "text-[#1a1a1a]/50 hover:text-[#1a1a1a]"}`}
                >
                  <Icon size={16} />
                  {label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === key ? "bg-white/20" : "bg-[#1a1a1a]/8"}`}>{count}</span>
                </button>
              ))}
            </div>

            {/* PACKAGES TAB */}
            {tab === "packages" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-xl font-bold text-[#1a1a1a]">{selectedVenue.name} Packages</h2>
                  <button onClick={() => setShowCreate(!showCreate)} className="bg-brand-orange text-white px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                    <Plus size={14} /> New Package
                  </button>
                </div>

                {showCreate && (
                  <div className="rounded-2xl p-4 mb-4 animate-fade-in space-y-3" style={frostedCard}>
                    <h3 className="font-heading text-lg font-bold text-[#1a1a1a]">NEW PACKAGE</h3>
                    <input value={newPkg.name} onChange={e => setNewPkg(p => ({ ...p, name: e.target.value }))} placeholder="Package name (e.g. 10-Hour Padel Pass)" className="w-full border border-[#1a1a1a]/12 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-orange text-[#1a1a1a]" />
                    <textarea value={newPkg.description} onChange={e => setNewPkg(p => ({ ...p, description: e.target.value }))} placeholder="Description (optional)" rows={2} className="w-full border border-[#1a1a1a]/12 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-orange text-[#1a1a1a]" />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[#1a1a1a]/40 font-semibold mb-1 block">Total hours</label>
                        <input type="number" value={newPkg.total_hours} onChange={e => setNewPkg(p => ({ ...p, total_hours: e.target.value }))} placeholder="10" className="w-full border border-[#1a1a1a]/12 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-orange text-[#1a1a1a]" />
                      </div>
                      <div>
                        <label className="text-xs text-[#1a1a1a]/40 font-semibold mb-1 block">Price (฿)</label>
                        <input type="number" value={newPkg.price} onChange={e => setNewPkg(p => ({ ...p, price: e.target.value }))} placeholder="1950" className="w-full border border-[#1a1a1a]/12 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-orange text-[#1a1a1a]" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-[#1a1a1a]/40 font-semibold mb-1 block">Expiry</label>
                      <div className="flex gap-2 flex-wrap">
                        {EXPIRY_OPTIONS.map(opt => (
                          <button key={opt.days} onClick={() => setNewPkg(p => ({ ...p, expiry_days: opt.days }))} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${newPkg.expiry_days === opt.days ? "bg-brand-orange text-white border-brand-orange" : "text-[#1a1a1a]/50 border-[#1a1a1a]/12"}`}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-[#1a1a1a]/40 font-semibold mb-1 block">Sport</label>
                      <div className="flex gap-2">
                        {SPORTS.map(s => (
                          <button key={s} onClick={() => setNewPkg(p => ({ ...p, sport: s }))} className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${newPkg.sport === s ? "bg-brand-orange text-white border-brand-orange" : "text-[#1a1a1a]/50 border-[#1a1a1a]/12"}`}>{s}</button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 border border-[#1a1a1a]/12 rounded-xl text-sm text-[#1a1a1a] font-semibold">Cancel</button>
                      <button onClick={createPackage} className="flex-1 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-semibold">Create Package</button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {packages.map(pkg => {
                    const pkgPurchases = purchases.filter(p => p.package_id === pkg.id);
                    const totalRevenue = pkgPurchases.filter(p => p.payment_status === "paid").reduce((s, p) => s + (p.price_paid || 0), 0);
                    return (
                      <div key={pkg.id} className="rounded-2xl overflow-hidden" style={frostedCard}>
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-heading text-lg font-bold text-[#1a1a1a]">{pkg.name}</h3>
                                {pkg.sport && pkg.sport !== "Any" && <SportBadge sport={pkg.sport} />}
                              </div>
                              {pkg.description && <p className="text-xs text-[#1a1a1a]/40 font-light mt-1">{pkg.description}</p>}
                              <div className="flex items-center gap-4 mt-2 flex-wrap">
                                <span className="font-stat text-2xl text-brand-orange">฿{pkg.price.toLocaleString()}</span>
                                <span className="text-xs text-[#1a1a1a]/50 font-light">{pkg.total_hours} hours</span>
                                <span className="text-xs text-[#1a1a1a]/50 font-light">฿{Math.round(pkg.price / pkg.total_hours)}/hr</span>
                                <span className="text-xs text-[#1a1a1a]/50 font-light">
                                  {pkg.expiry_days ? `${pkg.expiry_days} days expiry` : "Never expires"}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button onClick={() => togglePackageStatus(pkg)} className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${pkg.status === "active" ? "bg-brand-green/10 text-brand-green" : "bg-[#1a1a1a]/8 text-[#1a1a1a]/40"}`}>
                                {pkg.status === "active" ? "Active" : "Inactive"}
                              </button>
                              <button onClick={() => deletePackage(pkg.id)} className="text-[#1a1a1a]/30 hover:text-destructive transition-colors p-1">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          {pkgPurchases.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-[#1a1a1a]/8 flex items-center gap-4 text-xs">
                              <span className="text-[#1a1a1a]/50 font-light">{pkgPurchases.length} sold</span>
                              <span className="text-[#1a1a1a]/50 font-light">฿{totalRevenue.toLocaleString()} revenue</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {packages.length === 0 && (
                    <div className="text-center py-12 rounded-2xl" style={frostedCard}>
                      <p className="font-heading text-lg text-[#1a1a1a] mb-1">NO PACKAGES YET</p>
                      <p className="text-[#1a1a1a]/40 text-sm font-light">Create your first hour package to start selling.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CUSTOMERS TAB */}
            {tab === "customers" && (
              <div>
                <h2 className="font-heading text-xl font-bold text-[#1a1a1a] mb-4">Package Customers</h2>
                <div className="space-y-3">
                  {purchases.map(purchase => {
                    const isExpanded = expandedPurchase === purchase.id;
                    const purchaseUsages = usages.filter(u => u.purchase_id === purchase.id);
                    const pct = purchase.total_hours > 0 ? Math.min(100, (purchase.used_hours / purchase.total_hours) * 100) : 0;
                    const isExpired = purchase.expiry_date && new Date(purchase.expiry_date) < new Date();
                    const statusColor = purchase.status === "exhausted" ? "bg-[#1a1a1a]/8 text-[#1a1a1a]/40" :
                      isExpired ? "bg-destructive/10 text-destructive" :
                      "bg-brand-green/10 text-brand-green";
                    return (
                      <div key={purchase.id} className="rounded-2xl overflow-hidden" style={frostedCard}>
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-heading text-base font-bold text-[#1a1a1a] truncate">{purchase.user_name || "Unknown user"}</h3>
                              <p className="text-xs text-[#1a1a1a]/40 font-light truncate">{purchase.user_email}</p>
                              <p className="text-xs text-[#1a1a1a]/50 font-light mt-1">{purchase.package_name}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`}>
                                {purchase.status === "exhausted" ? "Used up" : isExpired ? "Expired" : "Active"}
                              </span>
                              <button onClick={() => setExpandedPurchase(isExpanded ? null : purchase.id)} className="text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors p-1">
                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3 mt-3">
                            <div>
                              <p className="text-xs text-[#1a1a1a]/35 font-semibold uppercase tracking-wide">Total</p>
                              <p className="font-stat text-lg text-[#1a1a1a]">{purchase.total_hours}h</p>
                            </div>
                            <div>
                              <p className="text-xs text-[#1a1a1a]/35 font-semibold uppercase tracking-wide">Used</p>
                              <p className="font-stat text-lg text-brand-orange">{purchase.used_hours || 0}h</p>
                            </div>
                            <div>
                              <p className="text-xs text-[#1a1a1a]/35 font-semibold uppercase tracking-wide">Remaining</p>
                              <p className="font-stat text-lg text-brand-green">{purchase.remaining_hours}h</p>
                            </div>
                          </div>

                          <div className="mt-2 h-2 rounded-full bg-[#1a1a1a]/8 overflow-hidden">
                            <div className="h-full bg-brand-orange rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>

                          <div className="flex items-center justify-between mt-2 text-xs text-[#1a1a1a]/40 font-light">
                            <span>Bought {fmtDate(purchase.purchase_date || purchase.created_date)}</span>
                            <span>{purchase.expiry_date ? `Expires ${fmtDate(purchase.expiry_date)}` : "No expiry"}</span>
                          </div>

                          {purchase.payment_status !== "paid" && (
                            <span className="inline-block mt-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">Payment: {purchase.payment_status}</span>
                          )}
                        </div>

                        {isExpanded && (
                          <div className="border-t border-[#1a1a1a]/8 p-4 animate-fade-in" style={{ background: "rgba(235,232,220,0.4)" }}>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-heading text-sm font-bold text-[#1a1a1a]">USAGE HISTORY</h4>
                              {purchase.status === "active" && !isExpired && purchase.remaining_hours > 0 && (
                                <button onClick={() => setShowRecordUsage(purchase)} className="text-xs text-brand-orange font-semibold hover:underline flex items-center gap-1">
                                  <Plus size={12} /> Record usage
                                </button>
                              )}
                            </div>
                            {purchaseUsages.length === 0 ? (
                              <p className="text-[#1a1a1a]/40 text-xs font-light">No usage recorded yet.</p>
                            ) : (
                              <div className="space-y-1.5">
                                {purchaseUsages.map(u => (
                                  <div key={u.id} className="flex items-center gap-2 bg-white/60 rounded-xl px-3 py-2">
                                    <span className="text-sm font-semibold text-[#1a1a1a] flex-shrink-0">{u.hours_used}h</span>
                                    <span className="text-xs text-[#1a1a1a]/40 font-light flex-shrink-0">{fmtDate(u.date)}</span>
                                    {u.court_name && <span className="text-xs text-[#1a1a1a]/50 font-light truncate min-w-0">{u.court_name}</span>}
                                    {u.note && <span className="text-xs text-[#1a1a1a]/30 font-light truncate ml-auto">{u.note}</span>}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {purchases.length === 0 && (
                    <div className="text-center py-12 rounded-2xl" style={frostedCard}>
                      <p className="font-heading text-lg text-[#1a1a1a] mb-1">NO PURCHASES YET</p>
                      <p className="text-[#1a1a1a]/40 text-sm font-light">When players buy your packages, they'll appear here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* USAGE LOG TAB */}
            {tab === "usage" && (
              <div>
                <h2 className="font-heading text-xl font-bold text-[#1a1a1a] mb-4">Usage Log</h2>
                <div className="space-y-2">
                  {usages.map(u => (
                    <div key={u.id} className="rounded-xl p-3 flex items-center justify-between gap-3" style={frostedCard}>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#1a1a1a] text-sm truncate">{u.user_name || "Unknown"}</p>
                        <p className="text-xs text-[#1a1a1a]/40 font-light truncate">{u.package_name}{u.court_name ? ` · ${u.court_name}` : ""}</p>
                        {u.note && <p className="text-xs text-[#1a1a1a]/30 font-light truncate mt-0.5">{u.note}</p>}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-stat text-lg text-brand-orange">{u.hours_used}h</p>
                        <p className="text-xs text-[#1a1a1a]/40 font-light">{fmtDate(u.date)}</p>
                      </div>
                    </div>
                  ))}
                  {usages.length === 0 && (
                    <div className="text-center py-12 rounded-2xl" style={frostedCard}>
                      <p className="font-heading text-lg text-[#1a1a1a] mb-1">NO USAGE RECORDED</p>
                      <p className="text-[#1a1a1a]/40 text-sm font-light">Usage entries will appear here once you log them.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Record Usage Modal */}
      {showRecordUsage && (
        <RecordUsageModal
          purchase={showRecordUsage}
          maxHours={showRecordUsage.remaining_hours}
          onClose={() => setShowRecordUsage(null)}
          onSubmit={recordUsage}
        />
      )}
    </div>
  );
}

function RecordUsageModal({ purchase, maxHours, onClose, onSubmit }) {
  const [hours, setHours] = useState("1");
  const [courtName, setCourtName] = useState("");
  const [note, setNote] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl p-5 w-full max-w-sm space-y-3 animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-[#1a1a1a]">Record Usage</h3>
          <button onClick={onClose} className="text-[#1a1a1a]/40 hover:text-[#1a1a1a]"><X size={20} /></button>
        </div>
        <p className="text-xs text-[#1a1a1a]/40 font-light">{purchase.user_name} · {purchase.package_name} · {purchase.remaining_hours}h remaining</p>
        <div>
          <label className="text-xs text-[#1a1a1a]/40 font-semibold mb-1 block">Hours used</label>
          <input type="number" step="0.5" min="0.5" max={maxHours} value={hours} onChange={e => setHours(e.target.value)} className="w-full border border-[#1a1a1a]/12 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-orange text-[#1a1a1a]" />
        </div>
        <div>
          <label className="text-xs text-[#1a1a1a]/40 font-semibold mb-1 block">Court (optional)</label>
          <input value={courtName} onChange={e => setCourtName(e.target.value)} placeholder="e.g. Court 1" className="w-full border border-[#1a1a1a]/12 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-orange text-[#1a1a1a]" />
        </div>
        <div>
          <label className="text-xs text-[#1a1a1a]/40 font-semibold mb-1 block">Note (optional)</label>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Casual session" className="w-full border border-[#1a1a1a]/12 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-orange text-[#1a1a1a]" />
        </div>
        <button
          onClick={() => onSubmit(purchase, hours, courtName, note)}
          disabled={!hours || parseFloat(hours) <= 0 || parseFloat(hours) > maxHours}
          className="w-full py-2.5 bg-brand-orange text-white rounded-xl text-sm font-semibold disabled:opacity-40"
        >
          Log {hours || 0}h Usage
        </button>
      </div>
    </div>
  );
}