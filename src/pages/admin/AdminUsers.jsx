import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Users, Loader2, User } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.User.list().then(us => { setUsers(us); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-brand-brown px-6 pt-8 pb-5">
        <h1 className="font-heading text-4xl font-bold text-white">USERS</h1>
        <p className="text-white/60 text-sm mt-0.5">{users.length} registered users</p>
      </div>

      <div className="px-6 py-4">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-orange" size={28} /></div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <Users size={36} className="mx-auto text-muted-foreground mb-2" />
            <p className="font-heading text-xl text-brand-brown">NO USERS YET</p>
          </div>
        ) : (
          <div className="space-y-2">
            {users.map(u => (
              <div key={u.id} className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-brand-orange" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-brand-brown text-sm truncate">{u.full_name || "—"}</p>
                  <p className="text-muted-foreground text-xs truncate">{u.email}</p>
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