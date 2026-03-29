import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatWidget from "./ChatWidget";
import AdminPanel from "./AdminPanel";

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  ka: {
    nav: { home: "მთავარი", cottages: "კოტეჯები", services: "სერვისები", booking: "დაჯავშნა", contact: "კონტაქტი" },
    hero: { tag: "ციხისძირი, შავი ზღვა", title1: "სიმშვიდე", title2: "ბუნებაში", sub: "ისიამოვნეთ შავი ზღვის სანაპიროზე, მწვანე ბუნების გულში — ჩვენი კოტეჯები თქვენი სრული დასვენებისთვის.", btn1: "კოტეჯების ნახვა", btn2: "დაჯავშნა" },
    stats: [["3", "კოტეჯი"], ["500მ", "ზღვამდე"], ["100%", "კმაყოფილება"]],
    cottagesTitle: "კოტეჯები და ფასები", cottagesSub: "აირჩიეთ თქვენთვის სასურველი კოტეჯი",
    cottages: [
      { name: "ზღვის კოტეჯი", guests: 4, beds: 2, size: "65 მ²", price: 180, desc: "პირდაპირ ზღვის სანაპიროზე, ტერასით და პანორამული ხედით.", features: ["WiFi", "კლიმატი", "ბარბექიუ", "პარკინგი"] },
      { name: "ტყის კოტეჯი", guests: 6, beds: 3, size: "90 მ²", price: 240, desc: "მწვანე ტყის პირას, სრული სიჩუმე და ბუნებრივი გარემო.", features: ["WiFi", "კლიმატი", "ბარბექიუ", "ჰამაკი"] },
      { name: "ოჯახური კოტეჯი", guests: 8, beds: 4, size: "120 მ²", price: 320, desc: "დიდი ოჯახებისთვის — ფართო ეზო, საბავშვო ადგილი.", features: ["WiFi", "კლიმატი", "ბარბექიუ", "საბავშვო"] },
    ],
    servicesTitle: "სერვისები", servicesSub: "ყველაფერი რაც გჭირდებათ დასვენებისთვის",
    services: [
      { icon: "🌊", title: "ზღვის სანაპირო", desc: "500 მეტრი კოტეჯებიდან — სუფთა ქვიშიანი სანაპირო." },
      { icon: "🔥", title: "ბარბექიუ", desc: "ყველა კოტეჯს აქვს ბარბექიუ ზონა." },
      { icon: "🌿", title: "ბუნებრივი გარემო", desc: "მწვანე ბაღი და სიჩუმე ბუნებაში." },
      { icon: "🚗", title: "პარკინგი", desc: "უფასო, დაცული პარკინგი ადგილზე." },
      { icon: "📶", title: "სწრაფი WiFi", desc: "სწრაფი ინტერნეტი ყველა კოტეჯში." },
      { icon: "🧹", title: "დალაგება", desc: "ყოველდღიური დასუფთავება მოთხოვნით." },
    ],
    contactTitle: "კონტაქტი", contactSub: "გვიკავშირდით ნებისმიერ დროს",
    contact: [
      { icon: "📞", label: "ტელეფონი", val: "+995 595 772 088" },
      { icon: "📧", label: "ელ-ფოსტა", val: "info@tsikhisdziri.ge" },
      { icon: "📍", label: "მისამართი", val: "ციხისძირი, აჭარა, საქართველო" },
      { icon: "🕐", label: "სამუშაო საათები", val: "ყოველდღე 09:00 – 22:00" },
    ],
    footer: "© 2025 ციხისძირი კოტეჯები. ყველა უფლება დაცულია.",
    book: "დაჯავშნა",
    nights: "ღამე", guests: "სტუმარი", bedrooms: "საძინებელი",
    modal: {
      step1: "დეტალები", step2: "გადახდა",
      title1: "დაჯავშნის დეტალები", title2: "გადახდის მეთოდი",
      name: "სახელი გვარი *", phone: "ტელეფონი *", email: "ელ-ფოსტა *",
      checkin: "ჩამოსვლა *", checkout: "გამოსვლა *", guestsLabel: "სტუმრების რაოდენობა",
      note: "შენიშვნა (სურვილისამებრ)",
      subtotal: "ღამის ღირებულება", fee: "სერვის გადასახადი (5%)", total: "სულ გადასახდელი",
      nextBtn: "გადახდაზე გადასვლა →", backBtn: "← უკან",
      payBtn: "-ით გადახდა", chooseMethod: "აირჩიეთ მეთოდი",
      processing: "დამუშავება...", processingDesc: "ამოწმებს გადახდას",
      successTitle: "დაჯავშნა დასრულდა!", successDesc: "წარმატებით დაიჯავშნა.\nდადასტურება გაიგზავნება",
      successDesc2: "-ზე.", detailsTitle: "დაჯავშნის დეტალები",
      cottage: "კოტეჯი", guest: "სტუმარი", arrival: "ჩამოსვლა", departure: "გამოსვლა",
      nightsCount: "ღამეები", payment: "გადახდა", paid: "გადახდილი",
      closeBtn: "დახურვა ✓", security: "გადახდა დაცულია SSL დაშიფვრით. თქვენი ბარათის მონაცემები არ ინახება ჩვენს სისტემაში.",
      errName: "სახელი სავალდებულოა", errPhone: "ტელეფონი სავალდებულოა", errEmail: "ელ-ფოსტა სავალდებულოა", errDates: "გამოსვლა უნდა იყოს ჩამოსვლის შემდეგ",
    },
  },
  en: {
    nav: { home: "Home", cottages: "Cottages", services: "Services", booking: "Booking", contact: "Contact" },
    hero: { tag: "Tsikhisdziri, Black Sea", title1: "Peace &", title2: "Nature", sub: "Enjoy the Black Sea coast in the heart of lush nature — our cottages are your perfect retreat.", btn1: "View Cottages", btn2: "Book Now" },
    stats: [["3", "Cottages"], ["500m", "to Sea"], ["100%", "Satisfaction"]],
    cottagesTitle: "Cottages & Prices", cottagesSub: "Choose your perfect cottage",
    cottages: [
      { name: "Sea Cottage", guests: 4, beds: 2, size: "65 m²", price: 180, desc: "Right on the seafront with a terrace and panoramic sea views.", features: ["WiFi", "AC", "BBQ", "Parking"] },
      { name: "Forest Cottage", guests: 6, beds: 3, size: "90 m²", price: 240, desc: "On the edge of a green forest — complete silence and nature.", features: ["WiFi", "AC", "BBQ", "Hammock"] },
      { name: "Family Cottage", guests: 8, beds: 4, size: "120 m²", price: 320, desc: "Perfect for large families — spacious yard, children's play area.", features: ["WiFi", "AC", "BBQ", "Playground"] },
    ],
    servicesTitle: "Services", servicesSub: "Everything you need for a perfect stay",
    services: [
      { icon: "🌊", title: "Beach Access", desc: "500 meters from cottages — clean sandy beach." },
      { icon: "🔥", title: "BBQ Zone", desc: "Every cottage has its own BBQ area." },
      { icon: "🌿", title: "Nature", desc: "Green garden and peaceful natural surroundings." },
      { icon: "🚗", title: "Parking", desc: "Free, secure on-site parking." },
      { icon: "📶", title: "Fast WiFi", desc: "High-speed internet in all cottages." },
      { icon: "🧹", title: "Cleaning", desc: "Daily cleaning service on request." },
    ],
    contactTitle: "Contact", contactSub: "Reach us any time",
    contact: [
      { icon: "📞", label: "Phone", val: "+995 595 772 088" },
      { icon: "📧", label: "Email", val: "info@tsikhisdziri.ge" },
      { icon: "📍", label: "Address", val: "Tsikhisdziri, Adjara, Georgia" },
      { icon: "🕐", label: "Working Hours", val: "Daily 09:00 – 22:00" },
    ],
    footer: "© 2025 Tsikhisdziri Cottages. All rights reserved.",
    book: "Book Now",
    nights: "night", guests: "guests", bedrooms: "bedrooms",
    modal: {
      step1: "Details", step2: "Payment",
      title1: "Booking Details", title2: "Payment Method",
      name: "Full Name *", phone: "Phone *", email: "Email *",
      checkin: "Check-in *", checkout: "Check-out *", guestsLabel: "Number of guests",
      note: "Notes (optional)",
      subtotal: "Nightly rate", fee: "Service fee (5%)", total: "Total",
      nextBtn: "Proceed to Payment →", backBtn: "← Back",
      payBtn: " Pay ", chooseMethod: "Choose a method",
      processing: "Processing...", processingDesc: "verifying payment",
      successTitle: "Booking Complete!", successDesc: "was successfully booked.\nConfirmation will be sent to",
      successDesc2: ".", detailsTitle: "Booking Details",
      cottage: "Cottage", guest: "Guest", arrival: "Check-in", departure: "Check-out",
      nightsCount: "Nights", payment: "Payment", paid: "Paid",
      closeBtn: "Close ✓", security: "Payment is secured with SSL encryption. Your card details are not stored in our system.",
      errName: "Name is required", errPhone: "Phone is required", errEmail: "Email is required", errDates: "Check-out must be after check-in",
    },
  },
};

const IMGS = {
  hero: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1600&q=80",
  c1: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
  c2: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
  c3: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  n1: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  n2: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80",
};

const PAYMENT_METHODS = [
  { id: "bog", name: "BOG Pay", color: "#D4202C", short: "BOG" },
  { id: "tbc", name: "TBC Pay", color: "#00A3E0", short: "TBC" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function daysBetween(a, b) {
  if (!a || !b) return 0;
  return Math.max(0, Math.floor((new Date(b) - new Date(a)) / 86400000));
}
function formatDate(str, lang) {
  if (!str) return "";
  return new Date(str).toLocaleDateString(lang === "ka" ? "ka-GE" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
}
function today() { return new Date().toISOString().split("T")[0]; }
function addDays(str, n) { const d = new Date(str); d.setDate(d.getDate() + n); return d.toISOString().split("T")[0]; }

const iSt = (err) => ({
  width: "100%",
  background: err ? "rgba(192,57,43,0.04)" : "#FAFAF7",
  border: `1px solid ${err ? "rgba(192,57,43,0.4)" : "rgba(139,105,20,0.18)"}`,
  borderRadius: 10, padding: "12px 14px", fontSize: 14,
  color: "#1A1408", fontFamily: "inherit", transition: "border-color 0.2s",
});

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/*" element={<MainSite />} />
      </Routes>
    </BrowserRouter>
  );
}

function MainSite() {
  const [lang, setLang] = useState("ka");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [modalCottage, setModalCottage] = useState(null);
  const [toast, setToast] = useState(null);
  const t = T[lang];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 5000);
  };

  return (
    <div style={{ fontFamily: "'Crimson Pro', Georgia, serif", background: "#FAFAF7", color: "#2C2416", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;500;600;700&family=Unbounded:wght@600;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        ::selection{background:#8B6914;color:#fff;}
        input,textarea,select{font-family:inherit;}
        input:focus,textarea:focus,select:focus{outline:2px solid #8B6914;outline-offset:2px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(44px) scale(.97)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
        @keyframes toast{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        .cimg{transition:transform .5s;}
        .ccard:hover .cimg{transform:scale(1.06);}
        .bookbtn{transition:all .22s;}
        .bookbtn:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(139,105,20,.35)!important;}
        .navbtn:hover{color:#2C2416!important;background:rgba(139,105,20,.07)!important;}
        .svccard{transition:all .25s;}
        .svccard:hover{transform:translateY(-4px);box-shadow:0 8px 28px rgba(44,36,22,.1)!important;}
        .payopt{transition:all .2s;cursor:pointer;}
        @media(max-width:768px){
          .navlinks{display:none!important;}
          .burger{display:flex!important;}
          .herotitle{font-size:52px!important;}
          .herocontent{padding:96px 22px 56px!important;}
          .statsrow{gap:22px!important;flex-wrap:wrap;}
          .cgrid{grid-template-columns:1fr!important;}
          .sgrid{grid-template-columns:1fr 1fr!important;}
          .frow{grid-template-columns:1fr!important;}
          .ctgrid{grid-template-columns:1fr 1fr!important;}
          .spad{padding:60px 22px!important;}
          .ftrinner{flex-direction:column!important;gap:12px!important;text-align:center;}
          .modalpad{padding:18px 18px 24px!important;}
        }
        @media(max-width:480px){
          .sgrid{grid-template-columns:1fr!important;}
          .ctgrid{grid-template-columns:1fr!important;}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? "rgba(250,250,247,.96)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(139,105,20,.1)" : "none",
        padding: "0 48px", height: 70,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all .35s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ fontSize: 20 }}>🏡</span>
          <span style={{ fontFamily: "'Unbounded',sans-serif", fontWeight: 700, fontSize: 14, color: scrolled ? "#2C2416" : "#fff", transition: "color .3s", letterSpacing: "-.5px" }}>ციხისძირი</span>
        </div>

        <div className="navlinks" style={{ display: "flex", gap: 2 }}>
          {Object.entries(t.nav).map(([k, v]) => (
            <button key={k} className="navbtn" onClick={() => scrollTo(k)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: scrolled ? "rgba(44,36,22,.65)" : "rgba(255,255,255,.85)",
              fontSize: 14, fontWeight: 500, padding: "8px 15px",
              borderRadius: 8, transition: "all .2s", fontFamily: "inherit",
            }}>{v}</button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setLang(lang === "ka" ? "en" : "ka")} style={{
            background: scrolled ? "rgba(139,105,20,.08)" : "rgba(255,255,255,.15)",
            border: `1px solid ${scrolled ? "rgba(139,105,20,.2)" : "rgba(255,255,255,.3)"}`,
            color: scrolled ? "#8B6914" : "#fff",
            padding: "5px 13px", borderRadius: 20, cursor: "pointer",
            fontSize: 12, fontWeight: 700, transition: "all .3s", fontFamily: "inherit",
          }}>{lang === "ka" ? "EN" : "ქა"}</button>

          <button className="burger" onClick={() => setMenuOpen(!menuOpen)} style={{
            display: "none", background: "none", border: "none",
            cursor: "pointer", flexDirection: "column", gap: 5, padding: 6,
          }}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: "block", width: 22, height: 2,
                background: scrolled ? "#2C2416" : "#fff", borderRadius: 2, transition: "all .3s",
                transform: menuOpen && i===0 ? "rotate(45deg) translate(5px,5px)" : menuOpen && i===2 ? "rotate(-45deg) translate(5px,-5px)" : "none",
                opacity: menuOpen && i===1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{
          position: "fixed", top: 70, left: 0, right: 0, zIndex: 199,
          background: "rgba(250,250,247,.98)", backdropFilter: "blur(20px)",
          padding: "14px 24px 22px", borderBottom: "1px solid rgba(139,105,20,.08)",
        }}>
          {Object.entries(t.nav).map(([k, v]) => (
            <button key={k} onClick={() => scrollTo(k)} style={{
              display: "block", width: "100%", background: "none", border: "none",
              textAlign: "left", padding: "13px 0", fontSize: 18, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit", color: "#2C2416",
              borderBottom: "1px solid rgba(139,105,20,.07)",
            }}>{v}</button>
          ))}
        </div>
      )}

      {/* ── HERO ── */}
      <section id="home" style={{ position: "relative", height: "100vh", minHeight: 600, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${IMGS.hero})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(155deg,rgba(18,28,8,.68) 0%,rgba(28,18,8,.52) 50%,rgba(139,105,20,.28) 100%)" }} />

        <div style={{
          position: "absolute", top: "17%", right: "7%",
          background: "rgba(255,255,255,.12)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,.2)", borderRadius: 16,
          padding: "12px 20px", color: "#fff", fontSize: 13, fontWeight: 500,
          textAlign: "center", animation: "float 4s ease-in-out infinite",
        }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>⭐</div>
          <div>4.9 / 5.0</div>
          <div style={{ opacity: .7, fontSize: 11 }}>200+ {lang === "ka" ? "შეფასება" : "reviews"}</div>
        </div>

        <div className="herocontent" style={{
          position: "relative", zIndex: 1, padding: "0 48px",
          height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "center", maxWidth: 780,
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,.12)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,.25)", color: "#fff",
            padding: "7px 18px", borderRadius: 100, fontSize: 13,
            fontWeight: 500, marginBottom: 28, width: "fit-content",
            animation: "fadeUp .7s .1s both",
          }}>📍 {t.hero.tag}</div>

          <h1 className="herotitle" style={{
            fontFamily: "'Unbounded',sans-serif",
            fontSize: "clamp(48px,7.5vw,90px)",
            fontWeight: 900, lineHeight: 1, color: "#fff",
            letterSpacing: "-2.5px", marginBottom: 22,
            animation: "fadeUp .7s .2s both",
          }}>
            {t.hero.title1}<br />
            <span style={{ color: "#D4A942" }}>{t.hero.title2}</span>
          </h1>

          <p style={{
            color: "rgba(255,255,255,.78)", fontSize: 18, lineHeight: 1.7,
            maxWidth: 500, marginBottom: 34, animation: "fadeUp .7s .3s both",
          }}>{t.hero.sub}</p>

          <div style={{ display: "flex", gap: 13, flexWrap: "wrap", marginBottom: 52, animation: "fadeUp .7s .4s both" }}>
            <button onClick={() => scrollTo("cottages")} style={{
              background: "linear-gradient(135deg,#8B6914,#D4A942)",
              border: "none", color: "#fff", padding: "15px 32px",
              borderRadius: 12, fontSize: 15, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>{t.hero.btn1}</button>
            <button onClick={() => scrollTo("booking")} style={{
              background: "rgba(255,255,255,.12)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,.3)", color: "#fff",
              padding: "15px 32px", borderRadius: 12, fontSize: 15,
              fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>{t.hero.btn2}</button>
          </div>

          <div className="statsrow" style={{ display: "flex", gap: 40, animation: "fadeUp .7s .5s both" }}>
            {t.stats.map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 32, fontWeight: 900, color: "#D4A942", letterSpacing: "-1px" }}>{n}</div>
                <div style={{ color: "rgba(255,255,255,.55)", fontSize: 13, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          color: "rgba(255,255,255,.35)", fontSize: 10, letterSpacing: 3, textTransform: "uppercase",
        }}>
          <div style={{ width: 1, height: 38, background: "linear-gradient(to bottom,transparent,rgba(255,255,255,.3))" }} />
          scroll
        </div>
      </section>

      {/* ── NATURE STRIP ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: 260, overflow: "hidden" }}>
        {[IMGS.n1, IMGS.n2].map((img, i) => (
          <div key={i} style={{ backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(44,36,22,.22)" }} />
          </div>
        ))}
      </div>

      {/* ── COTTAGES ── */}
      <CottagesSection t={t} lang={lang} onBook={setModalCottage} />

      {/* ── SERVICES ── */}
      <ServicesSection t={t} />

      {/* ── CONTACT ── */}
      <ContactSection t={t} />

      {/* ── FOOTER ── */}
      <footer style={{ background: "#1A1408", color: "rgba(255,255,255,.45)", padding: "26px 48px" }}>
        <div className="ftrinner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 17 }}>🏡</span>
            <span style={{ fontFamily: "'Unbounded',sans-serif", fontWeight: 700, fontSize: 13, color: "#D4A942" }}>ციხისძირი</span>
          </div>
          <span style={{ fontSize: 12 }}>{t.footer}</span>
          <div style={{ display: "flex", gap: 12 }}>
            {["📘","📸","▶️"].map((ic,i) => (
              <button key={i} style={{ background: "rgba(255,255,255,.06)", border: "none", borderRadius: 8, width: 34, height: 34, cursor: "pointer", fontSize: 14 }}>{ic}</button>
            ))}
          </div>
        </div>
      </footer>

      {/* ── BOOKING MODAL ── */}
      {modalCottage && (
        <BookingModal
          cottage={modalCottage}
          t={t}
          lang={lang}
          onClose={() => setModalCottage(null)}
          onSuccess={(msg) => { setModalCottage(null); showToast(msg); }}
        />
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 30, left: "50%", transform: "translateX(-50%)",
          background: "#1A3A1A", color: "#fff", padding: "13px 26px",
          borderRadius: 14, fontSize: 14, fontWeight: 500, zIndex: 9999,
          boxShadow: "0 8px 32px rgba(0,0,0,.28)", animation: "toast .4s both",
          display: "flex", alignItems: "center", gap: 10, maxWidth: "90vw",
        }}>
          <span style={{ fontSize: 18 }}>✅</span> {toast}
        </div>
      )}
      {/* ── CHAT ── */}
      <ChatWidget />
    </div>
  );
}

// ─── COTTAGES SECTION ─────────────────────────────────────────────────────────
function CottagesSection({ t, lang, onBook }) {
  const [ref, inView] = useInView();
  const imgs = [IMGS.c1, IMGS.c2, IMGS.c3];

  return (
    <section id="cottages" className="spad" style={{ padding: "96px 48px", background: "#FAFAF7" }}>
      <div ref={ref} style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ color: "#8B6914", fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 }}>✦ {t.cottagesSub}</div>
          <h2 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: "clamp(26px,4vw,46px)", fontWeight: 900, letterSpacing: "-1.5px" }}>{t.cottagesTitle}</h2>
        </div>
        <div className="cgrid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 26 }}>
          {t.cottages.map((c, i) => (
            <div key={i} className="ccard" style={{
              background: "#fff", borderRadius: 20, overflow: "hidden",
              boxShadow: "0 4px 22px rgba(44,36,22,.07)",
              border: "1px solid rgba(139,105,20,.08)",
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(38px)",
              transition: `all .7s cubic-bezier(.4,0,.2,1) ${i*.15}s`,
              display: "flex", flexDirection: "column",
            }}>
              <div style={{ height: 215, overflow: "hidden", position: "relative" }}>
                <img className="cimg" src={imgs[i]} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{
                  position: "absolute", top: 14, right: 14,
                  background: "rgba(20,12,4,.74)", backdropFilter: "blur(6px)",
                  color: "#D4A942", padding: "5px 13px", borderRadius: 100,
                  fontFamily: "'Unbounded',sans-serif", fontSize: 13, fontWeight: 700,
                }}>{c.price}₾<span style={{ color: "rgba(255,255,255,.45)", fontWeight: 400, fontSize: 11 }}>/{t.nights}</span></div>
              </div>
              <div style={{ padding: "22px 22px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: "-.5px", marginBottom: 10 }}>{c.name}</h3>
                <div style={{ display: "flex", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
                  {[["👥", `${c.guests} ${t.guests}`], ["🛏", `${c.beds} ${t.bedrooms}`], ["📐", c.size]].map(([ic, v]) => (
                    <span key={v} style={{ fontSize: 12, color: "#6B5A3A", display: "flex", alignItems: "center", gap: 4 }}>{ic} {v}</span>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: "#6B5A3A", lineHeight: 1.6, marginBottom: 14 }}>{c.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 18 }}>
                  {c.features.map(f => (
                    <span key={f} style={{ background: "rgba(139,105,20,.07)", color: "#7A5C1E", border: "1px solid rgba(139,105,20,.13)", padding: "3px 10px", borderRadius: 100, fontSize: 12 }}>{f}</span>
                  ))}
                </div>
                <button className="bookbtn" onClick={() => onBook({ ...c, img: imgs[i] })} style={{
                  marginTop: "auto",
                  background: "linear-gradient(135deg,#8B6914,#D4A942)",
                  border: "none", color: "#fff", padding: "13px",
                  borderRadius: 10, fontSize: 14, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                  boxShadow: "0 4px 14px rgba(139,105,20,.2)",
                }}>{t.book} →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES SECTION ─────────────────────────────────────────────────────────
function ServicesSection({ t }) {
  const [ref, inView] = useInView();
  return (
    <section id="services" className="spad" style={{ padding: "96px 48px", background: "#F3F0E7" }}>
      <div ref={ref} style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ color: "#8B6914", fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 }}>✦ {t.servicesSub}</div>
          <h2 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: "clamp(26px,4vw,46px)", fontWeight: 900, letterSpacing: "-1.5px" }}>{t.servicesTitle}</h2>
        </div>
        <div className="sgrid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          {t.services.map((s, i) => (
            <div key={i} className="svccard" style={{
              background: "#fff", borderRadius: 16, padding: "26px 22px",
              border: "1px solid rgba(139,105,20,.09)",
              boxShadow: "0 2px 12px rgba(44,36,22,.05)",
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(28px)",
              transition: `all .6s cubic-bezier(.4,0,.2,1) ${i*.08}s`,
            }}>
              <div style={{ width: 50, height: 50, background: "rgba(139,105,20,.08)", borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14 }}>{s.icon}</div>
              <h3 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 7, letterSpacing: "-.3px" }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: "#6B5A3A", lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT SECTION ─────────────────────────────────────────────────────────
function ContactSection({ t }) {
  const [ref, inView] = useInView();
  return (
    <section id="contact" className="spad" style={{ padding: "96px 48px", background: "#FAFAF7" }}>
      <div ref={ref} style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ color: "#8B6914", fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 }}>✦ {t.contactSub}</div>
          <h2 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: "clamp(26px,4vw,46px)", fontWeight: 900, letterSpacing: "-1.5px" }}>{t.contactTitle}</h2>
        </div>
        <div className="ctgrid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
          {t.contact.map((c, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 16, padding: "26px 20px",
              border: "1px solid rgba(139,105,20,.09)", textAlign: "center",
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(22px)",
              transition: `all .6s cubic-bezier(.4,0,.2,1) ${i*.1}s`,
            }}>
              <div style={{ fontSize: 26, marginBottom: 10 }}>{c.icon}</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#8B6914", marginBottom: 7 }}>{c.label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#2C2416", lineHeight: 1.5 }}>{c.val}</div>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 36, borderRadius: 20, height: 300,
          overflow: "hidden", border: "1px solid rgba(139,105,20,.14)",
        }}>
          <iframe
            title="ციხისძირი კოტეჯები"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src="https://www.google.com/maps?q=41.7551,41.7677&z=16&output=embed"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

// ─── BOOKING MODAL ────────────────────────────────────────────────────────────
function BookingModal({ cottage, t, lang, onClose, onSuccess }) {
  const m = t.modal;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", email: "", checkin: addDays(today(), 1), checkout: addDays(today(), 3), guests: "2", note: "" });
  const [payMethod, setPayMethod] = useState(null);
  const [errors, setErrors] = useState({});

  const nights = daysBetween(form.checkin, form.checkout);
  const subtotal = nights * cottage.price;
  const fee = Math.round(subtotal * 0.05);
  const total = subtotal + fee;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = m.errName;
    if (!form.phone.trim()) e.phone = m.errPhone;
    if (!form.email.trim()) e.email = m.errEmail;
    if (nights < 1) e.dates = m.errDates;
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handlePay = () => {
    if (!payMethod) return;
    setStep(3);
    setTimeout(() => setStep(4), 2800);
  };

  const handleDone = () => onSuccess(`${cottage.name} ${lang === "ka" ? "წარმატებით დაიჯავშნა!" : "successfully booked!"}`);

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(18,12,4,.62)", backdropFilter: "blur(7px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16, animation: "fadeIn .3s both",
    }}>
      <div style={{
        background: "#fff", borderRadius: 24, width: "100%", maxWidth: 540,
        maxHeight: "92vh", overflowY: "auto",
        boxShadow: "0 24px 80px rgba(0,0,0,.28)",
        animation: "slideUp .4s cubic-bezier(.4,0,.2,1) both",
        position: "relative",
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16,
          background: "rgba(44,36,22,.07)", border: "none",
          width: 32, height: 32, borderRadius: "50%",
          cursor: "pointer", fontSize: 15, zIndex: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>✕</button>

        <div className="modalpad" style={{ padding: "22px 28px 28px" }}>

          {/* Step indicator */}
          {step < 4 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              {[m.step1, m.step2].map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: step > i+1 ? "#8B6914" : step === i+1 ? "#D4A942" : "rgba(139,105,20,.1)",
                    color: step >= i+1 ? "#fff" : "#8B6914",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, transition: "all .3s",
                  }}>{step > i+1 ? "✓" : i+1}</div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: step === i+1 ? "#1A1408" : "#A08050" }}>{s}</span>
                  {i === 0 && <div style={{ width: 28, height: 1, background: "rgba(139,105,20,.18)" }} />}
                </div>
              ))}
            </div>
          )}

          {/* Cottage mini card */}
          {step < 4 && (
            <div style={{
              display: "flex", gap: 13, alignItems: "center",
              background: "#F7F4EE", borderRadius: 14, padding: "13px",
              marginBottom: 20, border: "1px solid rgba(139,105,20,.1)",
            }}>
              <img src={cottage.img} alt={cottage.name} style={{ width: 66, height: 52, borderRadius: 10, objectFit: "cover" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 13, fontWeight: 700 }}>{cottage.name}</div>
                <div style={{ fontSize: 12, color: "#6B5A3A", marginTop: 3 }}>📍 ციხისძირი, აჭარა</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 14, fontWeight: 700, color: "#8B6914" }}>{cottage.price}₾</div>
                <div style={{ fontSize: 10, color: "#A08050" }}>/{t.nights}</div>
              </div>
            </div>
          )}

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div style={{ animation: "fadeUp .4s both" }}>
              <h2 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 17, fontWeight: 800, letterSpacing: "-.5px", marginBottom: 18 }}>{m.title1}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                <Fld label={m.name} err={errors.name}>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={iSt(errors.name)} placeholder={lang === "ka" ? "მაგ: გიორგი ბერიძე" : "e.g. John Smith"} />
                </Fld>
                <div className="frow" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Fld label={m.phone} err={errors.phone}>
                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={iSt(errors.phone)} placeholder="+995 5XX XXX XXX" />
                  </Fld>
                  <Fld label={m.email} err={errors.email}>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={iSt(errors.email)} placeholder="email@gmail.com" />
                  </Fld>
                </div>
                <div className="frow" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Fld label={m.checkin} err={errors.dates}>
                    <input type="date" value={form.checkin} min={today()} onChange={e => setForm({...form, checkin: e.target.value})} style={iSt()} />
                  </Fld>
                  <Fld label={m.checkout}>
                    <input type="date" value={form.checkout} min={addDays(form.checkin, 1)} onChange={e => setForm({...form, checkout: e.target.value})} style={iSt()} />
                  </Fld>
                </div>
                <Fld label={m.guestsLabel}>
                  <select value={form.guests} onChange={e => setForm({...form, guests: e.target.value})} style={iSt()}>
                    {Array.from({length: cottage.guests}, (_, i) => i+1).map(n => (
                      <option key={n} value={n}>{n} {t.guests}</option>
                    ))}
                  </select>
                </Fld>
                <Fld label={m.note}>
                  <textarea rows={3} value={form.note} onChange={e => setForm({...form, note: e.target.value})} style={{ ...iSt(), resize: "vertical" }} />
                </Fld>
              </div>

              {nights > 0 && (
                <div style={{ background: "#F7F4EE", borderRadius: 14, padding: "15px", marginTop: 18, border: "1px solid rgba(139,105,20,.1)" }}>
                  <div style={{ fontSize: 12, color: "#6B5A3A", fontWeight: 600, marginBottom: 9 }}>💰 {lang === "ka" ? "ღირებულება" : "Price"}</div>
                  {[[`${cottage.price}₾ × ${nights} ${t.nights}`, `${subtotal}₾`], [`${m.fee}`, `${fee}₾`]].map(([l, v]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5, color: "#6B5A3A" }}>
                      <span>{l}</span><span>{v}</span>
                    </div>
                  ))}
                  <div style={{ height: 1, background: "rgba(139,105,20,.14)", margin: "9px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Unbounded',sans-serif", fontSize: 14, fontWeight: 700, color: "#1A1408" }}>
                    <span>{m.total}</span><span style={{ color: "#8B6914" }}>{total}₾</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#A08050", marginTop: 5, textAlign: "center" }}>{formatDate(form.checkin, lang)} — {formatDate(form.checkout, lang)}</div>
                </div>
              )}

              <button onClick={() => validate() && setStep(2)} style={{
                width: "100%", marginTop: 18,
                background: "linear-gradient(135deg,#8B6914,#D4A942)",
                border: "none", color: "#fff", padding: "14px",
                borderRadius: 12, fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
              }}>{m.nextBtn}</button>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div style={{ animation: "fadeUp .4s both" }}>
              <h2 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 17, fontWeight: 800, letterSpacing: "-.5px", marginBottom: 18 }}>{m.title2}</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 20 }}>
                {PAYMENT_METHODS.map(pm => (
                  <div key={pm.id} className="payopt" onClick={() => setPayMethod(pm.id)} style={{
                    display: "flex", alignItems: "center", gap: 15,
                    padding: "15px 16px", borderRadius: 14,
                    border: `2px solid ${payMethod === pm.id ? pm.color : "rgba(139,105,20,.12)"}`,
                    background: payMethod === pm.id ? `${pm.color}09` : "#FAFAF7",
                  }}>
                    <div style={{
                      width: 50, height: 36, borderRadius: 8,
                      background: pm.color, display: "flex",
                      alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ color: "#fff", fontFamily: "'Unbounded',sans-serif", fontWeight: 900, fontSize: 11 }}>{pm.short}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{pm.name}</div>
                      <div style={{ fontSize: 12, color: "#6B5A3A" }}>{pm.id === "bog" ? "Bank of Georgia" : "TBC Bank"}</div>
                    </div>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%",
                      border: `2px solid ${payMethod === pm.id ? pm.color : "rgba(139,105,20,.25)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {payMethod === pm.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: pm.color }} />}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "rgba(16,100,40,.06)", borderRadius: 10, padding: "11px 13px", border: "1px solid rgba(16,100,40,.12)", marginBottom: 18 }}>
                <span style={{ fontSize: 15 }}>🔒</span>
                <p style={{ fontSize: 12, color: "#2A5A20", lineHeight: 1.5 }}>{m.security}</p>
              </div>

              <div style={{ background: "#F7F4EE", borderRadius: 12, padding: "13px 15px", marginBottom: 18, border: "1px solid rgba(139,105,20,.1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6B5A3A", marginBottom: 3 }}>
                  <span>{cottage.name}</span><span>{nights} {t.nights}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Unbounded',sans-serif", fontSize: 15, fontWeight: 800, color: "#1A1408" }}>
                  <span>{m.total}</span><span style={{ color: "#8B6914" }}>{total}₾</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 9 }}>
                <button onClick={() => setStep(1)} style={{
                  background: "none", border: "1px solid rgba(139,105,20,.2)",
                  color: "#6B5A3A", padding: "13px 18px", borderRadius: 12,
                  fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}>{m.backBtn}</button>
                <button onClick={handlePay} disabled={!payMethod} style={{
                  flex: 1,
                  background: !payMethod ? "rgba(139,105,20,.22)"
                    : payMethod === "bog" ? "linear-gradient(135deg,#B01824,#D4202C)"
                    : "linear-gradient(135deg,#0082B8,#00A3E0)",
                  border: "none", color: "#fff", padding: "13px",
                  borderRadius: 12, fontSize: 14, fontWeight: 700,
                  cursor: !payMethod ? "not-allowed" : "pointer",
                  fontFamily: "inherit", transition: "all .3s",
                }}>
                  {payMethod ? `${PAYMENT_METHODS.find(p => p.id === payMethod)?.name}${m.payBtn}${total}₾` : m.chooseMethod}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: PROCESSING ── */}
          {step === 3 && (
            <div style={{ textAlign: "center", padding: "44px 20px", animation: "fadeIn .4s both" }}>
              <div style={{
                width: 60, height: 60, borderRadius: "50%",
                border: `4px solid rgba(139,105,20,.12)`,
                borderTopColor: payMethod === "bog" ? "#D4202C" : "#00A3E0",
                margin: "0 auto 22px",
                animation: "spin .85s linear infinite",
              }} />
              <h3 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 16, fontWeight: 800, marginBottom: 7 }}>{m.processing}</h3>
              <p style={{ color: "#6B5A3A", fontSize: 13 }}>{payMethod === "bog" ? "BOG Pay" : "TBC Pay"} {m.processingDesc}</p>
            </div>
          )}

          {/* ── STEP 4: SUCCESS ── */}
          {step === 4 && (
            <div style={{ textAlign: "center", padding: "28px 12px 12px", animation: "fadeUp .5s both" }}>
              <div style={{ fontSize: 58, marginBottom: 14 }}>🎉</div>
              <h2 style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 20, fontWeight: 900, letterSpacing: "-1px", marginBottom: 10 }}>{m.successTitle}</h2>
              <p style={{ color: "#6B5A3A", fontSize: 14, lineHeight: 1.6, marginBottom: 22 }}>
                <strong>{cottage.name}</strong> {m.successDesc.split("\n")[0]}<br />
                {m.successDesc.split("\n")[1]} <strong>{form.email}</strong>{m.successDesc2}
              </p>

              <div style={{ background: "#F7F4EE", borderRadius: 16, padding: "18px", border: "1px solid rgba(139,105,20,.11)", textAlign: "left", marginBottom: 20 }}>
                <div style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 11, fontWeight: 700, color: "#8B6914", letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>{m.detailsTitle}</div>
                {[
                  [`🏡 ${m.cottage}`, cottage.name],
                  [`👤 ${m.guest}`, form.name],
                  [`📅 ${m.arrival}`, formatDate(form.checkin, lang)],
                  [`📅 ${m.departure}`, formatDate(form.checkout, lang)],
                  [`🌙 ${m.nightsCount}`, `${nights} ${t.nights}`],
                  [`💳 ${m.payment}`, payMethod === "bog" ? "BOG Pay" : "TBC Pay"],
                  [`💰 ${m.paid}`, `${total}₾`],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 7, paddingBottom: 7, borderBottom: "1px solid rgba(139,105,20,.07)" }}>
                    <span style={{ color: "#6B5A3A" }}>{l}</span>
                    <span style={{ fontWeight: 600, color: "#1A1408" }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: "rgba(16,100,40,.07)", borderRadius: 11, padding: "11px 14px", marginBottom: 20, border: "1px solid rgba(16,100,40,.14)" }}>
                <p style={{ fontSize: 13, color: "#2A5A20" }}>📞 <strong>+995 595 772 088</strong></p>
              </div>

              <button onClick={handleDone} style={{
                width: "100%",
                background: "linear-gradient(135deg,#8B6914,#D4A942)",
                border: "none", color: "#fff", padding: "14px",
                borderRadius: 12, fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
              }}>{m.closeBtn}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Fld({ label, err, children }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, color: err ? "#C0392B" : "#8B6914", display: "block", marginBottom: 5, letterSpacing: ".5px" }}>{label}</label>
      {children}
      {err && <div style={{ fontSize: 11, color: "#C0392B", marginTop: 3 }}>⚠ {err}</div>}
    </div>
  );
}
