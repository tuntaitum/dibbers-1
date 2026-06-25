import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { frostedCard } from "@/lib/portalDesign";
import PageBanner from "@/components/PageBanner";

const SPORTS = ["Padel", "Squash", "Pickleball"];
const AMENITIES = ["Changing rooms", "Parking", "Showers", "Equipment rental", "Café / snack bar", "Air conditioning", "Lockers", "Coaching available"];

export default function VenueSettings() {
  const [venues, setVenues] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    base44.auth.me().then(async u => {
      const vs = await base44.entities.Venue.filter({ owner_id: u.id });
      setVenues(vs);
      if (vs[0]) { setSelected(vs[0]); setForm(vs[0]); }
    });
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleArr = (k, val) => setForm(f => ({ ...f, [k]: (f[k] || []).includes(val) ? (f[k] || []).filter(x => x !== val) : [...(f[k] || []), val] }));

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    const updated = await base44.entities.Venue.update(selected.id, {
      name: form.name,
      description: form.description,
      address: form.address,
      city: form.city,
      phone: form.phone,
      sports: form.sports,
      price_per_hour: parseFloat(form.price_per_hour) || 0,
      payment_mode: form.payment_mode,
      amenities: form.amenities,
    });
    setVenues(vs => vs.map(v => v.id === selected.id ? updated : v));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  };

  if (!selected) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAFAFA" }}>
      <p className="text-[#1a1a1a]/40 font-light">No venues found.</p>
    </div>
  );

  return (
    <div className="min-h-screen pb-10" style={{ background: "#FAFAFA" }}>
      <PageBanner title="SETTINGS" variant="brown">
        {venues.length > 1 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {venues.map(v => (
              <button key={v.id} onClick={() => { setSelected(v); setForm(v); }} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${selected?.id === v.id ? "bg-brand-orange text-white border-brand-orange" : "text-[#1a1a1a]/50 border-[#1a1a1a]/12"}`}>{v.name}</button>
            ))}
          </div>
        )}
      </PageBanner>

      <div className="px-6 md:px-10 py-5 space-y-5">
        {/* Venue Details */}
        <div className="rounded-2xl p-5 space-y-3" style={frostedCard}>
          <h2 className="font-heading text-lg font-bold text-[#1a1a1a]">VENUE DETAILS</h2>
          <div>
            <label className="text-xs font-semibold text-[#1a1a1a]/40 mb-1.5 block tracking-wide">Venue Name</label>
            <input value={form.name || ""} onChange={e => set("name", e.target.value)} className="w-full border border-[#1a1a1a]/12 rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-brand-orange text-[#1a1a1a]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#1a1a1a]/40 mb-1.5 block tracking-wide">Description</label>
            <textarea value={form.description || ""} onChange={e => set("description", e.target.value)} rows={3} className="w-full border border-[#1a1a1a]/12 rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-brand-orange text-[#1a1a1a] resize-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#1a1a1a]/40 mb-1.5 block tracking-wide">Address</label>
            <input value={form.address || ""} onChange={e => set("address", e.target.value)} className="w-full border border-[#1a1a1a]/12 rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-brand-orange text-[#1a1a1a]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#1a1a1a]/40 mb-1.5 block tracking-wide">City</label>
            <input value={form.city || ""} onChange={e => set("city", e.target.value)} className="w-full border border-[#1a1a1a]/12 rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-brand-orange text-[#1a1a1a]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#1a1a1a]/40 mb-1.5 block tracking-wide">Phone</label>
            <input value={form.phone || ""} onChange={e => set("phone", e.target.value)} className="w-full border border-[#1a1a1a]/12 rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-brand-orange text-[#1a1a1a]" />
          </div>
        </div>

        {/* Sports & Pricing */}
        <div className="rounded-2xl p-5 space-y-3" style={frostedCard}>
          <h2 className="font-heading text-lg font-bold text-[#1a1a1a]">SPORTS & PRICING</h2>
          <div>
            <label className="text-xs font-semibold text-[#1a1a1a]/40 mb-2 block tracking-wide">Sports</label>
            <div className="flex gap-2 flex-wrap">
              {SPORTS.map(s => (
                <button key={s} onClick={() => toggleArr("sports", s)} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${(form.sports || []).includes(s) ? "bg-brand-orange text-white border-brand-orange" : "text-[#1a1a1a]/50 border-[#1a1a1a]/12"}`}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#1a1a1a]/40 mb-1.5 block tracking-wide">Default Price Per Hour (฿)</label>
            <input type="number" value={form.price_per_hour || ""} onChange={e => set("price_per_hour", e.target.value)} className="w-full border border-[#1a1a1a]/12 rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-brand-orange text-[#1a1a1a]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#1a1a1a]/40 mb-2 block tracking-wide">Payment Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {[{ val: "in_app", label: "Online" }, { val: "pay_at_venue", label: "At venue" }, { val: "both", label: "Flexible" }].map(p => (
                <button key={p.val} onClick={() => set("payment_mode", p.val)} className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${form.payment_mode === p.val ? "bg-brand-orange text-white border-brand-orange" : "text-[#1a1a1a]/50 border-[#1a1a1a]/12"}`}>{p.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="rounded-2xl p-5 space-y-3" style={frostedCard}>
          <h2 className="font-heading text-lg font-bold text-[#1a1a1a]">AMENITIES</h2>
          <div className="grid grid-cols-2 gap-2">
            {AMENITIES.map(a => (
              <button key={a} onClick={() => toggleArr("amenities", a)} className={`py-3 px-3 rounded-xl text-xs font-semibold border transition-all text-left ${(form.amenities || []).includes(a) ? "bg-brand-green/10 border-brand-green text-brand-green" : "text-[#1a1a1a]/50 border-[#1a1a1a]/12"}`}>
                {(form.amenities || []).includes(a) ? "✓ " : ""}{a}
              </button>
            ))}
          </div>
        </div>

        <button onClick={save} disabled={saving} className={`w-full py-4 rounded-2xl font-bold text-lg font-heading tracking-wide transition-all ${saved ? "bg-brand-green text-white" : "bg-brand-orange text-white hover:bg-brand-orange/90"}`}>
          {saving ? "Saving..." : saved ? "Saved!" : "SAVE CHANGES"}
        </button>
      </div>
    </div>
  );
}