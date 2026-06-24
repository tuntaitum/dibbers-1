import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useSearchParams } from "react-router-dom";
import { ToggleLeft, ToggleRight, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import SportBadge from "@/components/SportBadge";
import { frostedCard } from "@/lib/portalDesign";
import PageBanner from "@/components/PageBanner";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const HOURS = Array.from({ length: 17 }, (_, i) => {
  const h = i + 6;
  return `${h.toString().padStart(2, "0")}:00`;
});

export default function MyCourts() {
  const [searchParams] = useSearchParams();
  const venueId = searchParams.get("venueId");
  const [venues, setVenues] = useState([]);
  const [courts, setCourts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [expandedCourt, setExpandedCourt] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingCourt, setAddingCourt] = useState(false);
  const [newCourt, setNewCourt] = useState({ name: "", sport: "Padel", price_per_hour: "" });
  const [addingSchedule, setAddingSchedule] = useState(null);
  const [newSchedule, setNewSchedule] = useState({ day_of_week: 1, start_time: "08:00", end_time: "09:00", price: "" });

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const vs = await base44.entities.Venue.filter({ owner_id: u.id });
      setVenues(vs);
      const firstVenue = venueId ? vs.find(v => v.id === venueId) || vs[0] : vs[0];
      if (firstVenue) {
        setSelectedVenue(firstVenue);
        const [cs, sc] = await Promise.all([
          base44.entities.Court.filter({ venue_id: firstVenue.id }),
          base44.entities.RecurringSchedule.filter({ venue_id: firstVenue.id }),
        ]);
        setCourts(cs);
        setSchedules(sc);
      }
      setLoading(false);
    });
  }, []);

  const switchVenue = async (v) => {
    setSelectedVenue(v);
    const [cs, sc] = await Promise.all([
      base44.entities.Court.filter({ venue_id: v.id }),
      base44.entities.RecurringSchedule.filter({ venue_id: v.id }),
    ]);
    setCourts(cs);
    setSchedules(sc);
  };

  const createCourt = async () => {
    if (!newCourt.name || !selectedVenue) return;
    const c = await base44.entities.Court.create({
      venue_id: selectedVenue.id,
      name: newCourt.name,
      sport: newCourt.sport,
      price_per_hour: parseFloat(newCourt.price_per_hour) || selectedVenue.price_per_hour || 500,
      status: "active",
    });
    setCourts(cs => [...cs, c]);
    setNewCourt({ name: "", sport: "Padel", price_per_hour: "" });
    setAddingCourt(false);
  };

  const toggleCourt = async (court) => {
    const newStatus = court.status === "active" ? "inactive" : "active";
    await base44.entities.Court.update(court.id, { status: newStatus });
    setCourts(cs => cs.map(c => c.id === court.id ? { ...c, status: newStatus } : c));
  };

  const createSchedule = async (courtId) => {
    if (!newSchedule.price) return;
    const s = await base44.entities.RecurringSchedule.create({
      court_id: courtId,
      venue_id: selectedVenue.id,
      ...newSchedule,
      price: parseFloat(newSchedule.price),
    });
    setSchedules(ss => [...ss, s]);
    setAddingSchedule(null);
    setNewSchedule({ day_of_week: 1, start_time: "08:00", end_time: "09:00", price: "" });
  };

  const deleteSchedule = async (id) => {
    await base44.entities.RecurringSchedule.delete(id);
    setSchedules(ss => ss.filter(s => s.id !== id));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F7F5F0" }}>
      <div className="w-8 h-8 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "#F7F5F0" }}>
      <PageBanner title="MY COURTS">
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-heading text-xl font-bold text-[#1a1a1a]">{selectedVenue.name}</h2>
                <p className="text-xs text-[#1a1a1a]/40 font-light">{courts.length} court{courts.length !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={() => setAddingCourt(!addingCourt)} className="bg-brand-orange text-white px-4 py-1.5 rounded-full text-xs font-semibold">Add court</button>
            </div>

            {addingCourt && (
              <div className="rounded-2xl p-4 mb-4 animate-fade-in space-y-3" style={frostedCard}>
                <h3 className="font-heading text-lg font-bold text-[#1a1a1a]">NEW COURT</h3>
                <input value={newCourt.name} onChange={e => setNewCourt(n => ({ ...n, name: e.target.value }))} placeholder="Court name (e.g. Court 1)" className="w-full border border-[#1a1a1a]/12 rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-brand-orange text-[#1a1a1a]" />
                <div className="flex gap-2">
                  {["Padel", "Squash", "Pickleball"].map(s => (
                    <button key={s} onClick={() => setNewCourt(n => ({ ...n, sport: s }))} className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${newCourt.sport === s ? "bg-brand-orange text-white border-brand-orange" : "text-[#1a1a1a]/50 border-[#1a1a1a]/12"}`}>{s}</button>
                  ))}
                </div>
                <input type="number" value={newCourt.price_per_hour} onChange={e => setNewCourt(n => ({ ...n, price_per_hour: e.target.value }))} placeholder="Price per hour (฿)" className="w-full border border-[#1a1a1a]/12 rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-brand-orange text-[#1a1a1a]" />
                <div className="flex gap-2">
                  <button onClick={() => setAddingCourt(false)} className="flex-1 py-2 border border-[#1a1a1a]/12 rounded-xl text-sm text-[#1a1a1a] font-semibold">Cancel</button>
                  <button onClick={createCourt} className="flex-1 py-2 bg-brand-orange text-white rounded-xl text-sm font-semibold">Create</button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {courts.map(court => {
                const courtSchedules = schedules.filter(s => s.court_id === court.id);
                const expanded = expandedCourt === court.id;
                return (
                  <div key={court.id} className="rounded-2xl overflow-hidden" style={frostedCard}>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-heading text-lg font-bold text-[#1a1a1a]">{court.name}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <SportBadge sport={court.sport} />
                            <span className="text-xs text-[#1a1a1a]/40 font-light">฿{court.price_per_hour}/hr</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleCourt(court)} className="text-muted-foreground hover:text-brand-orange transition-colors">
                            {court.status === "active" ? <ToggleRight size={24} className="text-brand-green" /> : <ToggleLeft size={24} />}
                          </button>
                          <button onClick={() => setExpandedCourt(expanded ? null : court.id)} className="text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors p-1">
                            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {expanded && (
                      <div className="border-t border-[#1a1a1a]/8 p-4 animate-fade-in" style={{ background: "rgba(235,232,220,0.4)" }}>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-heading text-base font-bold text-[#1a1a1a]">RECURRING SCHEDULE</h4>
                          <button onClick={() => setAddingSchedule(court.id)} className="text-xs text-brand-orange font-semibold hover:underline">+ Add slot</button>
                        </div>
                        {courtSchedules.length === 0 ? (
                          <p className="text-[#1a1a1a]/40 text-xs font-light">No recurring slots set. Add slots to make this court bookable.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {courtSchedules.map(sc => (
                              <div key={sc.id} className="flex items-center justify-between bg-white/60 rounded-xl px-3 py-2">
                                <span className="text-sm font-semibold text-[#1a1a1a]">{DAYS[sc.day_of_week]}</span>
                                <span className="text-xs text-[#1a1a1a]/40 font-light">{sc.start_time} – {sc.end_time}</span>
                                <span className="font-stat text-sm text-brand-orange">฿{sc.price}</span>
                                <button onClick={() => deleteSchedule(sc.id)} className="text-[#1a1a1a]/30 hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                              </div>
                            ))}
                          </div>
                        )}
                        {addingSchedule === court.id && (
                          <div className="mt-3 bg-white/70 rounded-xl p-3 space-y-2 animate-fade-in">
                            <select value={newSchedule.day_of_week} onChange={e => setNewSchedule(s => ({ ...s, day_of_week: parseInt(e.target.value) }))} className="w-full border border-[#1a1a1a]/12 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-brand-orange">
                              {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                            </select>
                            <div className="flex gap-2">
                              <select value={newSchedule.start_time} onChange={e => setNewSchedule(s => ({ ...s, start_time: e.target.value }))} className="flex-1 border border-[#1a1a1a]/12 rounded-lg px-2 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-brand-orange">
                                {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                              </select>
                              <select value={newSchedule.end_time} onChange={e => setNewSchedule(s => ({ ...s, end_time: e.target.value }))} className="flex-1 border border-[#1a1a1a]/12 rounded-lg px-2 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-brand-orange">
                                {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                              </select>
                            </div>
                            <input type="number" value={newSchedule.price} onChange={e => setNewSchedule(s => ({ ...s, price: e.target.value }))} placeholder="Price ฿" className="w-full border border-[#1a1a1a]/12 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-brand-orange" />
                            <div className="flex gap-2">
                              <button onClick={() => setAddingSchedule(null)} className="flex-1 py-2 border border-[#1a1a1a]/12 rounded-lg text-xs text-[#1a1a1a] font-semibold">Cancel</button>
                              <button onClick={() => createSchedule(court.id)} className="flex-1 py-2 bg-brand-orange text-white rounded-lg text-xs font-semibold">Add</button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {courts.length === 0 && (
                <div className="text-center py-12 rounded-2xl" style={frostedCard}>
                  <p className="font-heading text-lg text-[#1a1a1a] mb-1">NO COURTS YET</p>
                  <p className="text-[#1a1a1a]/40 text-sm font-light">Add your first court to start accepting bookings.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}