import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { User, Edit2, LogOut, Building2, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SportBadge from "@/components/SportBadge";
import useIsMobileApp from "@/hooks/useIsMobileApp";

const SPORTS = ["Padel", "Squash", "Pickleball"];

export default function Profile() {
  const isMobile = useIsMobileApp();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [selectedSports, setSelectedSports] = useState([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      base44.entities.PlayerProfile.filter({ user_id: u.id }).then(ps => {
        if (ps[0]) {
          setProfile(ps[0]);
          setDisplayName(ps[0].display_name || u.full_name || "");
          setSelectedSports(ps[0].preferred_sports || []);
        } else {
          setDisplayName(u.full_name || "");
        }
      });
    });
  }, []);

  const save = async () => {
    setSaving(true);
    const data = { display_name: displayName, preferred_sports: selectedSports };
    if (profile) {
      const updated = await base44.entities.PlayerProfile.update(profile.id, data);
      setProfile(updated);
    } else {
      const created = await base44.entities.PlayerProfile.create({ user_id: user.id, ...data });
      setProfile(created);
    }
    setSaving(false);
    setEditing(false);
  };

  const toggleSport = (sport) => {
    setSelectedSports(s => s.includes(sport) ? s.filter(x => x !== sport) : [...s, sport]);
  };

  const logout = () => base44.auth.logout("/");

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
    </div>
  );

  const pad = isMobile ? "px-4" : "max-w-2xl mx-auto px-8";

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className={`bg-brand-brown ${isMobile ? "px-4 pt-5 pb-8" : "px-8 py-8"}`}>
        <div className={isMobile ? "" : "max-w-2xl mx-auto"}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-heading text-4xl font-bold text-white">PROFILE</h1>
            <button onClick={() => setEditing(!editing)} className="bg-white/10 text-white p-2 rounded-xl hover:bg-white/20 transition-colors">
              <Edit2 size={16} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-brand-orange/20 rounded-full flex items-center justify-center">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <User size={28} className="text-brand-orange" />
              )}
            </div>
            <div>
              <p className="font-heading text-2xl font-bold text-white">{profile?.display_name || user.full_name || "Player"}</p>
              <p className="text-white/60 text-sm">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`${pad} py-5 space-y-4`}>
        {editing ? (
          <div className="bg-white rounded-2xl border border-border p-4 space-y-4 animate-fade-in">
            <h2 className="font-heading text-lg font-bold text-brand-brown">EDIT PROFILE</h2>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Display Name</label>
              <input
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-brand-orange text-brand-brown"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">Preferred Sports</label>
              <div className="flex gap-2 flex-wrap">
                {SPORTS.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleSport(s)}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                      selectedSports.includes(s) ? "bg-brand-orange text-white border-brand-orange" : "bg-white text-brand-brown border-border"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="flex-1 py-3 rounded-xl border border-border text-brand-brown font-semibold text-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 py-3 rounded-xl bg-brand-orange text-white font-semibold text-sm disabled:opacity-60">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Sports */}
            <div className="bg-white rounded-2xl border border-border p-4">
              <h2 className="font-heading text-lg font-bold text-brand-brown mb-3">FAVOURITE SPORTS</h2>
              {(profile?.preferred_sports || []).length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {(profile.preferred_sports).map(s => <SportBadge key={s} sport={s} size="lg" />)}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No sports selected yet. Edit your profile to add them.</p>
              )}
            </div>

            {/* Quick stats */}
            <div className="bg-white rounded-2xl border border-border p-4">
              <h2 className="font-heading text-lg font-bold text-brand-brown mb-3">QUICK STATS</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="font-stat text-3xl text-brand-orange">{profile?.total_sessions || 0}</p>
                  <p className="text-xs text-muted-foreground">Sessions</p>
                </div>
                <div className="text-center">
                  <p className="font-stat text-3xl text-brand-brown">{profile?.total_hours_played || 0}</p>
                  <p className="text-xs text-muted-foreground">Hours</p>
                </div>
                <div className="text-center">
                  <p className="font-stat text-3xl text-brand-green">{profile?.current_streak_weeks || 0}</p>
                  <p className="text-xs text-muted-foreground">Streak</p>
                </div>
              </div>
            </div>

            {/* Venue owner prompt */}
            <Link to="/venue/dashboard" className="flex items-center justify-between bg-brand-green/10 border border-brand-green/20 rounded-2xl p-4 hover:bg-brand-green/15 transition-colors">
              <div className="flex items-center gap-3">
                <Building2 size={20} className="text-brand-green" />
                <div>
                  <p className="font-semibold text-brand-brown text-sm">Venue Owner?</p>
                  <p className="text-xs text-muted-foreground">Manage your courts</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>
          </>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 border border-destructive/30 text-destructive rounded-2xl font-semibold text-sm hover:bg-destructive/5 transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  );
}