import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Mail, Download } from "lucide-react";
import { format } from "date-fns";

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
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-4xl font-bold text-brand-brown">WAITLIST</h1>
          <p className="text-muted-foreground text-sm mt-1">{entries.length} sign-ups collected</p>
        </div>
        {entries.length > 0 && (
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand-green/90 transition-colors"
          >
            <Download size={16} /> Export CSV
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Mail size={36} className="mx-auto mb-3 opacity-40" />
          <p className="font-heading text-xl text-brand-brown">No sign-ups yet</p>
          <p className="text-sm">Entries will appear here when visitors submit the notify form.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-semibold text-brand-brown">#</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-brown">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-brown">Source</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-brown">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={entry.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-brand-brown">{entry.email}</td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{entry.source?.replace("_", " ") || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {entry.submitted_at ? format(new Date(entry.submitted_at), "dd MMM yyyy, HH:mm") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}