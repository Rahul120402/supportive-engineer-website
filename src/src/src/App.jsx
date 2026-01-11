import React, { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, ShieldCheck, MapPin, Coffee, Users, PhoneCall } from "lucide-react";

/* =============================
   CONFIG — SERVICES CATALOG
   (Single source of truth)
==============================*/

const SERVICES = [
  { id: "debug", title: "The Debug Session", icon: <MessageCircle />, color: "bg-emerald-50", desc: "60–90 min deep talk to clear emotional clutter." },
  { id: "event", title: "The Event Anchor", icon: <Users />, color: "bg-indigo-50", desc: "Professional plus‑one for weddings & corporate events." },
  { id: "navigator", title: "The Local Navigator (Jaipur)", icon: <MapPin />, color: "bg-rose-50", desc: "Explore Jaipur with a calm, culturally aware companion." },
  { id: "weekend", title: "The Weekend Gear", icon: <Coffee />, color: "bg-amber-50", desc: "Full‑day companionship to ease weekend isolation." },
  { id: "virtual", title: "Virtual Ally", icon: <PhoneCall />, color: "bg-sky-50", desc: "30‑min grounding call for emotional check‑ins." }
];

/* =============================
   LAYOUT HELPERS (outside render)
==============================*/

const NavButton = ({ id, label, page, setPage }) => (
  <button
    onClick={() => setPage(id)}
    className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 transform ${
      page === id
        ? "bg-white text-black shadow-lg scale-105"
        : "text-white/80 hover:bg-white/10 hover:text-white hover:scale-105"
    }`}
  >
    {label}
  </button>
);

const Section = ({ children }) => (
  <div className="max-w-4xl mx-auto p-6 grid gap-8">{children}</div>
);

/* =============================
   ACCESSIBLE MODAL WRAPPER
==============================*/

const Modal = ({ onClose, children }) => {
  const escHandler = useCallback((e) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", escHandler);
    return () => document.removeEventListener("keydown", escHandler);
  }, [escHandler]);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 relative shadow-xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold text-xl"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

/* =============================
   MAIN APP COMPONENT
==============================*/

export default function SupportiveEngineerWebsite() {
  const [formStatus, setFormStatus] = useState(null); // success | error | loading
  const [formData, setFormData] = useState({
    name: "",
    profile: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = () => {
    // Validation
    if (!formData.name || !formData.profile || !formData.phone || !formData.service) {
      setFormStatus("error");
      return;
    }

    setFormStatus("loading");

    try {
      const scriptURL = "https://script.google.com/macros/s/AKfycbzvTrGcXyi-goKZPc87ZdxE9NSuJyX23oK7DtjxVjyJvjvBFYFUCuSf6fBfDWy4Mb2U/exec";
      
      // Build URL with parameters
      const url = new URL(scriptURL);
      url.searchParams.append('name', formData.name);
      url.searchParams.append('profile', formData.profile);
      url.searchParams.append('phone', formData.phone);
      url.searchParams.append('service', formData.service);
      url.searchParams.append('message', formData.message || '');

      // Open in new window (this bypasses CSP and sandboxing)
      const submitWindow = window.open(url.toString(), '_blank');
      
      // Auto-close window after 2 seconds if it opened
      if (submitWindow) {
        setTimeout(() => {
          try {
            submitWindow.close();
          } catch (e) {
            // If can't close, that's okay
          }
        }, 2000);
      }

      // Show success
      setFormStatus("success");
      setFormData({ name: "", profile: "", phone: "", service: "", message: "" });
      
      setTimeout(() => setFormStatus(null), 5000);
      
    } catch (err) {
      console.error("Submission error:", err);
      setFormStatus("error");
    }
  };
  const [page, setPage] = useState("home");
  const [selectedService, setSelectedService] = useState(null);

  return (
    <div
      className={`min-h-screen text-[#1F2937] antialiased font-sans tracking-tight overflow-y-auto selection:bg-[#0F2540]/10 selection:text-[#0F2540]
        ${page === "home"
          ? "bg-gradient-to-b from-blue-50/70 via-white to-white animate-in fade-in"
          : page === "services"
          ? "bg-gradient-to-b from-emerald-50/60 via-white to-white"
          : page === "about"
          ? "bg-gradient-to-b from-indigo-50/60 via-white to-white"
          : page === "why"
          ? "bg-gradient-to-b from-sky-50/60 via-white to-white"
          : page === "ethics"
          ? "bg-gradient-to-b from-rose-50/60 via-white to-white"
          : "bg-gradient-to-b from-amber-50/60 via-white to-white"
      }`}
    >
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-black text-white shadow-xl backdrop-blur-md bg-opacity-95 transition-all duration-300">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4 gap-4">
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left duration-500">
            <div className="w-8 h-8 bg-[#7A9E7E] rounded-lg flex items-center justify-center font-bold text-black transform hover:rotate-12 hover:scale-110 transition-all duration-300">SE</div>
            <h1 className="text-xl font-bold tracking-tight text-white">The Supportive Engineer</h1>
          </div>

          <nav className="flex flex-wrap gap-1 animate-in fade-in slide-in-from-right duration-500">
            <NavButton id="home" label="Home" page={page} setPage={setPage} />
            <NavButton id="services" label="Services" page={page} setPage={setPage} />
            <NavButton id="about" label="About Me" page={page} setPage={setPage} />
            <NavButton id="why" label="Why Us" page={page} setPage={setPage} />
            <NavButton id="ethics" label="Ethics" page={page} setPage={setPage} />
            <NavButton id="book" label="Book Now" page={page} setPage={setPage} />
          </nav>
        </div>
      </header>

      {/* HOME */}
      {page === "home" && (
        <Section>
          {/* SOFT AESTHETIC BACKGROUND ACCENTS (Home only) */}
          <div className="relative">
            {/* floating soft gradient blobs */}
            <div className="pointer-events-none select-none absolute -top-20 -left-24 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl animate-pulse" />
            <div className="pointer-events-none select-none absolute -top-10 right-0 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl animate-pulse" />
            <div className="pointer-events-none select-none absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl animate-pulse" />

            {/* subtle dotted texture overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:24px_24px] opacity-40" />

            {/* HERO CONTENT */}
            <div className="text-center py-10 space-y-4 animate-in fade-in-50 slide-in-from-top-1 duration-500">
              <h2 className="text-4xl md:text-5xl font-serif italic tracking-tight text-[#0F2540] animate-in fade-in-50 slide-in-from-bottom-1 duration-500">
                The Logic of Listening. <br /> The Art of Company.
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                For moments when you don't want to be alone. Just a calm, grounded person to listen and walk with you.
              </p>
              <Button
                onClick={() => setPage("services")}
                className="bg-[#7A9E7E] hover:bg-[#668669] text-[#0F2540] font-bold rounded-full px-8 py-6 text-lg transition-transform hover:scale-110 shadow-lg active:scale-95 animate-in fade-in-50 slide-in-from-bottom-1 duration-700"
              >
                Explore Services
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border bg-emerald-50/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-md/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-white cursor-pointer animate-in fade-in-50 slide-in-from-bottom-1 duration-700">
                <Coffee className="mx-auto mb-2 text-[#7A9E7E]" />
                <h3 className="font-bold">Calm Presence</h3>
                <p className="text-sm text-gray-600">No judgment, just a steady listening ear.</p>
              </Card>
              <Card className="border bg-blue-50/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-md/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-white cursor-pointer animate-in fade-in-50 slide-in-from-bottom-1 duration-800">
                <Users className="mx-auto mb-2 text-[#0F2540]" />
                <h3 className="font-bold">Social Anchor</h3>
                <p className="text-sm text-gray-600">A refined plus‑one for public events.</p>
              </Card>
              <Card className="border bg-orange-50/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-md/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-white cursor-pointer animate-in fade-in-50 slide-in-from-bottom-1 duration-900">
                <ShieldCheck className="mx-auto mb-2 text-orange-600" />
                <h3 className="font-bold">Safety First</h3>
                <p className="text-sm text-gray-600">Strictly platonic and identity‑verified.</p>
              </Card>
            </div>
          </div>
        </Section>
      )}

      {/* SERVICES */}
      {page === "services" && (
        <Section>
          <h2 className="text-3xl font-bold text-[#0F2540] text-center">Our Structured Support</h2>

          <div className="grid gap-4">
            {SERVICES.map((s, index) => (
              <Card
                key={s.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className={`flex items-center justify-between p-6 ${s.color} border-none shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer animate-in fade-in slide-in-from-bottom`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-[#0F2540] transform transition-transform duration-300 hover:scale-110 hover:rotate-12">{s.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg">{s.title}</h3>
                    <p className="text-sm text-gray-600">{s.desc}</p>
                  </div>
                </div>
                <Button onClick={() => setSelectedService(s.id)} className="bg-[#0F2540] text-white rounded-xl hover:bg-black transition-all duration-300 hover:scale-110 active:scale-95">
                  Details
                </Button>
              </Card>
            ))}
          </div>

          {/* PRICING — BOTTOM OF SERVICES PAGE */}
          <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom">
            <CardHeader>
              <CardTitle className="text-xl text-[#0F2540]">How Pricing Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700 text-sm leading-relaxed">
              <p>
                Pricing is shared personally after identity verification and context understanding — so the
                experience remains safe, comfortable and intentional for both sides.
              </p>
              <ul className="list-disc ml-5 space-y-1">
                <li>varies by session type, duration and environment</li>
                <li>final details discussed privately after a booking request</li>
                <li>designed to respect emotional effort, boundaries and dignity</li>
              </ul>
            </CardContent>
          </Card>
        </Section>
      )}

      {/* ABOUT */}
      {page === "about" && (
        <Section>
          <Card className="rounded-3xl border-none shadow-lg overflow-hidden">
            <div className="bg-[#0F2540] p-8 text-white">
              <h2 className="text-3xl font-serif italic mb-2">The Logic of Listening.</h2>
              <h2 className="text-3xl font-serif italic">The Art of Company.</h2>
            </div>
            <CardContent className="space-y-4 text-gray-700 leading-relaxed text-lg">
              <p className="font-semibold text-[#0F2540]">
                "Hi, I'm [Your Name]. I am an Engineer by profession, but a Listener by heart."
              </p>
              <p>
                In a world where everyone is busy talking, very few people are actually listening.
                I realized that many of us—especially professionals—often feel alone even in a crowd.
                We have great careers, but sometimes we just lack a steady, non-judgmental person
                to talk to or to accompany us to an event.
              </p>
              <p>
                I am not a therapist, and I am not a "guide." I am simply a grounded, educated,
                and respectful person you can rely on. Whether you need to vent after a stressful day,
                need a dignified plus-one for a wedding, or want to explore Jaipur with a local friend.
              </p>
              <p className="text-[#7A9E7E] font-medium">
                Structured for Support. Designed for Connection.
              </p>
            </CardContent>
          </Card>
        </Section>
      )}

      {/* WHY US */}
      {page === "why" && (
        <Section>
          <h2 className="text-3xl font-bold text-[#0F2540] text-center">Why People Choose The Supportive Engineer</h2>

          {/* CONTEXT INTRO — moved from Home */}
          <p className="text-sm text-gray-600 text-center max-w-2xl mx-auto -mt-2 mb-4">
            Designed for working professionals, early‑career adults (18+) and solo travellers seeking a safe,
            dignified and emotionally grounded companionship experience.
          </p>

          {/* DIFFERENTIATORS */}
          <Card className="rounded-2xl border bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">What Makes This Service Different</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-gray-700">
              <div className="p-3 rounded-xl bg-emerald-50">
                A warm, steady presence — someone who sits with you, listens without judgement,
                and doesn't force small‑talk or performance.
              </div>
              <div className="p-3 rounded-xl bg-indigo-50">
                Conversations that feel human and grounded — not therapy, not advice‑dumping,
                just space to think and breathe together.
              </div>
              <div className="p-3 rounded-xl bg-amber-50">
                Clear boundaries, safety and respect — public spaces, mutual comfort,
                and a companionship experience handled with maturity.
              </div>
            </CardContent>
          </Card>

          {/* WHO THIS IS FOR — FULL SECTION */}
          <Card className="rounded-2xl border bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Who This Is For</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4 text-base leading-relaxed text-gray-700">
              <div className="p-3 rounded-xl bg-[#F6FBF4]">
                <span className="font-medium">🧑‍💼 Working Professionals</span>
                <p>People who carry a lot on the inside — meetings, pressure, expectations —
                but don't always have someone calm to talk to.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#F6F8FF]">
                <span className="font-medium">🎓 Students & Early‑Career Individuals</span>
                <p>Those navigating new cities, new environments or silent phases in life
                where conversation feels easier with someone neutral.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#FFF6F2]">
                <span className="font-medium">🌆 Solo Travellers</span>
                <p>People who prefer a gentle, culturally aware companion — not a guide —
                just someone who walks along at a comfortable pace.</p>
              </div>
            </CardContent>
          </Card>

          {/* PROCESS */}
          <Card className="rounded-2xl border bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">How The Process Works</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-gray-700 text-base leading-relaxed">
              <div>1️⃣ You choose a service that feels right for your situation — no rush, no pressure.</div>
              <div>2️⃣ A short identity verification via LinkedIn or a social profile — only for safety and comfort.</div>
              <div>3️⃣ We meet in a public, comfortable place and keep the space respectful, slow and platonic.</div>
            </CardContent>
          </Card>
        </Section>
      )}

      {/* ETHICS */}
      {page === "ethics" && (
        <Section>
          <Card className="border-2 border-red-100 bg-red-50/30">
            <CardHeader>
              <CardTitle className="text-2xl text-red-800">Professional Boundaries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h4 className="font-bold text-[#0F2540]">Strictly Platonic</h4>
                <p className="text-gray-600">
                  No romance or physical intimacy. No suggestive behaviour. Mutual respect is
                  non‑negotiable.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h4 className="font-bold text-[#0F2540]">Public Venues Only</h4>
                <p className="text-gray-600">
                  Sessions take place only in public locations — no private residences or hotel
                  rooms.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h4 className="font-bold text-[#0F2540]">Privacy & Confidentiality</h4>
                <p className="text-gray-600">
                  Conversations, identity details and booking information remain strictly confidential.
                  Nothing is recorded, shared, or stored beyond session scheduling.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h4 className="font-bold text-[#0F2540]">Verification Required</h4>
                <p className="text-gray-600">
                  Identity confirmation may be completed using LinkedIn or a verified social profile
                  (such as Instagram or X). Details are used only for safety validation and are never shared.
                </p>
              </div>
            </CardContent>
          </Card>
        </Section>
      )}

      {/* BOOKING */}
      {page === "book" && (
        <Section>
          <Card className="border-none shadow-2xl p-8 bg-white rounded-3xl">
            <h2 className="text-3xl font-bold text-[#0F2540] mb-6">Request a Session</h2>

            <div className="grid gap-4">
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleFormChange} 
                className="p-4 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-[#7A9E7E] focus:border-transparent transition-all" 
                placeholder="Full Name" 
              />

              <input
                className="p-4 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-[#7A9E7E] focus:border-transparent transition-all"
                name="profile" 
                value={formData.profile} 
                onChange={handleFormChange} 
                placeholder="LinkedIn or Social Profile URL"
                type="url"
                title="Share LinkedIn / Instagram / X or any verified social profile"
              />

              <input
                className="p-4 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-[#7A9E7E] focus:border-transparent transition-all"
                name="phone" 
                value={formData.phone} 
                onChange={handleFormChange} 
                placeholder="Contact Number"
                type="tel"
                title="Enter a valid phone number"
              />

              <select 
                name="service" 
                value={formData.service} 
                onChange={handleFormChange} 
                className="p-4 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-[#7A9E7E] focus:border-transparent transition-all"
              >
                <option value="">Select Service</option>
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))}
              </select>

              <textarea
                className="p-4 rounded-xl border bg-gray-50 min-h-[120px] focus:ring-2 focus:ring-[#7A9E7E] focus:border-transparent transition-all"
                name="message" 
                value={formData.message} 
                onChange={handleFormChange} 
                placeholder="Briefly describe your requirements..."
              />

              {formStatus === "loading" && <p className="text-blue-600 text-sm font-medium animate-pulse">⏳ Submitting your request...</p>}
              {formStatus === "success" && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-green-700 font-medium">✓ Request Submitted Successfully!</p>
                  <p className="text-green-600 text-sm mt-1">A confirmation tab opened briefly. Your details have been recorded and we'll contact you soon.</p>
                </div>
              )}
              {formStatus === "error" && <p className="text-red-600 text-sm font-medium">⚠ Please fill all required fields and try again.</p>}
              
              <Button 
                onClick={handleFormSubmit} 
                disabled={formStatus === "loading"}
                className="bg-black text-white py-6 rounded-xl text-lg font-bold hover:bg-gray-800 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formStatus === "loading" ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </Card>
        </Section>
      )}

      {/* MODAL */}
      {selectedService && (
        <Modal onClose={() => setSelectedService(null)}>
          <h2 className="text-2xl font-bold text-[#0F2540] mb-4">Service Details</h2>

          {selectedService === "debug" && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">The Debug Session — Emotional Clarity Talk</h3>
              <ul className="list-disc ml-5 space-y-1 text-gray-600">
                <li>60–90 min reflective conversation</li>
                <li>Calm, judgement‑free emotional space</li>
                <li>Structured talk + grounding closure</li>
              </ul>
            </div>
          )}

          {selectedService === "event" && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">The Event Anchor — Plus‑One Support</h3>
              <ul className="list-disc ml-5 space-y-1 text-gray-600">
                <li>4–5 hrs dignified public presence</li>
                <li>Subtle social comfort & company</li>
                <li>Strictly platonic • Public venues only</li>
              </ul>
            </div>
          )}

          {selectedService === "weekend" && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">The Weekend Gear — Full‑Day Companionship</h3>
              <ul className="list-disc ml-5 space-y-1 text-gray-600">
                <li>8 hr slow‑paced outings & conversation</li>
                <li>Emotionally steady, calm presence</li>
                <li>No private or intimate environments</li>
              </ul>
            </div>
          )}

          {selectedService === "virtual" && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Virtual Ally — 30‑min Grounding Call</h3>
              <ul className="list-disc ml-5 space-y-1 text-gray-600">
                <li>Quick emotional check‑in & reflection</li>
                <li>Supportive listening • No counselling</li>
                <li>Respectful & non‑intrusive guidance</li>
              </ul>
            </div>
          )}

          {selectedService === "navigator" && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">The Local Navigator — Jaipur</h3>
              <ul className="list-disc ml-5 space-y-1 text-gray-600">
                <li>Candid photography support at forts & cafes</li>
                <li>Scam‑free navigation in local markets</li>
                <li>Dignified presence for solo travellers</li>
              </ul>
            </div>
          )}

          <Button
            onClick={() => {
              setSelectedService(null);
              setPage("book");
            }}
            className="w-full mt-6 bg-[#7A9E7E] text-[#0F2540] font-bold"
          >
            Inquire Now
          </Button>
        </Modal>
      )}

      {/* SAFETY NOTE */}
      <div className="bg-[#0F2540] text-white py-4 text-center mt-20">
        <p className="text-[10px] uppercase tracking-[0.3em] font-light opacity-80">
          Strictly Platonic • Public Meetings Only • Identity Verified • Professional Companionship
        </p>
      </div>

      <footer className="p-8 text-center text-gray-400 text-sm">
        © 2026 The Supportive Engineer — Built for Human Connection
      </footer>
    </div>
  );
}
