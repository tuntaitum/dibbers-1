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
        <img src="https://media.base44.com/images/public/6a2e6ee4a90a564f536f865d/9d835b838_260620_LogoDesign-Negative.png" alt="Dibbers" className="h-16 w-auto" />
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
              <div className="inline-flex items-center gap-2 bg-brand-orange/20 text-brand-orange px-3 py-1 rounded-full text-xs font-bold mb-5 tracking-wide">
                <Flame size={12} /> COMING SOON TO THAILAND
              </div>
              <h3 className="font-heading text-4xl font-bold text-white leading-tight mb-3">
                YOUR COURT.<br />YOUR STREAK.<br />YOUR GAME.
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                We're launching soon with courts across Bangkok and beyond. Be among the first players to discover, book, and track your sessions on Dibbers.
              </p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {sports.map(s => (
                  <div key={s.name} className="bg-white/10 rounded-2xl p-3 text-center">
                    <div className="text-2xl mb-1">{s.emoji}</div>
                    <div className="font-semibold text-xs">{s.name}</div>
                  </div>
                ))}
              </div>
              <Link to="/register" className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white py-3 rounded-xl font-bold text-sm hover:bg-brand-orange/90 transition-colors">
                Join the waitlist <ArrowRight size={15} />
              </Link>
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

      {/* Court Owners CTA */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="bg-brand-green rounded-3xl p-10 md:p-14 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-3 py-1.5 rounded-full text-xs font-semibold mb-5 tracking-wide">
              🏟️ FOR VENUE OWNERS
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              OWN A COURT?<br />LET'S TALK.
            </h2>
            <p className="text-white/70 text-base leading-relaxed">
              We're partnering with Padel, Squash, and Pickleball venues across Thailand. Get your courts in front of thousands of active players — manage bookings, set availability, and grow your community on Dibbers.
            </p>
          </div>
          <div className="bg-white/10 rounded-2xl p-8 text-center">
            <p className="text-white/80 text-sm mb-2">Ready to list your venue?</p>
            <p className="font-heading text-2xl font-bold text-white mb-1">Get in touch with us</p>
            <p className="text-white/60 text-sm mb-6">Our team will walk you through everything — no commitment required.</p>
            <a
              href="mailto:admin@dibbers.app"
              className="inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-brand-orange/90 transition-colors"
            >
              ✉️ admin@dibbers.app
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-brown text-white/40 text-center py-6 text-sm font-body">
        © 2026 Dibbers · Thailand's Court Sports Platform
      </footer>
    </div>
  );
}