import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Save } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">No venues found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="bg-brand-green px-6 pt-8 pb-5">
        <h1 className="font-heading text-4xl font-bold text-white">SETTINGS</h1>
        {venues.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
            {venues.map(v => (
              <button key={v.id} onClick={() => { setSelected(v); setForm(v); }} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${selected?.id === v.id ? "bg-brand-orange text-white border-brand-orange" : "bg-white/10 text-white border-white/20"}`}>{v.name}</button>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 py-5 space-y-5">
        <div className="bg-white rounded-2xl border border-border p-4 space-y-3">
          <h2 className="font-heading text-lg font-bold text-brand-brown">VENUE DETAILS</h2>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Venue Name</label>
            <input value={form.name || ""} onChange={e => set("name", e.target.value)} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-brand-orange text-brand-brown" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Description</label>
            <textarea value={form.description || ""} onChange={e => set("description", e.target.value)} rows={3} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-brand-orange text-brand-brown resize-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Address</label>
            <input value={form.address || ""} onChange={e => set("address", e.target.value)} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-brand-orange text-brand-brown" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">City</label>
            <input value={form.city || ""} onChange={e => set("city", e.target.value)} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-brand-orange text-brand-brown" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Phone</label>
            <input value={form.phone || ""} onChange={e => set("phone", e.target.value)} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-brand-orange text-brand-brown" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-4 space-y-3">
          <h2 className="font-heading text-lg font-bold text-brand-brown">SPORTS & PRICING</h2>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">Sports</label>
            <div className="flex gap-2 flex-wrap">
              {SPORTS.map(s => (
                <button key={s} onClick={() => toggleArr("sports", s)} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${(form.sports || []).includes(s) ? "bg-brand-orange text-white border-brand-orange" : "bg-white text-brand-brown border-border"}`}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Default Price Per Hour (฿)</label>
            <input type="number" value={form.price_per_hour || ""} onChange={e => set("price_per_hour", e.target.value)} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-brand-orange text-brand-brown" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">Payment Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {[{ val: "in_app", label: "Online" }, { val: "pay_at_venue", label: "At venue" }, { val: "both", label: "Flexible" }].map(p => (
                <button key={p.val} onClick={() => set("payment_mode", p.val)} className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${form.payment_mode === p.val ? "bg-brand-orange text-white border-brand-orange" : "bg-white text-brand-brown border-border"}`}>{p.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-4 space-y-3">
          <h2 className="font-heading text-lg font-bold text-brand-brown">AMENITIES</h2>
          <div className="grid grid-cols-2 gap-2">
            {AMENITIES.map(a => (
              <button key={a} onClick={() => toggleArr("amenities", a)} className={`py-3 px-3 rounded-xl text-xs font-semibold border transition-all text-left ${(form.amenities || []).includes(a) ? "bg-brand-green/10 border-brand-green text-brand-green" : "bg-white text-brand-brown border-border"}`}>
                {(form.amenities || []).includes(a) ? "✓ " : ""}{a}
              </button>
            ))}
          </div>
        </div>

        <button onClick={save} disabled={saving} className={`w-full py-4 rounded-2xl font-bold text-lg font-heading tracking-wide flex items-center justify-center gap-2 transition-all ${saved ? "bg-brand-green text-white" : "bg-brand-orange text-white hover:bg-brand-orange/90"}`}>
          <Save size={18} />
          {saving ? "Saving..." : saved ? "Saved!" : "SAVE CHANGES"}
        </button>
      </div>
    </div>
  );
}