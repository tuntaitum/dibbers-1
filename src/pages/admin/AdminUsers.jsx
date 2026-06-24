import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";
import { frostedCard } from "@/lib/portalDesign";
import PageBanner from "@/components/PageBanner";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.User.list().then(us => { setUsers(us); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#F7F5F0" }}>
      <PageBanner title="USERS" subtitle={`${users.length} registered users`} />

      <div className="px-6 md:px-10 py-4">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-orange" size={28} /></div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-heading text-xl text-[#1a1a1a]">NO USERS YET</p>
          </div>
        ) : (
          <div className="space-y-2">
            {users.map(u => (
              <div key={u.id} className="rounded-2xl p-4 flex items-center gap-3" style={frostedCard}>
                <div className="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-heading font-bold text-brand-orange text-sm">{(u.full_name || u.email || "?")[0].toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1a1a1a] text-sm truncate">{u.full_name || "—"}</p>
                  <p className="text-[#1a1a1a]/40 text-xs truncate font-light">{u.email}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${u.role === "admin" ? "bg-brand-brown/10 text-brand-brown" : "bg-brand-green/10 text-brand-green"}`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}