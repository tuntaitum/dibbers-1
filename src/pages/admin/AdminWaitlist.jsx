import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";
import { noiseOverlay, frostedCard } from "@/lib/portalDesign";

export default function AdminWaitlist() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.WaitlistEntry.list("-submitted_at").then(data => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  const exportCSV = () => {
    const rows = [["Email", "Source", "Submitted At"], ...entries.map(e => [e.email, e.source || "", e.submitted_at || e.created_date || ""])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "waitlist.csv";
    a.click();
  };

  return (
    <div className="p-6 md:p-10" style={{ background: "#F7F5F0", minHeight: "100vh" }}>
      {/* Header with noise */}
      <div className="relative -mx-6 md:-mx-10 -mt-6 md:-mt-10 px-6 md:px-10 pt-8 pb-6 mb-8 overflow-hidden">
        <div className="absolute inset-0" style={noiseOverlay} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-[-0.03em] text-[#1a1a1a]">WAITLIST</h1>
            <p className="text-[#1a1a1a]/40 text-sm mt-1 font-light">{entries.length} sign-ups collected</p>
          </div>
          {entries.length > 0 && (
            <button
              onClick={exportCSV}
              className="bg-brand-green text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand-green/90 transition-colors"
            >
              Export CSV
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-heading text-xl text-[#1a1a1a]">No sign-ups yet</p>
          <p className="text-[#1a1a1a]/40 text-sm mt-1 font-light">Entries will appear here when visitors submit the notify form.</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={frostedCard}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a1a1a]/8">
                  <th className="text-left px-4 py-3 font-semibold text-[#1a1a1a]/50 tracking-wide">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#1a1a1a]/50 tracking-wide">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#1a1a1a]/50 tracking-wide">Source</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#1a1a1a]/50 tracking-wide">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => (
                  <tr key={entry.id} className="border-b border-[#1a1a1a]/6 last:border-0 hover:bg-white/20 transition-colors">
                    <td className="px-4 py-3 text-[#1a1a1a]/40 font-light">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-[#1a1a1a]">{entry.email}</td>
                    <td className="px-4 py-3 text-[#1a1a1a]/40 font-light capitalize">{entry.source?.replace("_", " ") || "—"}</td>
                    <td className="px-4 py-3 text-[#1a1a1a]/40 font-light">
                      {entry.submitted_at ? format(new Date(entry.submitted_at), "dd MMM yyyy, HH:mm") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}