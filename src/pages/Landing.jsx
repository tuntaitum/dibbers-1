import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, CalendarCheck, BarChart2, Flame } from "lucide-react";

const sports = [
  { name: "Padel", emoji: "🎾", desc: "Find courts across Bangkok & beyond" },
  { name: "Pickleball", emoji: "🏓", desc: "Thailand's fastest growing sport" },
  { name: "Squash", emoji: "🏸", desc: "Premium indoor courts near you" },
];

const features = [
  { icon: MapPin, title: "Discover", desc: "Browse courts near you, filter by sport, price, and availability in seconds." },
  { icon: CalendarCheck, title: "Book", desc: "Reserve any slot instantly. Pay in-app or at the venue — your choice." },
  { icon: BarChart2, title: "Track", desc: "Log every session, build weekly streaks, and watch your game hours grow." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-brand-cream font-body">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="font-heading text-3xl font-bold text-brand-brown tracking-wide">Dibbers</span>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-brand-brown font-medium text-sm hover:text-brand-orange transition-colors">Sign in</Link>
          <Link to="/register" className="bg-brand-orange text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-orange/90 transition-colors">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 text-brand-orange px-3 py-1.5 rounded-full text-xs font-semibold mb-5">
            <Flame size={13} /> Thailand's sports lifestyle platform
          </div>
          <h1 className="font-heading text-6xl md:text-7xl font-bold text-brand-brown leading-none mb-5">
            PLAY MORE.<br />
            <span className="text-brand-orange">TRACK IT.</span><br />
            BELONG.
          </h1>
          <p className="text-brand-brown/70 text-lg mb-8 leading-relaxed max-w-md">
            Discover and book Padel, Squash, and Pickleball courts across Thailand. Log your sessions, build streaks, and make every hour on court count.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link to="/register" className="bg-brand-orange text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-brand-orange/90 transition-all hover:gap-3">
              Start playing <ArrowRight size={16} />
            </Link>
            <Link to="/explore" className="border-2 border-brand-brown/20 text-brand-brown px-6 py-3 rounded-full font-semibold hover:border-brand-brown/40 transition-colors">
              Browse courts
            </Link>
          </div>
        </div>
        <div className="relative hidden md:block">
          <div className="bg-brand-green rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: "repeating-linear-gradient(45deg, #EA672D 0, #EA672D 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px"}} />
            <div className="relative z-10 text-white">
              <p className="font-heading text-5xl font-bold mb-1">2,847</p>
              <p className="text-white/60 text-sm mb-6">sessions booked this week</p>
              <div className="grid grid-cols-3 gap-3">
                {sports.map(s => (
                  <div key={s.name} className="bg-white/10 rounded-2xl p-3 text-center">
                    <div className="text-2xl mb-1">{s.emoji}</div>
                    <div className="font-semibold text-xs">{s.name}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-brand-orange/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Flame size={16} className="text-brand-orange" />
                  <span className="font-heading text-xl font-bold text-brand-orange">8 WEEKS</span>
                </div>
                <p className="text-white/60 text-xs">Your current playing streak</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sports */}
      <section className="bg-brand-brown py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-heading text-4xl font-bold text-white mb-2">SPORTS WE COVER</h2>
          <p className="text-white/60 mb-10">Every court, every sport, one platform.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {sports.map(s => (
              <div key={s.name} className="bg-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors">
                <div className="text-4xl mb-3">{s.emoji}</div>
                <h3 className="font-heading text-2xl font-bold text-white mb-1">{s.name.toUpperCase()}</h3>
                <p className="text-white/60 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="font-heading text-4xl font-bold text-brand-brown mb-2">HOW IT WORKS</h2>
        <p className="text-brand-brown/60 mb-12">From discovery to daily habit in three steps.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-border">
              <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center mb-4">
                <Icon size={20} className="text-brand-orange" />
              </div>
              <h3 className="font-heading text-xl font-bold text-brand-brown mb-2">{title.toUpperCase()}</h3>
              <p className="text-brand-brown/60 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-orange py-16 text-center">
        <h2 className="font-heading text-5xl font-bold text-white mb-3">READY TO PLAY?</h2>
        <p className="text-white/80 mb-8 text-lg">Join thousands of players across Thailand.</p>
        <Link to="/register" className="bg-white text-brand-orange px-8 py-3 rounded-full font-bold text-lg hover:bg-brand-cream transition-colors inline-flex items-center gap-2">
          Create your account <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-brand-brown text-white/40 text-center py-6 text-sm font-body">
        © 2026 Dibbers · Thailand's Court Sports Platform
      </footer>
    </div>
  );
}