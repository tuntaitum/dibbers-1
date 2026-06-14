import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useSearchParams } from "react-router-dom";
import { Plus, Clock, ToggleLeft, ToggleRight, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import SportBadge from "@/components/SportBadge";

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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-brand-green px-6 pt-8 pb-5">
        <h1 className="font-heading text-4xl font-bold text-white">MY COURTS</h1>
        {venues.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
            {venues.map(v => (
              <button key={v.id} onClick={() => switchVenue(v)} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${selectedVenue?.id === v.id ? "bg-brand-orange text-white border-brand-orange" : "bg-white/10 text-white border-white/20"}`}>
                {v.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 py-5">
        {!selectedVenue ? (
          <div className="text-center py-20">
            <p className="font-heading text-xl text-brand-brown">No approved venues yet.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-heading text-xl font-bold text-brand-brown">{selectedVenue.name}</h2>
                <p className="text-xs text-muted-foreground">{courts.length} court{courts.length !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={() => setAddingCourt(!addingCourt)} className="flex items-center gap-1 bg-brand-orange text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                <Plus size={12} /> Add court
              </button>
            </div>

            {addingCourt && (
              <div className="bg-white rounded-2xl border border-border p-4 mb-4 animate-fade-in space-y-3">
                <h3 className="font-heading text-lg font-bold text-brand-brown">NEW COURT</h3>
                <input value={newCourt.name} onChange={e => setNewCourt(n => ({ ...n, name: e.target.value }))} placeholder="Court name (e.g. Court 1)" className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-brand-orange text-brand-brown" />
                <div className="flex gap-2">
                  {["Padel", "Squash", "Pickleball"].map(s => (
                    <button key={s} onClick={() => setNewCourt(n => ({ ...n, sport: s }))} className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${newCourt.sport === s ? "bg-brand-orange text-white border-brand-orange" : "bg-white text-brand-brown border-border"}`}>{s}</button>
                  ))}
                </div>
                <input type="number" value={newCourt.price_per_hour} onChange={e => setNewCourt(n => ({ ...n, price_per_hour: e.target.value }))} placeholder="Price per hour (฿)" className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-brand-orange text-brand-brown" />
                <div className="flex gap-2">
                  <button onClick={() => setAddingCourt(false)} className="flex-1 py-2 border border-border rounded-xl text-sm text-brand-brown font-semibold">Cancel</button>
                  <button onClick={createCourt} className="flex-1 py-2 bg-brand-orange text-white rounded-xl text-sm font-semibold">Create</button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {courts.map(court => {
                const courtSchedules = schedules.filter(s => s.court_id === court.id);
                const expanded = expandedCourt === court.id;
                return (
                  <div key={court.id} className="bg-white rounded-2xl border border-border overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <h3 className="font-heading text-lg font-bold text-brand-brown">{court.name}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <SportBadge sport={court.sport} />
                              <span className="text-xs text-muted-foreground">฿{court.price_per_hour}/hr</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleCourt(court)} className="text-muted-foreground hover:text-brand-orange transition-colors">
                            {court.status === "active" ? <ToggleRight size={24} className="text-brand-green" /> : <ToggleLeft size={24} />}
                          </button>
                          <button onClick={() => setExpandedCourt(expanded ? null : court.id)} className="text-muted-foreground hover:text-brand-brown transition-colors p-1">
                            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {expanded && (
                      <div className="border-t border-border p-4 bg-brand-cream/50 animate-fade-in">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-heading text-base font-bold text-brand-brown flex items-center gap-1"><Clock size={14} /> RECURRING SCHEDULE</h4>
                          <button onClick={() => setAddingSchedule(court.id)} className="text-xs text-brand-orange font-semibold hover:underline">+ Add slot</button>
                        </div>
                        {courtSchedules.length === 0 ? (
                          <p className="text-muted-foreground text-xs">No recurring slots set. Add slots to make this court bookable.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {courtSchedules.map(sc => (
                              <div key={sc.id} className="flex items-center justify-between bg-white rounded-xl px-3 py-2">
                                <span className="text-sm font-semibold text-brand-brown">{DAYS[sc.day_of_week]}</span>
                                <span className="text-xs text-muted-foreground">{sc.start_time} – {sc.end_time}</span>
                                <span className="font-stat text-sm text-brand-orange">฿{sc.price}</span>
                                <button onClick={() => deleteSchedule(sc.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                              </div>
                            ))}
                          </div>
                        )}

                        {addingSchedule === court.id && (
                          <div className="mt-3 bg-white rounded-xl p-3 space-y-2 animate-fade-in">
                            <select value={newSchedule.day_of_week} onChange={e => setNewSchedule(s => ({ ...s, day_of_week: parseInt(e.target.value) }))} className="w-full border border-border rounded-lg px-3 py-2 text-sm text-brand-brown focus:outline-none focus:border-brand-orange">
                              {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                            </select>
                            <div className="flex gap-2">
                              <select value={newSchedule.start_time} onChange={e => setNewSchedule(s => ({ ...s, start_time: e.target.value }))} className="flex-1 border border-border rounded-lg px-2 py-2 text-sm text-brand-brown focus:outline-none focus:border-brand-orange">
                                {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                              </select>
                              <select value={newSchedule.end_time} onChange={e => setNewSchedule(s => ({ ...s, end_time: e.target.value }))} className="flex-1 border border-border rounded-lg px-2 py-2 text-sm text-brand-brown focus:outline-none focus:border-brand-orange">
                                {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                              </select>
                            </div>
                            <input type="number" value={newSchedule.price} onChange={e => setNewSchedule(s => ({ ...s, price: e.target.value }))} placeholder="Price ฿" className="w-full border border-border rounded-lg px-3 py-2 text-sm text-brand-brown focus:outline-none focus:border-brand-orange" />
                            <div className="flex gap-2">
                              <button onClick={() => setAddingSchedule(null)} className="flex-1 py-2 border border-border rounded-lg text-xs text-brand-brown font-semibold">Cancel</button>
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
                <div className="text-center py-12 bg-white rounded-2xl border border-border">
                  <p className="font-heading text-lg text-brand-brown mb-1">NO COURTS YET</p>
                  <p className="text-muted-foreground text-sm">Add your first court to start accepting bookings.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}