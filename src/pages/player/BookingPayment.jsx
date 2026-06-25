import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, CreditCard, Building2, Lock, ShieldCheck, Phone, User, Mail, Sparkles } from "lucide-react";
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

export default function BookingPayment() {
  const isMobile = useIsMobileApp();
  const { slotId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [slot, setSlot] = useState(null);
  const [court, setCourt] = useState(null);
  const [venue, setVenue] = useState(null);
  const [user, setUser] = useState(null); // null = guest
  const [paymentMode, setPaymentMode] = useState("pay_at_venue");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Guest contact info
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  // Card form state (UI only — Stripe to be wired in)
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");

  useEffect(() => {
    const venueId = searchParams.get("venue");
    const courtId = searchParams.get("court");
    // Try to get current user — guests will get null
    const getUser = async () => {
      try {
        const u = await base44.auth.me();
        return u;
      } catch {
        return null;
      }
    };
    Promise.all([
      base44.entities.TimeSlot.filter({ id: slotId }),
      base44.entities.Court.filter({ id: courtId }),
      base44.entities.Venue.filter({ id: venueId }),
      getUser(),
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

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, "").substring(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, "").substring(0, 4);
    if (digits.length >= 3) return digits.substring(0, 2) + " / " + digits.substring(2);
    return digits;
  };

  const isGuest = !user;
  const canSubmit = isGuest
    ? guestName.trim() && guestEmail.trim() && guestPhone.trim()
    : true;

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setProcessing(true);
    const ref = genRef();
    const playerName = isGuest ? guestName : (user.full_name || user.email);
    const playerEmail = isGuest ? guestEmail : user.email;
    const booking = await base44.entities.Booking.create({
      player_id: isGuest ? `guest_${ref}` : user.id,
      player_name: playerName,
      player_email: playerEmail,
      venue_id: venue.id,
      venue_name: venue.name,
      court_id: court.id,
      court_name: court.name,
      sport: court.sport,
      date: slot.date,
      start_time: slot.start_time,
      end_time: slot.end_time,
      duration_hours: 1,
      price: slot.price,
      payment_mode: paymentMode,
      payment_status: paymentMode === "in_app" ? "paid" : "pending",
      booking_status: "confirmed",
      reference_code: ref,
      slot_id: slot.id,
      session_logged: false,
    });
    await base44.entities.TimeSlot.update(slot.id, { status: "booked" });
    setProcessing(false);
    navigate(`/booking-confirmed/${booking.id}?paymentMode=${paymentMode}&guest=${isGuest}`);
  };

  const Shell = ({ children }) => isMobile ? (
    <div className="min-h-screen flex items-start justify-center" style={{ background: "#FAFAFA" }}>
      <div className="w-full max-w-[430px] min-h-screen shadow-2xl" style={{ background: "#FAFAFA" }}>
        {children}
      </div>
    </div>
  ) : (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>
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

  const canPayOnline = venue?.payment_mode === "in_app" || venue?.payment_mode === "both";
  const canPayAtVenue = venue?.payment_mode === "pay_at_venue" || venue?.payment_mode === "both";
  const isStripe = paymentMode === "in_app";

  return (
    <Shell>
      {/* Header */}
      <div className={`${isMobile ? "px-4" : "px-8"} pt-5`}>
        <div className="relative rounded-3xl px-5 md:px-8 py-5 md:py-6 overflow-hidden" style={frostedGradientBrown}>
          <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseOverlayDark} />
          <div className="relative z-10 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white">
              <ArrowLeft size={22} />
            </button>
            <div>
              <h1 className="font-heading text-3xl font-bold text-white leading-none">PAYMENT</h1>
              <p className="text-white/50 text-xs mt-0.5">Secure checkout</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
              <Lock size={12} className="text-white/60" />
              <span className="text-white/60 text-xs font-semibold">SSL secured</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`${isMobile ? "px-4 py-5" : "max-w-lg mx-auto px-8 py-8"} space-y-4`}>

        {/* Sign-up nudge for guests */}
        {isGuest && (
          <div className="bg-brand-orange/10 border border-brand-orange/25 rounded-2xl p-4 flex gap-3 items-start">
            <Sparkles size={18} className="text-brand-orange flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-brand-brown">Get member perks!</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                <Link to="/register" className="text-brand-orange font-semibold underline underline-offset-2">Create a free account</Link> to save your bookings, track your stats, and unlock exclusive deals.
              </p>
            </div>
          </div>
        )}

        {/* Order summary */}
        <div className="bg-white rounded-2xl border border-border p-4">
          <h2 className="font-heading text-base font-bold text-brand-brown mb-3">ORDER SUMMARY</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Venue</span><span className="font-semibold text-brand-brown">{venue?.name}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Court</span><span className="font-semibold text-brand-brown">{court?.name}</span></div>
            <div className="flex justify-between text-sm items-center"><span className="text-muted-foreground">Sport</span><SportBadge sport={court?.sport} /></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Date</span><span className="font-semibold text-brand-brown">{slot?.date}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Time</span><span className="font-semibold text-brand-brown">{slot?.start_time} – {slot?.end_time}</span></div>
            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="font-semibold text-brand-brown text-sm">Total due</span>
              <span className="font-stat text-3xl text-brand-orange">฿{slot?.price}</span>
            </div>
          </div>
        </div>

        {/* Guest contact form */}
        {isGuest && (
          <div className="bg-white rounded-2xl border border-border p-4 space-y-3">
            <h2 className="font-heading text-base font-bold text-brand-brown">YOUR DETAILS</h2>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Full name</label>
              <div className="relative">
                <input
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-border rounded-xl px-4 py-3 pl-10 text-sm font-body focus:outline-none focus:border-brand-orange text-brand-brown placeholder-muted-foreground"
                />
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Email address</label>
              <div className="relative">
                <input
                  value={guestEmail}
                  onChange={e => setGuestEmail(e.target.value)}
                  placeholder="your@email.com"
                  type="email"
                  className="w-full border border-border rounded-xl px-4 py-3 pl-10 text-sm font-body focus:outline-none focus:border-brand-orange text-brand-brown placeholder-muted-foreground"
                />
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Phone number <span className="text-brand-orange">*</span></label>
              <div className="relative">
                <input
                  value={guestPhone}
                  onChange={e => setGuestPhone(e.target.value)}
                  placeholder="+66 8X XXX XXXX"
                  type="tel"
                  className="w-full border border-border rounded-xl px-4 py-3 pl-10 text-sm font-body focus:outline-none focus:border-brand-orange text-brand-brown placeholder-muted-foreground"
                />
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Used to confirm your booking at the venue</p>
            </div>
          </div>
        )}

        {/* Payment method selector */}
        {(canPayOnline && canPayAtVenue) && (
          <div className="bg-white rounded-2xl border border-border p-4">
            <h2 className="font-heading text-base font-bold text-brand-brown mb-3">PAYMENT METHOD</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMode("in_app")}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMode === "in_app" ? "border-brand-orange bg-brand-orange/5" : "border-border hover:border-brand-orange/30"}`}
              >
                <CreditCard size={22} className={paymentMode === "in_app" ? "text-brand-orange" : "text-muted-foreground"} />
                <div className="text-center">
                  <p className={`text-xs font-bold ${paymentMode === "in_app" ? "text-brand-orange" : "text-brand-brown"}`}>Pay online</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Card · Stripe</p>
                </div>
              </button>
              <button
                onClick={() => setPaymentMode("pay_at_venue")}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMode === "pay_at_venue" ? "border-brand-orange bg-brand-orange/5" : "border-border hover:border-brand-orange/30"}`}
              >
                <Building2 size={22} className={paymentMode === "pay_at_venue" ? "text-brand-orange" : "text-muted-foreground"} />
                <div className="text-center">
                  <p className={`text-xs font-bold ${paymentMode === "pay_at_venue" ? "text-brand-orange" : "text-brand-brown"}`}>Pay at venue</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Cash · On arrival</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Stripe card form (UI only) */}
        {isStripe && (
          <div className="bg-white rounded-2xl border border-border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-base font-bold text-brand-brown">CARD DETAILS</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-5 bg-[#1A1F71] rounded text-white text-[8px] font-bold flex items-center justify-center">VISA</div>
                <div className="w-8 h-5 bg-[#EB001B] rounded-full scale-90 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute w-4 h-4 bg-[#F79E1B] rounded-full right-0.5" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Cardholder name</label>
              <input
                value={cardName}
                onChange={e => setCardName(e.target.value)}
                placeholder="Name on card"
                className="w-full border border-border rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-brand-orange text-brand-brown placeholder-muted-foreground"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Card number</label>
              <div className="relative">
                <input
                  value={cardNumber}
                  onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-brand-orange text-brand-brown placeholder-muted-foreground pr-12"
                />
                <CreditCard size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Expiry date</label>
                <input
                  value={cardExpiry}
                  onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                  placeholder="MM / YY"
                  maxLength={7}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-brand-orange text-brand-brown placeholder-muted-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">CVC</label>
                <input
                  value={cardCvc}
                  onChange={e => setCardCvc(e.target.value.replace(/\D/g, "").substring(0, 4))}
                  placeholder="•••"
                  maxLength={4}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-brand-orange text-brand-brown placeholder-muted-foreground"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 bg-brand-sky/60 rounded-xl p-3">
              <ShieldCheck size={14} className="text-brand-brown flex-shrink-0" />
              <p className="text-xs text-brand-brown/70">Your payment details are encrypted and processed securely via Stripe.</p>
            </div>
          </div>
        )}

        {/* Pay at venue note */}
        {!isStripe && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
            <Building2 size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Pay on arrival</p>
              <p className="text-xs text-amber-700 mt-0.5">Your slot will be reserved. Please present your booking reference at the venue when you arrive.</p>
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleConfirm}
          disabled={processing || !canSubmit}
          className="w-full bg-brand-orange text-white py-4 rounded-2xl font-bold text-lg font-heading tracking-wide disabled:opacity-60 hover:bg-brand-orange/90 transition-colors flex items-center justify-center gap-2"
        >
          {processing ? (
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
          ) : isStripe ? (
            <><Lock size={16} /> PAY ฿{slot?.price}</>
          ) : (
            "CONFIRM BOOKING"
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          By confirming you agree to Dibbers' booking terms. Cancellations must be made 24h in advance.
        </p>
      </div>
    </Shell>
  );
}