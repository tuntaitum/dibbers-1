import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { noiseOverlayDark, gradientBannerDark } from "@/lib/portalDesign";
import TopNav from "@/components/TopNav";

const VENUE_TABS = [
  { path: "/venue/dashboard", label: "Dashboard" },
  { path: "/venue/courts", label: "My Courts" },
  { path: "/venue/bookings", label: "Bookings" },
  { path: "/venue/settings", label: "Settings" },
];

const SPORTS = ["Padel", "Squash", "Pickleball"];
const AMENITIES = ["Changing rooms", "Parking", "Showers", "Equipment rental", "Café / snack bar", "Air conditioning", "Lockers", "Coaching available"];

export default function VenueOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    phone: "",
    sports: [],
    court_count: 1,
    price_per_hour: "",
    payment_mode: "both",
    amenities: [],
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleArr = (k, val) => setForm(f => ({ ...f, [k]: f[k].includes(val) ? f[k].filter(x => x !== val) : [...f[k], val] }));

  const submit = async () => {
    setSubmitting(true);
    const user = await base44.auth.me();
    await base44.entities.Venue.create({
      ...form,
      price_per_hour: parseFloat(form.price_per_hour) || 0,
      court_count: parseInt(form.court_count) || 1,
      owner_id: user.id,
      owner_name: user.full_name || user.email,
      owner_email: user.email,
      status: "pending",
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="min-h-screen" style={{ background: "#F7F5F0" }}>
      <TopNav items={VENUE_TABS} logoLink="/venue/dashboard" activeBg="bg-brand-green" />
      <div className="flex flex-col items-center justify-center p-6 text-center min-h-[calc(100vh-80px)]">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full border border-border animate-fade-in">
        <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={36} className="text-brand-green" />
        </div>
        <h2 className="font-heading text-3xl font-bold text-brand-brown mb-2">APPLICATION SUBMITTED!</h2>
        <p className="text-muted-foreground text-sm mb-6">Your venue is pending admin review. You'll be able to manage courts once approved.</p>
        <button onClick={() => navigate("/venue/dashboard")} className="w-full bg-brand-green text-white py-3 rounded-xl font-semibold">Go to dashboard</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-8" style={{ background: "#F7F5F0" }}>
      <TopNav items={VENUE_TABS} logoLink="/venue/dashboard" activeBg="bg-brand-green" />
      <div className="px-6 pt-8">
        <div className="relative rounded-3xl px-6 md:px-8 pt-6 pb-6 overflow-hidden" style={gradientBannerDark}>
          <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseOverlayDark} />
          <div className="relative z-10">
            <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)} className="text-white/60 hover:text-white mb-3 flex items-center gap-1">
              <ArrowLeft size={16} /> Back
            </button>
            <h1 className="font-heading text-4xl font-bold text-white">LIST YOUR VENUE</h1>
            <div className="flex gap-1 mt-4">
              {[1, 2, 3].map(i => (
                <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= step ? "bg-brand-orange" : "bg-white/20"}`} />
              ))}
            </div>
            <p className="text-white/60 text-xs mt-2">Step {step} of 3</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-heading text-2xl font-bold text-brand-brown">BASIC INFO</h2>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Venue Name *</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Bangkok Padel Club" className="w-full border border-border rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-brand-orange text-brand-brown" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Description</label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} placeholder="Tell players about your venue..." className="w-full border border-border rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-brand-orange text-brand-brown resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Address *</label>
              <input value={form.address} onChange={e => set("address", e.target.value)} placeholder="Street address" className="w-full border border-border rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-brand-orange text-brand-brown" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">City</label>
              <input value={form.city} onChange={e => set("city", e.target.value)} placeholder="Bangkok" className="w-full border border-border rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-brand-orange text-brand-brown" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Phone</label>
              <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+66 2 xxx xxxx" className="w-full border border-border rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-brand-orange text-brand-brown" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-heading text-2xl font-bold text-brand-brown">SPORTS & COURTS</h2>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">Sports Offered *</label>
              <div className="flex gap-2 flex-wrap">
                {SPORTS.map(s => (
                  <button key={s} onClick={() => toggleArr("sports", s)} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${form.sports.includes(s) ? "bg-brand-orange text-white border-brand-orange" : "bg-white text-brand-brown border-border"}`}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Number of Courts</label>
              <input type="number" min="1" max="20" value={form.court_count} onChange={e => set("court_count", e.target.value)} className="w-full border border-border rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-brand-orange text-brand-brown" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Price Per Hour (฿)</label>
              <input type="number" value={form.price_per_hour} onChange={e => set("price_per_hour", e.target.value)} placeholder="500" className="w-full border border-border rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-brand-orange text-brand-brown" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">Payment Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { val: "in_app", label: "Online only" },
                  { val: "pay_at_venue", label: "At venue" },
                  { val: "both", label: "Flexible" },
                ].map(p => (
                  <button key={p.val} onClick={() => set("payment_mode", p.val)} className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${form.payment_mode === p.val ? "bg-brand-orange text-white border-brand-orange" : "bg-white text-brand-brown border-border"}`}>{p.label}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-heading text-2xl font-bold text-brand-brown">AMENITIES</h2>
            <p className="text-muted-foreground text-sm">What does your venue offer players?</p>
            <div className="grid grid-cols-2 gap-2">
              {AMENITIES.map(a => (
                <button key={a} onClick={() => toggleArr("amenities", a)} className={`py-3 px-3 rounded-xl text-xs font-semibold border transition-all text-left ${form.amenities.includes(a) ? "bg-brand-green/10 border-brand-green text-brand-green" : "bg-white text-brand-brown border-border"}`}>
                  {form.amenities.includes(a) ? "✓ " : ""}{a}
                </button>
              ))}
            </div>
            <div className="bg-brand-cream rounded-2xl p-4 mt-4">
              <h3 className="font-heading text-lg font-bold text-brand-brown mb-3">REVIEW</h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-semibold text-brand-brown">{form.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Sports</span><span className="font-semibold text-brand-brown">{form.sports.join(", ")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Courts</span><span className="font-semibold text-brand-brown">{form.court_count}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Price</span><span className="font-semibold text-brand-orange">฿{form.price_per_hour}/hr</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span className="font-semibold text-brand-brown">{form.payment_mode === "both" ? "Flexible" : form.payment_mode === "in_app" ? "Online" : "At venue"}</span></div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => step < 3 ? setStep(s => s + 1) : submit()}
          disabled={submitting || (step === 1 && !form.name) || (step === 2 && form.sports.length === 0)}
          className="mt-6 w-full bg-brand-orange text-white py-4 rounded-2xl font-bold text-lg font-heading tracking-wide disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-brand-orange/90 transition-colors"
        >
          {step < 3 ? (<>Next <ArrowRight size={18} /></>) : submitting ? "Submitting..." : "Submit for approval"}
        </button>
      </div>
    </div>
  );
}