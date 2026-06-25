import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, CheckCircle2, CreditCard, Building2 } from "lucide-react";
import SportBadge from "@/components/SportBadge";
import useIsMobileApp from "@/hooks/useIsMobileApp";
import TopNav from "@/components/TopNav";
import { frostedGradientBrown, noiseOverlayDark } from "@/lib/portalDesign";

const PLAYER_TABS = [
  { path: "/explore", label: "Explore" },
  { path: "/bookings", label: "Bookings" },
  { path: "/stats", label: "Stats" },
  { path: "/profile", label: "Profile" },
];

function genRef() {
  return "DBB" + Math.random().toString(36).toUpperCase().substring(2, 8);
}

export default function BookingConfirm() {
  const isMobile = useIsMobileApp();
  const { slotId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [slot, setSlot] = useState(null);
  const [court, setCourt] = useState(null);
  const [venue, setVenue] = useState(null);
  const [user, setUser] = useState(null);
  const [paymentMode, setPaymentMode] = useState("pay_at_venue");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const venueId = searchParams.get("venue");
    const courtId = searchParams.get("court");
    Promise.all([
      base44.entities.TimeSlot.filter({ id: slotId }),
      base44.entities.Court.filter({ id: courtId }),
      base44.entities.Venue.filter({ id: venueId }),
      base44.auth.me(),
    ]).then(([slots, courts, venues, u]) => {
      setSlot(slots[0]);
      setCourt(courts[0]);
      const v = venues[0];
      setVenue(v);
      setUser(u);
      if (v?.payment_mode === "in_app") setPaymentMode("in_app");
      else if (v?.payment_mode === "pay_at_venue") setPaymentMode("pay_at_venue");
      else setPaymentMode("pay_at_venue");
      setLoading(false);
    });
  }, [slotId, searchParams]);

  const confirmBooking = async () => {
    setConfirming(true);
    const duration = 1;
    const ref = genRef();
    const newBooking = await base44.entities.Booking.create({
      player_id: user.id,
      player_name: user.full_name || user.email,
      player_email: user.email,
      venue_id: venue.id,
      venue_name: venue.name,
      court_id: court.id,
      court_name: court.name,
      sport: court.sport,
      date: slot.date,
      start_time: slot.start_time,
      end_time: slot.end_time,
      duration_hours: duration,
      price: slot.price,
      payment_mode: paymentMode,
      payment_status: paymentMode === "in_app" ? "paid" : "pending",
      booking_status: "confirmed",
      reference_code: ref,
      slot_id: slot.id,
      session_logged: false,
    });
    await base44.entities.TimeSlot.update(slot.id, { status: "booked" });
    setBooking(newBooking);
    setConfirming(false);
  };

  const Shell = ({ children, bg }) => isMobile ? (
    <div className="min-h-screen flex items-start justify-center overflow-x-hidden" style={{ background: "#FAFAFA" }}>
      <div className={`w-full max-w-[430px] min-h-screen shadow-2xl overflow-x-hidden ${bg || ""}`} style={!bg ? { background: "#FAFAFA" } : undefined}>
        {children}
      </div>
    </div>
  ) : (
    <div className={`min-h-screen ${bg || ""}`} style={!bg ? { background: "#FAFAFA" } : undefined}>
      <TopNav items={PLAYER_TABS} showSignIn />
      {children}
    </div>
  );

  if (loading) return (
    <Shell>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
      </div>
    </Shell>
  );

  if (booking) return (
    <Shell bg="bg-brand-green">
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-xl animate-fade-in">
          <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={36} className="text-brand-green" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-brand-brown mb-1">BOOKING CONFIRMED!</h1>
          <p className="text-muted-foreground text-sm mb-6">Your slot is reserved. See you on court!</p>
          <div className="bg-brand-cream rounded-2xl p-4 mb-5 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Venue</span>
              <span className="font-semibold text-brand-brown">{venue.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Court</span>
              <span className="font-semibold text-brand-brown">{court.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="font-semibold text-brand-brown">{slot.date}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time</span>
              <span className="font-semibold text-brand-brown">{slot.start_time} – {slot.end_time}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price</span>
              <span className="font-stat text-lg text-brand-orange">฿{slot.price}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Reference</span>
              <span className="font-mono font-bold text-brand-brown tracking-wider">{booking.reference_code}</span>
            </div>
          </div>
          {paymentMode === "pay_at_venue" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-700">
              Please present this reference code at the venue to confirm your payment.
            </div>
          )}
          <button
            onClick={() => navigate("/bookings")}
            className="w-full bg-brand-orange text-white py-3 rounded-xl font-semibold"
          >
            View my bookings
          </button>
        </div>
      </div>
    </Shell>
  );

  return (
    <Shell>
      <div className={`${isMobile ? "px-4" : "px-8"} pt-5`}>
        <div className="relative rounded-3xl px-5 md:px-8 py-5 md:py-6 overflow-hidden" style={frostedGradientBrown}>
          <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseOverlayDark} />
          <div className="relative z-10 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white">
              <ArrowLeft size={22} />
            </button>
            <h1 className="font-heading text-3xl font-bold text-white">CONFIRM BOOKING</h1>
          </div>
        </div>
      </div>

      <div className={`${isMobile ? "px-4 py-5" : "max-w-lg mx-auto px-8 py-8"} space-y-4`}>
        {/* Summary */}
        <div className="bg-white rounded-2xl border border-border p-4">
          <h2 className="font-heading text-lg font-bold text-brand-brown mb-3">BOOKING SUMMARY</h2>
          <div className="space-y-2.5">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Venue</span><span className="font-semibold text-brand-brown">{venue?.name}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Court</span><span className="font-semibold text-brand-brown">{court?.name}</span></div>
            <div className="flex justify-between text-sm items-center"><span className="text-muted-foreground">Sport</span><SportBadge sport={court?.sport} /></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Date</span><span className="font-semibold text-brand-brown">{slot?.date}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Time</span><span className="font-semibold text-brand-brown">{slot?.start_time} – {slot?.end_time}</span></div>
            <div className="border-t border-border pt-2.5 flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Total</span>
              <span className="font-stat text-2xl text-brand-orange">฿{slot?.price}</span>
            </div>
          </div>
        </div>

        {/* Payment mode */}
        {venue?.payment_mode === "both" && (
          <div className="bg-white rounded-2xl border border-border p-4">
            <h2 className="font-heading text-lg font-bold text-brand-brown mb-3">PAYMENT METHOD</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMode("in_app")}
                className={`p-3 rounded-xl border-2 transition-all ${paymentMode === "in_app" ? "border-brand-orange bg-brand-orange/5" : "border-border"}`}
              >
                <CreditCard size={20} className={paymentMode === "in_app" ? "text-brand-orange mx-auto" : "text-muted-foreground mx-auto"} />
                <p className="text-xs font-semibold text-center mt-1.5 text-brand-brown">Pay now</p>
              </button>
              <button
                onClick={() => setPaymentMode("pay_at_venue")}
                className={`p-3 rounded-xl border-2 transition-all ${paymentMode === "pay_at_venue" ? "border-brand-orange bg-brand-orange/5" : "border-border"}`}
              >
                <Building2 size={20} className={paymentMode === "pay_at_venue" ? "text-brand-orange mx-auto" : "text-muted-foreground mx-auto"} />
                <p className="text-xs font-semibold text-center mt-1.5 text-brand-brown">Pay at venue</p>
              </button>
            </div>
          </div>
        )}

        <button
          onClick={confirmBooking}
          disabled={confirming}
          className="w-full bg-brand-orange text-white py-4 rounded-2xl font-bold text-lg font-heading tracking-wide disabled:opacity-60 hover:bg-brand-orange/90 transition-colors"
        >
          {confirming ? "Confirming..." : "CONFIRM BOOKING"}
        </button>
      </div>
    </Shell>
  );
}