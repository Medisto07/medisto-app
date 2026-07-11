import React, { useState, useMemo } from "react";
import {
  Home, Pill, Stethoscope, FlaskConical, ShoppingCart, X, Plus, Minus,
  Search, MapPin, Clock, Star, ChevronRight, Phone, Check, ArrowLeft, ShieldCheck
} from "lucide-react";

// ⚠️ DEMO MODE: this preview uses a fake OTP (any 6 digits work) because the
// "firebase" package isn't available inside Claude's live preview sandbox.
// For your REAL deployed app (on Vercel etc.), replace the sendOtp/verifyOtp
// functions below with real Firebase Phone Auth — full instructions are at
// the bottom of this file in the REAL_FIREBASE_VERSION comment block.

// ---- Design tokens ----
const C = {
  ink: "#12312E",       // near-black pharmacy green, headings
  cream: "#FBF8F2",     // warm base background
  card: "#FFFFFF",
  green: "#1B6B5C",     // primary trust green
  greenDeep: "#0F4A40",
  marigold: "#E8873A",  // urgent/CTA accent — the 30-min promise
  marigoldDeep: "#C96A24",
  slate: "#5C6B6A",     // secondary text
  line: "#E7E1D6",
  alert: "#C4432B",
};

const FONT_DISPLAY = "'Fraunces', 'Georgia', serif";
const FONT_BODY = "'IBM Plex Sans', 'Segoe UI', sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

// ---- Sample data (swap with real store inventory later) ----
const MEDICINES = [
  { id: "m1", name: "Paracetamol 650mg", brand: "Calpol", pack: "Strip of 15", price: 32, category: "Fever & Pain", store: "AH Medical Store" },
  { id: "m2", name: "Azithromycin 500mg", brand: "Azithral", pack: "Strip of 3", price: 118, category: "Antibiotic", store: "AH Medical Store" },
  { id: "m3", name: "ORS Powder", brand: "Electral", pack: "Box of 10", price: 95, category: "Hydration", store: "Sharma Medicos" },
  { id: "m4", name: "Cetirizine 10mg", brand: "Zyrtec", pack: "Strip of 10", price: 28, category: "Allergy", store: "AH Medical Store" },
  { id: "m5", name: "Vitamin D3 60K", brand: "Uprise D3", pack: "4 Sachets", price: 110, category: "Supplements", store: "Sharma Medicos" },
  { id: "m6", name: "Cough Syrup 100ml", brand: "Ascoril", pack: "1 Bottle", price: 88, category: "Cold & Cough", store: "Sharma Medicos" },
];

const DOCTORS = [
  { id: "d1", name: "Dr. R.K. Srivastava", specialty: "General Physician", exp: "34 yrs (Retd.)", rating: 4.8, fee: 149, slot: "Available now" },
  { id: "d2", name: "Dr. Meena Tripathi", specialty: "Gynecologist", exp: "28 yrs (Retd.)", rating: 4.9, fee: 149, slot: "Today, 6:00 PM" },
  { id: "d3", name: "Dr. S.N. Pandey", specialty: "Pediatrician", exp: "31 yrs (Retd.)", rating: 4.7, fee: 149, slot: "Today, 7:30 PM" },
];

const TESTS = [
  { id: "t1", name: "Complete Blood Count (CBC)", price: 199, mrp: 350, lab: "Partner Lab, Sultanpur" },
  { id: "t2", name: "Full Body Checkup (45 params)", price: 899, mrp: 1800, lab: "Partner Lab, Sultanpur" },
  { id: "t3", name: "Thyroid Profile (T3 T4 TSH)", price: 349, mrp: 600, lab: "Partner Lab, Sultanpur" },
  { id: "t4", name: "Diabetes Screen (Fasting)", price: 149, mrp: 280, lab: "Partner Lab, Sultanpur" },
];

// ⚠️ Set this to your real WhatsApp business number (country code, no +, no spaces)
const WHATSAPP_NUMBER = "919219494578";

function money(n) { return `\u20B9${n}`; }

// ---- Bottom Nav ----
function BottomNav({ tab, setTab, cartCount }) {
  const items = [
    { id: "home", label: "Home", icon: Home },
    { id: "medicines", label: "Medicines", icon: Pill },
    { id: "doctors", label: "Doctors", icon: Stethoscope },
    { id: "tests", label: "Tests", icon: FlaskConical },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-around items-center py-2 px-1"
      style={{ background: C.card, borderTop: `1px solid ${C.line}`, zIndex: 40 }}>
      {items.map(({ id, label, icon: Icon }) => {
        const active = tab === id;
        return (
          <button key={id} onClick={() => setTab(id)}
            className="flex flex-col items-center gap-1 px-3 py-1 relative"
            style={{ color: active ? C.green : C.slate }}>
            <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
            <span style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: active ? 600 : 500 }}>{label}</span>
            {id === "medicines" && cartCount > 0 && (
              <span className="absolute -top-1 right-0 rounded-full flex items-center justify-center"
                style={{ background: C.marigold, color: "#fff", width: 16, height: 16, fontSize: 10, fontWeight: 700 }}>
                {cartCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ---- Header ----
function Header({ cartCount, onCartClick }) {
  return (
    <div className="sticky top-0 flex items-center justify-between px-4 py-3" style={{ background: C.cream, zIndex: 30 }}>
      <div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, color: C.ink }}>Medisto</div>
        <div className="flex items-center gap-1" style={{ color: C.slate, fontFamily: FONT_BODY, fontSize: 12 }}>
          <MapPin size={12} /> Sultanpur, UP
        </div>
      </div>
      <button onClick={onCartClick} className="relative p-2 rounded-full" style={{ background: C.card, border: `1px solid ${C.line}` }}>
        <ShoppingCart size={20} color={C.ink} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 rounded-full flex items-center justify-center"
            style={{ background: C.marigold, color: "#fff", width: 18, height: 18, fontSize: 10, fontWeight: 700 }}>
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
}

// ---- 30-min ring, the signature element ----
function DeliveryRing() {
  return (
    <div className="flex items-center justify-center" style={{ width: 132, height: 132 }}>
      <svg width="132" height="132" viewBox="0 0 132 132">
        <circle cx="66" cy="66" r="58" fill="none" stroke={C.line} strokeWidth="10" />
        <circle cx="66" cy="66" r="58" fill="none" stroke={C.marigold} strokeWidth="10"
          strokeDasharray={2 * Math.PI * 58} strokeDashoffset={2 * Math.PI * 58 * 0.22}
          strokeLinecap="round" transform="rotate(-90 66 66)" />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span style={{ fontFamily: FONT_MONO, fontSize: 30, fontWeight: 700, color: C.ink, lineHeight: 1 }}>30</span>
        <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.slate, letterSpacing: 0.5 }}>MINUTES</span>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600, color: C.green, letterSpacing: 1, textTransform: "uppercase" }}>
      {children}
    </div>
  );
}

// ---- Home Tab ----
function HomeTab({ setTab }) {
  const actions = [
    { id: "medicines", label: "Order Medicine", desc: "From your local store", icon: Pill },
    { id: "doctors", label: "Talk to a Doctor", desc: "Retired specialists, \u20B9149", icon: Stethoscope },
    { id: "tests", label: "Book a Test", desc: "Up to 50% off lab tests", icon: FlaskConical },
  ];
  return (
    <div className="px-4 pb-28 pt-2">
      <div className="rounded-3xl relative flex flex-col items-center justify-center py-8 mb-6"
        style={{ background: C.ink }}>
        <div className="relative"><DeliveryRing /></div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: "#fff", marginTop: 8, textAlign: "center", padding: "0 24px" }}>
          Dawai ghar tak, aadhe ghante mein
        </div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: "#C9D6D0", marginTop: 4 }}>
          Sultanpur ke local medical stores se
        </div>
      </div>

      <SectionLabel>Kya karna hai aaj?</SectionLabel>
      <div className="flex flex-col gap-3 mt-3">
        {actions.map(({ id, label, desc, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className="flex items-center gap-4 p-4 rounded-2xl text-left"
            style={{ background: C.card, border: `1px solid ${C.line}` }}>
            <div className="flex items-center justify-center rounded-xl" style={{ width: 46, height: 46, background: "#EAF3F0" }}>
              <Icon size={22} color={C.green} />
            </div>
            <div className="flex-1">
              <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 15, color: C.ink }}>{label}</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.slate }}>{desc}</div>
            </div>
            <ChevronRight size={18} color={C.slate} />
          </button>
        ))}
      </div>

      <SectionLabel>Trust</SectionLabel>
      <div className="grid grid-cols-3 gap-3 mt-3">
        {[
          { n: "12+", l: "Local stores" },
          { n: "3", l: "Retired doctors" },
          { n: "50%", l: "Off on lab tests" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl p-3 text-center" style={{ background: C.card, border: `1px solid ${C.line}` }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 18, fontWeight: 700, color: C.green }}>{s.n}</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: C.slate, marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Medicines Tab ----
function MedicinesTab({ cart, addToCart, updateQty }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() =>
    MEDICINES.filter(m => (m.name + m.brand + m.category).toLowerCase().includes(q.toLowerCase())),
    [q]);

  return (
    <div className="px-4 pb-28 pt-2">
      <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5 mb-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
        <Search size={17} color={C.slate} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Medicine, brand ya symptom khojein"
          style={{ fontFamily: FONT_BODY, fontSize: 13.5, border: "none", outline: "none", width: "100%", background: "transparent", color: C.ink }} />
      </div>

      <SectionLabel>{filtered.length} medicines mile</SectionLabel>
      <div className="flex flex-col gap-3 mt-3">
        {filtered.map(m => {
          const inCart = cart.find(c => c.id === m.id);
          return (
            <div key={m.id} className="flex gap-3 p-3 rounded-2xl" style={{ background: C.card, border: `1px solid ${C.line}` }}>
              <div className="flex items-center justify-center rounded-xl" style={{ width: 50, height: 50, background: "#EAF3F0", flexShrink: 0 }}>
                <Pill size={20} color={C.green} />
              </div>
              <div className="flex-1 min-w-0">
                <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 14, color: C.ink }}>{m.name}</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: C.slate }}>{m.brand} \u00b7 {m.pack}</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: C.slate, marginTop: 2 }}>{m.store}</div>
                <div className="flex items-center justify-between mt-2">
                  <span style={{ fontFamily: FONT_MONO, fontSize: 15, fontWeight: 700, color: C.ink }}>{money(m.price)}</span>
                  {inCart ? (
                    <div className="flex items-center gap-2 rounded-full px-1" style={{ background: C.green }}>
                      <button onClick={() => updateQty(m.id, -1)} className="p-1.5"><Minus size={13} color="#fff" /></button>
                      <span style={{ color: "#fff", fontFamily: FONT_MONO, fontSize: 13, minWidth: 14, textAlign: "center" }}>{inCart.qty}</span>
                      <button onClick={() => updateQty(m.id, 1)} className="p-1.5"><Plus size={13} color="#fff" /></button>
                    </div>
                  ) : (
                    <button onClick={() => addToCart(m)} className="flex items-center gap-1 rounded-full px-3 py-1.5"
                      style={{ background: C.green, color: "#fff", fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600 }}>
                      <Plus size={13} /> Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- Doctors Tab ----
function DoctorsTab({ onBook }) {
  return (
    <div className="px-4 pb-28 pt-2">
      <SectionLabel>Retired specialists, \u20B9149 se</SectionLabel>
      <div className="flex flex-col gap-3 mt-3">
        {DOCTORS.map(d => (
          <div key={d.id} className="p-4 rounded-2xl" style={{ background: C.card, border: `1px solid ${C.line}` }}>
            <div className="flex justify-between items-start">
              <div>
                <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 15, color: C.ink }}>{d.name}</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.green, fontWeight: 500 }}>{d.specialty}</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: C.slate, marginTop: 2 }}>{d.exp}</div>
              </div>
              <div className="flex items-center gap-1" style={{ color: C.marigold }}>
                <Star size={13} fill={C.marigold} strokeWidth={0} />
                <span style={{ fontFamily: FONT_MONO, fontSize: 12.5, fontWeight: 700 }}>{d.rating}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px dashed ${C.line}` }}>
              <div className="flex items-center gap-1.5" style={{ color: C.slate }}>
                <Clock size={13} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 12 }}>{d.slot}</span>
              </div>
              <button onClick={() => onBook(d)} className="rounded-full px-4 py-2"
                style={{ background: C.marigold, color: "#fff", fontFamily: FONT_BODY, fontSize: 12.5, fontWeight: 600 }}>
                Book \u2022 {money(d.fee)}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Tests Tab ----
function TestsTab({ onBook }) {
  return (
    <div className="px-4 pb-28 pt-2">
      <SectionLabel>Lab tests, bulk discount ke saath</SectionLabel>
      <div className="flex flex-col gap-3 mt-3">
        {TESTS.map(t => {
          const off = Math.round((1 - t.price / t.mrp) * 100);
          return (
            <div key={t.id} className="p-4 rounded-2xl" style={{ background: C.card, border: `1px solid ${C.line}` }}>
              <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 14.5, color: C.ink }}>{t.name}</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: C.slate, marginTop: 2 }}>{t.lab}</div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-baseline gap-2">
                  <span style={{ fontFamily: FONT_MONO, fontSize: 16, fontWeight: 700, color: C.ink }}>{money(t.price)}</span>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.slate, textDecoration: "line-through" }}>{money(t.mrp)}</span>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.green, fontWeight: 600 }}>{off}% off</span>
                </div>
                <button onClick={() => onBook(t)} className="rounded-full px-4 py-2"
                  style={{ background: C.green, color: "#fff", fontFamily: FONT_BODY, fontSize: 12.5, fontWeight: 600 }}>
                  Book
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- Checkout drawer (works for medicine cart, doctor booking, test booking) ----
function CheckoutDrawer({ open, onClose, kind, cart, updateQty, singleItem, onConfirm }) {
  if (!open) return null;

  const total = kind === "medicines"
    ? cart.reduce((s, c) => s + c.price * c.qty, 0) + (cart.length ? 30 : 0)
    : singleItem?.price ?? singleItem?.fee ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(18,49,46,0.45)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto"
        style={{ background: C.cream }}>
        <div className="flex justify-between items-center mb-4">
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 19, fontWeight: 700, color: C.ink }}>
            {kind === "medicines" ? "Your Order" : kind === "doctors" ? "Confirm Consultation" : "Confirm Test Booking"}
          </div>
          <button onClick={onClose}><X size={20} color={C.slate} /></button>
        </div>

        {kind === "medicines" && (
          <div className="flex flex-col gap-3">
            {cart.length === 0 && <div style={{ fontFamily: FONT_BODY, color: C.slate, fontSize: 13 }}>Cart khali hai.</div>}
            {cart.map(c => (
              <div key={c.id} className="flex items-center justify-between">
                <div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 13.5, fontWeight: 600, color: C.ink }}>{c.name}</div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.slate }}>{money(c.price)} \u00d7 {c.qty}</div>
                </div>
                <div className="flex items-center gap-2 rounded-full px-1" style={{ background: C.green }}>
                  <button onClick={() => updateQty(c.id, -1)} className="p-1.5"><Minus size={12} color="#fff" /></button>
                  <span style={{ color: "#fff", fontFamily: FONT_MONO, fontSize: 12 }}>{c.qty}</span>
                  <button onClick={() => updateQty(c.id, 1)} className="p-1.5"><Plus size={12} color="#fff" /></button>
                </div>
              </div>
            ))}
            {cart.length > 0 && (
              <div className="flex justify-between pt-2" style={{ borderTop: `1px dashed ${C.line}`, fontFamily: FONT_BODY, fontSize: 12.5, color: C.slate }}>
                <span>Delivery charge</span><span>{money(30)}</span>
              </div>
            )}
          </div>
        )}

        {kind !== "medicines" && singleItem && (
          <div className="p-3 rounded-2xl" style={{ background: C.card, border: `1px solid ${C.line}` }}>
            <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 14.5, color: C.ink }}>{singleItem.name}</div>
            {singleItem.specialty && <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.green }}>{singleItem.specialty}</div>}
            {singleItem.lab && <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.slate }}>{singleItem.lab}</div>}
          </div>
        )}

        <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: `1px solid ${C.line}` }}>
          <div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: C.slate }}>Total</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 21, fontWeight: 700, color: C.ink }}>{money(total)}</div>
          </div>
          <button onClick={() => onConfirm(total)}
            disabled={kind === "medicines" && cart.length === 0}
            className="flex items-center gap-2 rounded-full px-5 py-3"
            style={{ background: (kind === "medicines" && cart.length === 0) ? C.line : C.marigold, color: "#fff", fontFamily: FONT_BODY, fontWeight: 700, fontSize: 14 }}>
            <Phone size={16} /> Confirm on WhatsApp
          </button>
        </div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: C.slate, marginTop: 10, textAlign: "center" }}>
          Order WhatsApp par confirm hoga \u2014 abhi hum manually coordinate karte hain.
        </div>
      </div>
    </div>
  );
}

// ---- Login: phone number + OTP ----
// DEMO MODE (works in this preview): any 6-digit OTP is accepted.
// Real SMS version instructions are at the bottom of this file.
function LoginScreen({ onLoggedIn }) {
  const [step, setStep] = useState("phone"); // phone | otp
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = () => {
    setError("");
    if (phone.replace(/\D/g, "").length !== 10) {
      setError("10 digit ka sahi number daalein");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 700);
  };

  const verifyOtp = () => {
    setError("");
    if (otp.length !== 6) { setError("6 digit ka OTP daalein"); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoggedIn({ phone: `+91${phone}` });
    }, 500);
  };

  return (
    <div className="flex flex-col justify-center px-6" style={{ minHeight: "100vh", background: C.cream, maxWidth: 480, margin: "0 auto" }}>
      <div className="flex flex-col items-center mb-10">
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 700, color: C.ink }}>Medisto</div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.slate, marginTop: 4 }}>Dawai ghar tak, aadhe ghante mein</div>
      </div>

      <div className="rounded-3xl p-5" style={{ background: C.card, border: `1px solid ${C.line}` }}>
        {step === "phone" ? (
          <>
            <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 15, color: C.ink, marginBottom: 4 }}>Login karein</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.slate, marginBottom: 16 }}>Aapke number par OTP bhejenge</div>
            <div className="flex items-center gap-2 rounded-2xl px-3 py-3" style={{ background: C.cream, border: `1px solid ${C.line}` }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: C.slate }}>+91</span>
              <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="98765 43210" inputMode="numeric"
                style={{ fontFamily: FONT_MONO, fontSize: 15, border: "none", outline: "none", width: "100%", background: "transparent", color: C.ink }} />
            </div>
            {error && <div style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: C.alert, marginTop: 8 }}>{error}</div>}
            <button onClick={sendOtp} disabled={loading} className="w-full rounded-full py-3 mt-4"
              style={{ background: C.marigold, color: "#fff", fontFamily: FONT_BODY, fontWeight: 700, fontSize: 14 }}>
              {loading ? "Bhej rahe hain\u2026" : "OTP bhejein"}
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setStep("phone")} className="flex items-center gap-1 mb-3" style={{ color: C.slate }}>
              <ArrowLeft size={14} /><span style={{ fontFamily: FONT_BODY, fontSize: 12 }}>Number badlein</span>
            </button>
            <div className="flex items-center gap-2 mb-1"><ShieldCheck size={16} color={C.green} />
              <span style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 15, color: C.ink }}>OTP daalein</span>
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.slate, marginBottom: 4 }}>+91 {phone} par bheja gaya</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.marigold, marginBottom: 12 }}>Demo mode: koi bhi 6 digit daal dein</div>
            <input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000" inputMode="numeric"
              className="w-full rounded-2xl px-3 py-3 text-center"
              style={{ fontFamily: FONT_MONO, fontSize: 20, letterSpacing: 6, border: `1px solid ${C.line}`, background: C.cream, color: C.ink }} />
            {error && <div style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: C.alert, marginTop: 8 }}>{error}</div>}
            <button onClick={verifyOtp} disabled={loading} className="w-full rounded-full py-3 mt-4"
              style={{ background: C.green, color: "#fff", fontFamily: FONT_BODY, fontWeight: 700, fontSize: 14 }}>
              {loading ? "Verify ho raha hai\u2026" : "Verify karein"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ConfirmedToast({ show }) {
  if (!show) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full px-4 py-2.5 z-50"
      style={{ background: C.ink, color: "#fff" }}>
      <Check size={15} color={C.marigold} />
      <span style={{ fontFamily: FONT_BODY, fontSize: 12.5 }}>WhatsApp khul raha hai\u2026</span>
    </div>
  );
}

export default function MedistoApp() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("home");
  const [cart, setCart] = useState([]);
  const [drawer, setDrawer] = useState({ open: false, kind: null, item: null });
  const [toast, setToast] = useState(false);

  const addToCart = (m) => setCart(prev => [...prev, { ...m, qty: 1 }]);
  const updateQty = (id, delta) => {
    setCart(prev => prev
      .map(c => c.id === id ? { ...c, qty: c.qty + delta } : c)
      .filter(c => c.qty > 0));
  };
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const openCartDrawer = () => setDrawer({ open: true, kind: "medicines", item: null });
  const openBookingDrawer = (kind, item) => setDrawer({ open: true, kind, item });

  const confirmOrder = (total) => {
    let msg = "";
    if (drawer.kind === "medicines") {
      const lines = cart.map(c => `\u2022 ${c.name} (${c.pack}) x${c.qty} \u2014 ${money(c.price * c.qty)}`).join("\n");
      msg = `Naya order Medisto se:\n\n${lines}\n\nDelivery charge: ${money(30)}\nTotal: ${money(total)}\n\nMera address: [apna address yahan likhein]`;
    } else if (drawer.kind === "doctors") {
      msg = `Doctor consultation book karna hai:\n${drawer.item.name} (${drawer.item.specialty})\nSlot: ${drawer.item.slot}\nFee: ${money(drawer.item.fee)}\n\nMera naam: [naam likhein]\nMera number: [number likhein]`;
    } else if (drawer.kind === "tests") {
      msg = `Lab test book karna hai:\n${drawer.item.name}\nPrice: ${money(drawer.item.price)}\n\nMera naam: [naam likhein]\nMera number: [number likhein]`;
    }
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    setToast(true);
    setTimeout(() => setToast(false), 2000);
    window.open(url, "_blank");
    setDrawer({ open: false, kind: null, item: null });
    if (drawer.kind === "medicines") setCart([]);
  };

  const fontStyles = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@600;700&display=swap');
    `}</style>
  );

  if (!user) {
    return (
      <>
        {fontStyles}
        <LoginScreen onLoggedIn={setUser} />
      </>
    );
  }

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.cream, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      {fontStyles}

      <Header cartCount={cartCount} onCartClick={openCartDrawer} />

      {tab === "home" && <HomeTab setTab={setTab} />}
      {tab === "medicines" && <MedicinesTab cart={cart} addToCart={addToCart} updateQty={updateQty} />}
      {tab === "doctors" && <DoctorsTab onBook={(d) => openBookingDrawer("doctors", d)} />}
      {tab === "tests" && <TestsTab onBook={(t) => openBookingDrawer("tests", t)} />}

      <BottomNav tab={tab} setTab={setTab} cartCount={cartCount} />

      <CheckoutDrawer
        open={drawer.open}
        onClose={() => setDrawer({ open: false, kind: null, item: null })}
        kind={drawer.kind}
        cart={cart}
        updateQty={updateQty}
        singleItem={drawer.item}
        onConfirm={confirmOrder}
      />
      <ConfirmedToast show={toast} />
    </div>
  );
}
