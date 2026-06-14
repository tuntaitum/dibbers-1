import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Flame, Clock, CalendarCheck, TrendingUp, Zap } from "lucide-react";
import { getWeek, getYear, parseISO, isThisWeek, isThisMonth } from "date-fns";
import useIsMobileApp from "@/hooks/useIsMobileApp";

export default function Stats() {
  const isMobile = useIsMobileApp();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const [profiles, bks] = await Promise.all([
        base44.entities.PlayerProfile.filter({ user_id: u.id }),
        base44.entities.Booking.filter({ player_id: u.id, booking_status: "confirmed" }, "-date", 100),
      ]);

      // Auto-log completed sessions
      const now = new Date();
      const nowDate = now.toISOString().split("T")[0];
      const nowTime = now.toTimeString().substring(0, 5);
      let completedCount = 0;
      let totalHrs = 0;
      let weekSessions = 0;
      let monthSessions = 0;
      let padelHrs = 0, squashHrs = 0, pickleHrs = 0;

      for (const b of bks) {
        const isPast = b.date < nowDate || (b.date === nowDate && b.end_time <= nowTime);
        if (isPast) {
          completedCount++;
          const hrs = b.duration_hours || 1;
          totalHrs += hrs;
          if (b.sport === "Padel") padelHrs += hrs;
          else if (b.sport === "Squash") squashHrs += hrs;
          else if (b.sport === "Pickleball") pickleHrs += hrs;
          try {
            const d = parseISO(b.date);
            if (isThisWeek(d)) weekSessions++;
            if (isThisMonth(d)) monthSessions++;
          } catch {}
        }
      }

      // Streak calculation
      const weeks = new Set(bks.filter(b => b.date < nowDate || (b.date === nowDate && b.end_time <= nowTime)).map(b => {
        try { return `${getYear(parseISO(b.date))}-${getWeek(parseISO(b.date))}`; } catch { return ""; }
      }).filter(Boolean));
      const currentWeekKey = `${getYear(now)}-${getWeek(now)}`;
      let streak = 0;
      let checkWeek = now;
      for (let i = 0; i < 52; i++) {
        const wk = `${getYear(checkWeek)}-${getWeek(checkWeek)}`;
        if (weeks.has(wk)) {
          streak++;
          checkWeek = new Date(checkWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else break;
      }

      const existing = profiles[0];
      if (existing) {
        await base44.entities.PlayerProfile.update(existing.id, {
          total_sessions: completedCount,
          total_hours_played: Math.round(totalHrs * 10) / 10,
          sessions_this_week: weekSessions,
          sessions_this_month: monthSessions,
          current_streak_weeks: streak,
          longest_streak_weeks: Math.max(streak, existing.longest_streak_weeks || 0),
          padel_hours: Math.round(padelHrs * 10) / 10,
          squash_hours: Math.round(squashHrs * 10) / 10,
          pickleball_hours: Math.round(pickleHrs * 10) / 10,
        });
        setProfile({ ...existing, total_sessions: completedCount, total_hours_played: totalHrs, sessions_this_week: weekSessions, sessions_this_month: monthSessions, current_streak_weeks: streak, padel_hours: padelHrs, squash_hours: squashHrs, pickleball_hours: pickleHrs });
      } else {
        const newProfile = await base44.entities.PlayerProfile.create({
          user_id: u.id,
          display_name: u.full_name || u.email,
          total_sessions: completedCount,
          total_hours_played: Math.round(totalHrs * 10) / 10,
          sessions_this_week: weekSessions,
          sessions_this_month: monthSessions,
          current_streak_weeks: streak,
          longest_streak_weeks: streak,
          padel_hours: Math.round(padelHrs * 10) / 10,
          squash_hours: Math.round(squashHrs * 10) / 10,
          pickleball_hours: Math.round(pickleHrs * 10) / 10,
        });
        setProfile(newProfile);
      }
      setBookings(bks);
      setLoading(false);
    });
  }, []);

  const sportBreakdown = [
    { sport: "Padel", emoji: "🎾", hours: profile?.padel_hours || 0, color: "bg-brand-orange" },
    { sport: "Squash", emoji: "🏸", hours: profile?.squash_hours || 0, color: "bg-brand-green" },
    { sport: "Pickleball", emoji: "🏓", hours: profile?.pickleball_hours || 0, color: "bg-brand-sky border border-border" },
  ];
  const maxHours = Math.max(...sportBreakdown.map(s => s.hours), 1);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
    </div>
  );

  const pad = isMobile ? "px-4" : "max-w-3xl mx-auto px-8";

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className={`bg-brand-brown ${isMobile ? "px-4 pt-5 pb-6" : "px-8 py-8"}`}>
        <div className={isMobile ? "" : "max-w-3xl mx-auto"}>
          <h1 className="font-heading text-4xl font-bold text-white">MY STATS</h1>
          <p className="text-white/60 text-sm">Your playing journey</p>
        </div>
      </div>

      <div className={`${pad} py-5 space-y-4`}>
        {/* Streak banner */}
        <div className="bg-brand-orange rounded-2xl p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame size={20} className="text-white animate-streak-pulse" />
              <p className="text-white/80 text-sm font-semibold">WEEKLY STREAK</p>
            </div>
            <p className="font-stat text-6xl text-white leading-none">{profile?.current_streak_weeks || 0}</p>
            <p className="text-white/70 text-sm mt-1">consecutive weeks</p>
          </div>
          <div className="text-right">
            {(profile?.current_streak_weeks || 0) === 0 ? (
              <div className="bg-white/20 rounded-xl px-4 py-3 text-center">
                <p className="text-white text-xs font-semibold">Start your streak</p>
                <p className="text-white/60 text-xs mt-0.5">Book a session this week</p>
              </div>
            ) : (
              <div className="bg-white/20 rounded-xl px-4 py-3 text-center">
                <p className="font-stat text-3xl text-white">{profile?.longest_streak_weeks || 0}</p>
                <p className="text-white/70 text-xs">personal best</p>
              </div>
            )}
          </div>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-brand-orange" />
              <span className="text-xs text-muted-foreground font-semibold">TOTAL HOURS</span>
            </div>
            <p className="font-stat text-5xl text-brand-brown">{profile?.total_hours_played || 0}</p>
            <p className="text-muted-foreground text-xs mt-0.5">hours on court</p>
          </div>
          <div className="bg-white rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <CalendarCheck size={16} className="text-brand-green" />
              <span className="text-xs text-muted-foreground font-semibold">SESSIONS</span>
            </div>
            <p className="font-stat text-5xl text-brand-brown">{profile?.total_sessions || 0}</p>
            <p className="text-muted-foreground text-xs mt-0.5">total sessions</p>
          </div>
          <div className="bg-white rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-brand-orange" />
              <span className="text-xs text-muted-foreground font-semibold">THIS WEEK</span>
            </div>
            <p className="font-stat text-5xl text-brand-brown">{profile?.sessions_this_week || 0}</p>
            <p className="text-muted-foreground text-xs mt-0.5">sessions played</p>
          </div>
          <div className="bg-white rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-brand-green" />
              <span className="text-xs text-muted-foreground font-semibold">THIS MONTH</span>
            </div>
            <p className="font-stat text-5xl text-brand-brown">{profile?.sessions_this_month || 0}</p>
            <p className="text-muted-foreground text-xs mt-0.5">sessions played</p>
          </div>
        </div>

        {/* Sport breakdown */}
        <div className="bg-white rounded-2xl border border-border p-4">
          <h2 className="font-heading text-lg font-bold text-brand-brown mb-4">SPORT BREAKDOWN</h2>
          <div className="space-y-3">
            {sportBreakdown.map(({ sport, emoji, hours, color }) => (
              <div key={sport}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span>{emoji}</span>
                    <span className="text-sm font-semibold text-brand-brown">{sport}</span>
                  </div>
                  <span className="font-stat text-lg text-brand-brown">{hours}h</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${color}`}
                    style={{ width: `${(hours / maxHours) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          {(profile?.total_hours_played || 0) === 0 && (
            <div className="mt-4 text-center py-4">
              <p className="text-muted-foreground text-sm">No sessions yet. Time to get on the court.</p>
            </div>
          )}
        </div>

        {/* Milestones */}
        <div className="bg-brand-green rounded-2xl p-4">
          <h2 className="font-heading text-lg font-bold text-white mb-3">MILESTONES</h2>
          <div className="space-y-2">
            {[
              { label: "First session", target: 1, current: profile?.total_sessions || 0, icon: "🎯" },
              { label: "10 hours played", target: 10, current: profile?.total_hours_played || 0, icon: "⏱️" },
              { label: "5 week streak", target: 5, current: profile?.current_streak_weeks || 0, icon: "🔥" },
              { label: "25 sessions", target: 25, current: profile?.total_sessions || 0, icon: "🏆" },
            ].map(m => {
              const done = m.current >= m.target;
              return (
                <div key={m.label} className={`flex items-center gap-3 p-3 rounded-xl ${done ? "bg-white/20" : "bg-white/10"}`}>
                  <span className="text-xl">{m.icon}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${done ? "text-white" : "text-white/60"}`}>{m.label}</p>
                    {!done && <div className="h-1 bg-white/20 rounded-full mt-1 overflow-hidden"><div className="h-full bg-brand-orange rounded-full" style={{ width: `${Math.min((m.current / m.target) * 100, 100)}%` }} /></div>}
                  </div>
                  {done && <span className="text-white font-bold text-sm">✓</span>}
                  {!done && <span className="text-white/50 text-xs">{m.current}/{m.target}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}