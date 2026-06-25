import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, CalendarDays, MapPin, Clock, Home, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import useIsMobileApp from "@/hooks/useIsMobileApp";
import TopNav from "@/components/TopNav";

const PLAYER_TABS = [
  { path: "/explore", label: "Explore" },
  { path: "/bookings", label: "Bookings" },
  { path: "/stats", label: "Stats" },
  { path: "/profile", label: "Profile" },
];

export default function BookingConfirmed() {
  const isMobile = useIsMobileApp();
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const paymentMode = searchParams.get("paymentMode");
  const isGuest = searchParams.get("guest") === "true";

  useEffect(() => {
    base44.entities.Booking.filter({ id: bookingId }).then(res => {
      setBooking(res[0]);
      setLoading(false);
    });
  }, [bookingId]);

  const Shell = ({ children }) => isMobile ? (
    <div className="min-h-screen flex items-start justify-center" style={{ background: "#F7F5F0" }}>
      <div className="w-full max-w-[430px] min-h-screen bg-brand-green shadow-2xl">
        {children}
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-brand-green">
      <TopNav items={PLAYER_TABS} showSignIn />
      {children}
    </div>
  );

  if (loading) return (
    <Shell>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    </Shell>
  );

  return (
    <Shell>
      <div className="flex flex-col items-center justify-center min-h-screen p-6">

        {/* Success card */}
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">

          {/* Top green band */}
          <div className="bg-brand-green px-6 pt-8 pb-6 text-center">
            <div className="w-20 h-20 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={44} className="text-white" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-white mb-1">BOOKING CONFIRMED!</h1>
            <p className="text-white/70 text-sm">Your court is reserved. See you out there!</p>
          </div>

          {/* Details */}
          <div className="px-6 py-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-brand-orange" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Venue</p>
                <p className="font-semibold text-brand-brown text-sm">{booking?.venue_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <CalendarDays size={16} className="text-brand-orange" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-semibold text-brand-brown text-sm">{booking?.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock size={16} className="text-brand-orange" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Time · Court</p>
                <p className="font-semibold text-brand-brown text-sm">{booking?.start_time} – {booking?.end_time} · {booking?.court_name}</p>
              </div>
            </div>

            {/* Reference */}
            <div className="bg-brand-cream rounded-2xl p-4 mt-2">
              <p className="text-xs text-muted-foreground mb-1 text-center">Booking reference</p>
              <p className="font-mono font-bold text-2xl text-brand-brown text-center tracking-widest">{booking?.reference_code}</p>
              {paymentMode === "pay_at_venue" && (
                <p className="text-xs text-muted-foreground text-center mt-2">Show this code when you arrive at the venue</p>
              )}
              {paymentMode === "in_app" && (
                <p className="text-xs text-brand-green font-semibold text-center mt-2">✓ Payment received</p>
              )}
            </div>

            {/* Price */}
            <div className="flex justify-between items-center pt-1">
              <span className="text-sm text-muted-foreground">{paymentMode === "in_app" ? "Amount paid" : "Amount due at venue"}</span>
              <span className="font-stat text-2xl text-brand-orange">฿{booking?.price}</span>
            </div>
          </div>

          {/* Guest sign-up nudge */}
          {isGuest && (
            <div className="px-6 pb-2">
              <div className="bg-brand-orange/10 border border-brand-orange/25 rounded-2xl p-4 flex gap-3 items-start">
                <Sparkles size={16} className="text-brand-orange flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-brand-brown">Save your bookings & earn perks</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <Link to="/register" className="text-brand-orange font-semibold underline underline-offset-2">Create a free account</Link> to track all your sessions, build a streak, and get exclusive member deals.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="px-6 pb-6 space-y-3">
            {isGuest ? (
              <Link
                to="/explore"
                className="w-full bg-brand-orange text-white py-3.5 rounded-xl font-bold font-heading tracking-wide hover:bg-brand-orange/90 transition-colors flex items-center justify-center gap-2"
              >
                <Home size={16} /> BACK TO EXPLORE
              </Link>
            ) : (
              <button
                onClick={() => navigate("/bookings")}
                className="w-full bg-brand-orange text-white py-3.5 rounded-xl font-bold font-heading tracking-wide hover:bg-brand-orange/90 transition-colors flex items-center justify-center gap-2"
              >
                <Home size={16} /> VIEW MY BOOKINGS
              </button>
            )}
            <button
              onClick={() => navigate("/explore")}
              className="w-full border-2 border-brand-brown/15 text-brand-brown py-3 rounded-xl font-semibold text-sm hover:border-brand-brown/30 transition-colors"
            >
              Book another court
            </button>
          </div>
        </div>

        <p className="text-white/40 text-xs mt-6 text-center">A confirmation has been sent to {booking?.player_email}</p>
      </div>
    </Shell>
  );
}