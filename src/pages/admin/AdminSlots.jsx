import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { format, addDays } from "date-fns";
import { Loader2, Plus, Trash2, Ban, CheckCircle2, Clock } from "lucide-react";
import { frostedCard, noiseOverlay } from "@/lib/portalDesign";
import PageBanner from "@/components/PageBanner";
import SportBadge from "@/components/SportBadge";

const HOURS = Array.from({ length: 17 }, (_, i) => {
  const h = i + 6;
  return `${h.toString().padStart(2, "0")}:00`;
});

const statusConfig = {
  available: { label: "Available", cls: "bg-brand-green/10 text-brand-green" },
  booked: { label: "Booked", cls: "bg-amber-100 text-amber-700" },
  blocked: { label: "Blocked", cls: "bg-muted text-muted-foreground" },
};

export default function AdminSlots() {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSlot, setNewSlot] = useState({ start_time: "08:00", end_time: "09:00", price: "" });

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(new Date(), i);
    return { value: format(d, "yyyy-MM-dd"), label: format(d, "EEE"), day: format(d, "d"), month: format(d, "MMM") };
  });

  useEffect(() => {
    base44.entities.Venue.filter({ status: "approved" }).then((vs) => {
      setVenues(vs);
      if (vs.length > 0) loadVenueCourts(vs[0]);
      else setLoading(false);
    });
  }, []);

  const loadVenueCourts = async (venue) => {
    setSelectedVenue(venue);
    setSelectedCourt(null);
    setSlots([]);
    const cs = await base44.entities.Court.filter({ venue_id: venue.id });
    setCourts(cs);
    if (cs.length > 0) setSelectedCourt(cs[0]);
    setLoading(false);
  };

  useEffect(() => {
    if (!selectedCourt || !selectedDate) return;
    base44.entities.TimeSlot.filter({ court_id: selectedCourt.id, date: selectedDate }).then((s) =>
      setSlots(s.sort((a, b) => a.start_time.localeCompare(b.start_time)))
    );
  }, [selectedCourt, selectedDate]);

  const createSlot = async () => {
    if (!selectedCourt || !selectedVenue || !newSlot.price) return;
    const slot = await base44.entities.TimeSlot.create({
      court_id: selectedCourt.id,
      venue_id: selectedVenue.id,
      date: selectedDate,
      start_time: newSlot.start_time,
      end_time: newSlot.end_time,
      price: parseFloat(newSlot.price),
      status: "available",
    });
    setSlots((ss) => [...ss, slot].sort((a, b) => a.start_time.localeCompare(b.start_time)));
    setNewSlot({ start_time: "08:00", end_time: "09:00", price: "" });
    setShowAddForm(false);
  };

  const toggleBlock = async (slot) => {
    setActing(slot.id);
    const newStatus = slot.status === "blocked" ? "available" : "blocked";
    const updated = await base44.entities.TimeSlot.update(slot.id, { status: newStatus });
    setSlots((ss) => ss.map((s) => (s.id === slot.id ? updated : s)));
    setActing(null);
  };

  const deleteSlot = async (slot) => {
    setActing(slot.id);
    await base44.entities.TimeSlot.delete(slot.id);
    setSlots((ss) => ss.filter((s) => s.id !== slot.id));
    setActing(null);
  };

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>
      <PageBanner title="SLOT MANAGEMENT" subtitle="Control court availability across all venues" variant="dark" />

      {/* Venue selector */}
      <div className="px-6 md:px-10 py-4">
        <p className="text-xs font-bold text-[#1a1a1a]/40 tracking-wide mb-2">VENUE</p>
        {venues.length === 0 && !loading ? (
          <p className="text-sm text-[#1a1a1a]/40 font-light">No approved venues available.</p>
        ) : (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {venues.map((v) => (
              <button
                key={v.id}
                onClick={() => loadVenueCourts(v)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                  selectedVenue?.id === v.id
                    ? "bg-brand-orange text-white border-brand-orange"
                    : "bg-white/60 text-[#1a1a1a]/50 border-[#1a1a1a]/12 hover:border-brand-orange/40"
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Court selector + date picker */}
      {selectedVenue && courts.length > 0 && (
        <div className="px-6 md:px-10 space-y-4">
          <div>
            <p className="text-xs font-bold text-[#1a1a1a]/40 tracking-wide mb-2">COURT</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {courts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCourt(c)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    selectedCourt?.id === c.id
                      ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                      : "bg-white/60 text-[#1a1a1a]/50 border-[#1a1a1a]/12 hover:border-brand-orange/40"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Date picker */}
          <div>
            <p className="text-xs font-bold text-[#1a1a1a]/40 tracking-wide mb-2">DATE</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {dates.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDate(d.value)}
                  className={`flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-xl border transition-all ${
                    selectedDate === d.value
                      ? "bg-brand-orange text-white border-brand-orange"
                      : "bg-white/60 text-[#1a1a1a]/50 border-[#1a1a1a]/12 hover:border-brand-orange/40"
                  }`}
                >
                  <span className="text-[10px] font-semibold opacity-70">{d.label}</span>
                  <span className="font-stat text-lg leading-none mt-0.5">{d.day}</span>
                  <span className="text-[9px] opacity-60 mt-0.5">{d.month}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Slots list */}
      <div className="px-6 md:px-10 py-5">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-orange" size={28} />
          </div>
        ) : !selectedVenue ? (
          <div className="text-center py-20">
            <p className="font-heading text-xl text-[#1a1a1a]">No venues to manage</p>
          </div>
        ) : courts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-heading text-xl text-[#1a1a1a]">No courts at this venue</p>
            <p className="text-sm text-[#1a1a1a]/40 font-light mt-1">Add courts via the venue portal first.</p>
          </div>
        ) : (
          <>
            {/* Court info + add button */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="font-heading text-xl font-bold text-[#1a1a1a]">{selectedCourt?.name}</h2>
                {selectedCourt && <SportBadge sport={selectedCourt.sport} />}
                <span className="font-stat text-sm text-brand-orange">฿{selectedCourt?.price_per_hour}/hr</span>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-brand-orange text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5"
              >
                <Plus size={16} />
                Add Slot
              </button>
            </div>

            {/* Add slot form */}
            {showAddForm && (
              <div className="rounded-2xl p-4 mb-4 animate-fade-in space-y-3" style={frostedCard}>
                <h3 className="font-heading text-lg font-bold text-[#1a1a1a]">NEW SLOT — {format(new Date(selectedDate), "EEE, d MMM")}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#1a1a1a]/40 tracking-wide block mb-1">START</label>
                    <select
                      value={newSlot.start_time}
                      onChange={(e) => setNewSlot((s) => ({ ...s, start_time: e.target.value }))}
                      className="w-full border border-[#1a1a1a]/12 rounded-xl px-3 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:border-brand-orange bg-white"
                    >
                      {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#1a1a1a]/40 tracking-wide block mb-1">END</label>
                    <select
                      value={newSlot.end_time}
                      onChange={(e) => setNewSlot((s) => ({ ...s, end_time: e.target.value }))}
                      className="w-full border border-[#1a1a1a]/12 rounded-xl px-3 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:border-brand-orange bg-white"
                    >
                      {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#1a1a1a]/40 tracking-wide block mb-1">PRICE (฿)</label>
                    <input
                      type="number"
                      value={newSlot.price}
                      onChange={(e) => setNewSlot((s) => ({ ...s, price: e.target.value }))}
                      placeholder="500"
                      className="w-full border border-[#1a1a1a]/12 rounded-xl px-3 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:border-brand-orange bg-white"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <button onClick={() => setShowAddForm(false)} className="flex-1 py-2.5 border border-[#1a1a1a]/12 rounded-xl text-sm text-[#1a1a1a] font-semibold">Cancel</button>
                    <button onClick={createSlot} className="flex-1 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-semibold">Create</button>
                  </div>
                </div>
              </div>
            )}

            {/* Slots */}
            {slots.length === 0 ? (
              <div className="text-center py-12 rounded-2xl" style={frostedCard}>
                <Clock size={28} className="mx-auto text-[#1a1a1a]/20 mb-2" />
                <p className="font-heading text-lg text-[#1a1a1a]">No slots for this date</p>
                <p className="text-[#1a1a1a]/40 text-sm font-light">Click "Add Slot" to create availability.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {slots.map((slot) => {
                  const cfg = statusConfig[slot.status] || statusConfig.available;
                  const isBooked = slot.status === "booked";
                  return (
                    <div key={slot.id} className="rounded-2xl p-4 flex items-center justify-between" style={frostedCard}>
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex-shrink-0">
                          <p className="font-heading text-base font-bold text-[#1a1a1a]">{slot.start_time} – {slot.end_time}</p>
                          <p className="font-stat text-sm text-brand-orange">฿{slot.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.cls}`}>{cfg.label}</span>
                        {!isBooked && (
                          <button
                            onClick={() => toggleBlock(slot)}
                            disabled={acting === slot.id}
                            className="p-2 rounded-lg text-[#1a1a1a]/40 hover:text-brand-orange hover:bg-brand-orange/10 transition-all disabled:opacity-40"
                            title={slot.status === "blocked" ? "Unblock" : "Block"}
                          >
                            {slot.status === "blocked" ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                          </button>
                        )}
                        {!isBooked && (
                          <button
                            onClick={() => deleteSlot(slot)}
                            disabled={acting === slot.id}
                            className="p-2 rounded-lg text-[#1a1a1a]/40 hover:text-destructive hover:bg-destructive/10 transition-all disabled:opacity-40"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        {isBooked && (
                          <span className="text-xs text-[#1a1a1a]/30 font-light ml-1">In use</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}