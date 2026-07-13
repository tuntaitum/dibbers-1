import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import {
  Flame, Clock, Calendar, Dumbbell, Trophy, Zap, Rocket,
  Target, Sprout, Award, Crown, Star, TrendingUp, Lock,
  CircleDot, Disc, Circle, Medal,
} from "lucide-react";
import useIsMobileApp from "@/hooks/useIsMobileApp";
import { frostedGradientGreen, noiseOverlayDark } from "@/lib/portalDesign";
import LoadingPage from "@/components/LoadingPage";

const BADGES = [
  { name: "First Steps", desc: "Complete your first session", icon: Target, check: (p) => (p.total_sessions || 0) >= 1, accent: "text-brand-orange", ring: "ring-brand-orange/30" },
  { name: "Getting Started", desc: "Play 5 sessions", icon: Sprout, check: (p) => (p.total_sessions || 0) >= 5, accent: "text-brand-green", ring: "ring-brand-green/30" },
  { name: "Regular", desc: "Play 25 sessions", icon: Calendar, check: (p) => (p.total_sessions || 0) >= 25, accent: "text-brand-orange", ring: "ring-brand-orange/30" },
  { name: "Dedicated", desc: "Play 50 sessions", icon: Dumbbell, check: (p) => (p.total_sessions || 0) >= 50, accent: "text-brand-green", ring: "ring-brand-green/30" },
  { name: "Century Club", desc: "Play 100 sessions", icon: Trophy, check: (p) => (p.total_sessions || 0) >= 100, accent: "text-brand-orange", ring: "ring-brand-orange/30" },
  { name: "Week Warrior", desc: "2-week streak", icon: Flame, check: (p) => (p.current_streak_weeks || 0) >= 2, accent: "text-brand-orange", ring: "ring-brand-orange/30" },
  { name: "On Fire", desc: "4-week streak", icon: Zap, check: (p) => (p.current_streak_weeks || 0) >= 4, accent: "text-brand-orange", ring: "ring-brand-orange/30" },
  { name: "Unstoppable", desc: "8-week best streak", icon: Rocket, check: (p) => (p.longest_streak_weeks || 0) >= 8, accent: "text-brand-green", ring: "ring-brand-green/30" },
  { name: "Time Invested", desc: "10 hours played", icon: Clock, check: (p) => (p.total_hours_played || 0) >= 10, accent: "text-brand-green", ring: "ring-brand-green/30" },
  { name: "Half Century", desc: "50 hours played", icon: Award, check: (p) => (p.total_hours_played || 0) >= 50, accent: "text-brand-orange", ring: "ring-brand-orange/30" },
  { name: "Centurion", desc: "100 hours played", icon: Crown, check: (p) => (p.total_hours_played || 0) >= 100, accent: "text-brand-orange", ring: "ring-brand-orange/30" },
  { name: "Padel Pro", desc: "10 hrs of Padel", icon: CircleDot, check: (p) => (p.padel_hours || 0) >= 10, accent: "text-brand-orange", ring: "ring-brand-orange/30" },
  { name: "Squash Star", desc: "10 hrs of Squash", icon: Disc, check: (p) => (p.squash_hours || 0) >= 10, accent: "text-brand-green", ring: "ring-brand-green/30" },
  { name: "Pickleball Pro", desc: "10 hrs of Pickleball", icon: Circle, check: (p) => (p.pickleball_hours || 0) >= 10, accent: "text-brand-brown", ring: "ring-brand-brown/30" },
  { name: "All-Rounder", desc: "Play all 3 sports", icon: Star, check: (p) => (p.padel_hours || 0) > 0 && (p.squash_hours || 0) > 0 && (p.pickleball_hours || 0) > 0, accent: "text-brand-orange", ring: "ring-brand-orange/30" },
];

export default function Milestones() {
  const isMobile = useIsMobileApp();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(async (u) => {
      const profiles = await base44.entities.PlayerProfile.filter({ user_id: u.id });
      setProfile(profiles[0] || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  const earnedCount = BADGES.filter((b) => b.check(profile || {})).length;
  const pad = isMobile ? "px-4" : "max-w-4xl mx-auto px-8";

  const sports = [
    { name: "Padel", hours: profile?.padel_hours || 0 },
    { name: "Squash", hours: profile?.squash_hours || 0 },
    { name: "Pickleball", hours: profile?.pickleball_hours || 0 },
  ];
  const topSport = sports.reduce((a, b) => (a.hours > b.hours ? a : b), sports[0]);

  const records = [
    { label: "Total Sessions", value: profile?.total_sessions || 0, icon: Trophy, color: "text-brand-orange" },
    { label: "Total Hours", value: profile?.total_hours_played || 0, icon: Clock, color: "text-brand-green" },
    { label: "Current Streak", value: `${profile?.current_streak_weeks || 0}w`, icon: Flame, color: "text-brand-orange" },
    { label: "Longest Streak", value: `${profile?.longest_streak_weeks || 0}w`, icon: Rocket, color: "text-brand-green" },
    { label: "This Month", value: profile?.sessions_this_month || 0, icon: TrendingUp, color: "text-brand-orange" },
    { label: "Top Sport", value: topSport.hours > 0 ? topSport.name : "—", icon: Medal, color: "text-brand-green" },
  ];

  return (
    <div className="min-h-screen pb-8 overflow-x-hidden" style={{ background: "#FAFAFA" }}>
      {/* Hero */}
      <div className={`${isMobile ? "px-4" : "px-8"} pt-5`}>
        <div className="relative rounded-3xl px-5 md:px-8 py-6 md:py-8 overflow-hidden" style={frostedGradientGreen}>
          <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseOverlayDark} />
          <div className="relative z-10">
            <h1 className="font-heading text-4xl font-bold text-white">MY MILESTONES</h1>
            <p className="text-white/60 text-sm mt-1">Badges, streaks & personal records</p>
          </div>
        </div>
      </div>

      <div className={`${pad} py-5 space-y-5`}>
        {/* Streak + badges summary */}
        <div className="bg-brand-orange rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Flame size={26} className="text-white animate-streak-pulse" />
            </div>
            <div>
              <p className="text-white/70 text-xs font-semibold tracking-wide">CURRENT STREAK</p>
              <p className="font-stat text-4xl text-white leading-none">{profile?.current_streak_weeks || 0}</p>
              <p className="text-white/60 text-xs">weeks in a row</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-xs font-semibold tracking-wide mb-1">EARNED</p>
            <p className="font-stat text-3xl text-white leading-none">
              {earnedCount}
              <span className="text-white/50 text-lg">/{BADGES.length}</span>
            </p>
            <p className="text-white/60 text-xs">badges</p>
          </div>
        </div>

        {/* Personal records */}
        <div>
          <h2 className="font-heading text-lg font-bold text-brand-brown mb-3">PERSONAL RECORDS</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {records.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.label} className="bg-white rounded-2xl border border-border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={16} className={r.color} />
                    <span className="text-[10px] text-muted-foreground font-semibold tracking-wide">{r.label.toUpperCase()}</span>
                  </div>
                  <p className="font-stat text-2xl text-brand-brown">{r.value}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges grid */}
        <div>
          <h2 className="font-heading text-lg font-bold text-brand-brown mb-3">BADGES</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {BADGES.map((badge) => {
              const earned = badge.check(profile || {});
              const Icon = badge.icon;
              return (
                <div
                  key={badge.name}
                  className={`relative rounded-2xl p-3 flex flex-col items-center text-center transition-all ${
                    earned
                      ? `bg-white border border-border ring-2 ${badge.ring} shadow-sm`
                      : "bg-white/40 border border-border"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${earned ? "bg-muted" : "bg-muted/50"}`}>
                    <Icon size={22} className={earned ? badge.accent : "text-[#1a1a1a]/20"} />
                  </div>
                  <p className={`text-[11px] font-bold leading-tight ${earned ? "text-brand-brown" : "text-[#1a1a1a]/30"}`}>
                    {badge.name}
                  </p>
                  <p className={`text-[9px] leading-tight mt-0.5 ${earned ? "text-[#1a1a1a]/40" : "text-[#1a1a1a]/20"}`}>
                    {badge.desc}
                  </p>
                  {!earned && (
                    <div className="absolute top-2 right-2">
                      <Lock size={10} className="text-[#1a1a1a]/15" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivational empty state */}
        {earnedCount === 0 && (
          <div className="bg-brand-green rounded-2xl p-5 text-center">
            <p className="text-white font-heading text-lg font-bold">Your journey starts here</p>
            <p className="text-white/70 text-sm mt-1">Book your first session to start earning badges and building streaks.</p>
          </div>
        )}
      </div>
    </div>
  );
}