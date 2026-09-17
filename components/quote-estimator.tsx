"use client";

import { FormEvent, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const products = [
  { name: "Hass Avocado", grade: "Grade A · Count 16–20", origin: "Kiambu County, Kenya", harvest: "Harvested 18 Jun", tonnes: "24.0 tonnes", certs: ["GlobalG.A.P", "HACCP"], price: "$2.80/kg CIF Rotterdam" },
  { name: "Fine Beans", grade: "Extra Fine · 150–180mm", origin: "Nairobi County, Kenya", harvest: "Harvested today", tonnes: "8.5 tonnes", certs: ["SMETA", "KEPHIS"], price: "$3.60/kg CIF Amsterdam" },
  { name: "Snow Peas", grade: "Premium · Sugar Snap", origin: "Nyeri County, Kenya", harvest: "Harvested 17 Jun", tonnes: "6.2 tonnes", certs: ["GlobalG.A.P", "HACCP"], price: "$3.40/kg CIF Rotterdam" },
  { name: "Fuerte Avocado", grade: "Export · Count 18–22", origin: "Murang’a County, Kenya", harvest: "Harvested 16 Jun", tonnes: "18.0 tonnes", certs: ["GlobalG.A.P", "KEPHIS"], price: "$2.40/kg CIF Dubai" },
];

const routes = { "Air Freight via JKIA": 1.45, "Sea Freight 40ft Reefer via Mombasa": 0.32 };
const terms = { EXW: 0, "FOB Mombasa": 0.16, "CIF Rotterdam": 0.81, "CIF Dubai": 0.57 };

export default function QuoteEstimator() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [portal, setPortal] = useState<"trade" | "farmer" | null>(null);
  const [produce, setProduce] = useState("Hass Avocado");
  const [grade, setGrade] = useState("Grade A · Count 16–20 · DM 23%+");
  const [shipping, setShipping] = useState<keyof typeof routes>("Air Freight via JKIA");
  const [incoterm, setIncoterm] = useState<keyof typeof terms>("CIF Rotterdam");

  const estimate = useMemo(() => {
    const base = produce.includes("Hass") ? 1.91 : produce.includes("Fuerte") ? 1.63 : produce.includes("Fine") ? 2.12 : 2.05;
    return Number((base + routes[shipping] + terms[incoterm]).toFixed(2));
  }, [produce, shipping, incoterm]);

  const whatsapp = () => {
    const text = `Hello eTunda, I would like an export quote for ${produce} (${grade}), ${shipping}, ${incoterm}. Estimated price shown: $${estimate}/kg.`;
    window.open(`https://wa.me/254700000000?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <main className="overflow-hidden bg-aero-base text-white">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#0D1F17]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-aero-neon text-sm font-bold text-aero-base">e</div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-aero-neon">eTunda</p>
              <p className="text-[10px] text-aero-slate">Global trade network</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-aero-slate md:flex">
            <a href="#sourcing-engine" className="hover:text-white">Sourcing</a>
            <a href="#live-market" className="hover:text-white">Market</a>
            <a href="#traceability" className="hover:text-white">Traceability</a>
            <a href="#logistics" className="hover:text-white">Logistics</a>
            <a href="#compliance" className="hover:text-white">Compliance</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button onClick={() => setPortal("farmer")} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:border-aero-neon">Farmer portal</button>
            <button onClick={() => setModalOpen(true)} className="rounded-full bg-aero-neon px-5 py-2.5 text-sm font-medium text-aero-base">Request quote</button>
          </div>

          <button
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 md:hidden"
            aria-label="Open menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round"/></svg>
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-[#0D1F17] p-4 md:hidden">
            <div className="flex flex-col gap-3 text-sm text-aero-slate">
              <a href="#sourcing-engine" onClick={() => setMenuOpen(false)}>Sourcing</a>
              <a href="#live-market" onClick={() => setMenuOpen(false)}>Market</a>
              <a href="#traceability" onClick={() => setMenuOpen(false)}>Traceability</a>
              <a href="#logistics" onClick={() => setMenuOpen(false)}>Logistics</a>
              <button onClick={() => setModalOpen(true)} className="mt-2 rounded-full bg-aero-neon px-4 py-2 text-aero-base">Request quote</button>
            </div>
          </div>
        )}
      </header>

      <section id="top" className="grid-bg relative pt-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-14 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:pt-20">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-aero-neon/30 bg-aero-neon/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[.22em] text-aero-neon">Verified export supply</p>
            <h1 className="max-w-xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">Trade premium produce from East Africa to global buyers.</h1>
            <p className="mt-6 max-w-xl text-base text-aero-slate sm:text-lg">Source, verify, and export compliant agri-products with live pricing, origin traceability, and logistics coordination.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => setModalOpen(true)} className="rounded-full bg-aero-neon px-6 py-3 text-sm font-semibold text-aero-base shadow-lg shadow-aero-neon/25">Request quote</button>
              <button onClick={() => setPortal("farmer")} className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white">Farmer onboarding</button>
            </div>
            <div className="mt-10 flex flex-wrap gap-8 text-sm text-aero-slate">
              <div><div className="text-2xl font-black text-white">24h</div><div>lead response</div></div>
              <div><div className="text-2xl font-black text-white">18+</div><div>export routes</div></div>
              <div><div className="text-2xl font-black text-white">100%</div><div>traceability</div></div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[.2em] text-aero-neon">Live quote estimator</p>
                <h2 className="mt-2 text-xl font-bold text-white">Export price</h2>
              </div>
              <div className="rounded-full bg-aero-neon/15 px-2.5 py-1 text-xs font-semibold text-aero-neon">Live</div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm text-aero-slate">
                Produce
                <select value={produce} onChange={(e) => setProduce(e.target.value)} className="input-aero mt-2">
                  {products.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
                </select>
              </label>

              <label className="block text-sm text-aero-slate">
                Grade
                <select value={grade} onChange={(e) => setGrade(e.target.value)} className="input-aero mt-2">
                  {products.map((item) => <option key={item.grade} value={item.grade}>{item.grade}</option>)}
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-aero-slate">
                  Shipping
                  <select value={shipping} onChange={(e) => setShipping(e.target.value as keyof typeof routes)} className="input-aero mt-2">
                    {Object.keys(routes).map((key) => <option key={key} value={key}>{key}</option>)}
                  </select>
                </label>

                <label className="block text-sm text-aero-slate">
                  Incoterm
                  <select value={incoterm} onChange={(e) => setIncoterm(e.target.value as keyof typeof terms)} className="input-aero mt-2">
                    {Object.keys(terms).map((key) => <option key={key} value={key}>{key}</option>)}
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-aero-neon/20 bg-[#0a1b16] p-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[.2em] text-aero-slate">Estimated price</p>
                  <p className="mt-2 text-3xl font-black text-aero-neon">${estimate.toFixed(2)}<span className="text-base text-aero-slate">/kg</span></p>
                </div>
                <button onClick={whatsapp} className="rounded-full bg-[#25D366] px-3 py-2 text-xs font-semibold text-white">WhatsApp</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-aero-neon/20 bg-aero-neon/10 py-3">
        <div className="ticker flex w-max gap-12 whitespace-nowrap text-xs font-medium text-aero-neon">
          <span>HASS AVOcado</span>
          <span>Fine beans</span>
          <span>Snow peas</span>
          <span>Fuerte avocado</span>
          <span>GlobalG.A.P</span>
          <span>HACCP</span>
          <span>KEPHIS</span>
          <span>SMETA</span>
          <span>HASS AVOcado</span>
          <span>Fine beans</span>
          <span>Snow peas</span>
          <span>Fuerte avocado</span>
          <span>GlobalG.A.P</span>
          <span>HACCP</span>
          <span>KEPHIS</span>
          <span>SMETA</span>
        </div>
      </div>

      <section id="sourcing-engine" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-bold tracking-[.18em] text-aero-neon">SOURCING ENGINE</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Request, compare, and secure produce in one place.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {products.map((item) => (
            <article key={item.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{item.name}</h3>
                  <p className="mt-1 text-sm text-aero-slate">{item.grade}</p>
                </div>
                <div className="rounded-full border border-aero-neon/20 bg-aero-neon/10 px-2 py-1 text-[11px] uppercase tracking-[.15em] text-aero-neon">Verified</div>
              </div>
              <div className="mt-5 space-y-2 text-sm text-aero-slate">
                <p>{item.origin}</p>
                <p>{item.harvest}</p>
                <p>{item.tonnes}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {item.certs.map((cert) => (
                  <span key={cert} className="rounded-full border border-white/10 bg-[#0b1b16] px-2.5 py-1 text-[10px] uppercase tracking-[.15em] text-aero-neon">{cert}</span>
                ))}
              </div>
              <p className="mt-6 text-lg font-bold text-white">{item.price}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="live-market" className="border-y border-white/10 bg-[#0a1a14]">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold tracking-[.18em] text-aero-neon">LIVE MARKET</p>
              <h2 className="mt-3 text-3xl font-black text-white">24/7 pricing intelligence</h2>
            </div>
            <button onClick={() => setModalOpen(true)} className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white">Request market update</button>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: "Avocado FOB", value: "$2.56/kg", delta: "+8.1%" },
              { label: "Fine beans", value: "$3.44/kg", delta: "+1.7%" },
              { label: "Snow peas", value: "$3.19/kg", delta: "+3.4%" },
              { label: "Sea freight", value: "$0.32/kg", delta: "Stable" },
            ].map((market) => (
              <div key={market.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[.2em] text-aero-slate">{market.label}</p>
                <p className="mt-4 text-2xl font-black text-white">{market.value}</p>
                <p className="mt-2 text-sm text-aero-neon">{market.delta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold tracking-[.18em] text-aero-neon">FARM-TO-MARKET</p>
            <h2 className="mt-3 text-3xl font-black text-white">From orchard to port, every lot is mapped and monitored.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Field verification", "GPS-anchored map data and farm audits"],
              ["Harvest tracking", "Daily updates for picking, grading, and cold chain"],
              ["Warehouse handoff", "Batch-linked shipping prep and customs compliance"],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm text-aero-slate">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="traceability" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[.78fr_1.22fr]">
          <div>
            <p className="text-xs font-bold tracking-[.18em] text-aero-neon">TRACEABILITY</p>
            <h2 className="mt-3 text-3xl font-black text-white">Know every origin, checkpoint, and certification.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Origin map", "Farm GPS and district-level provenance"],
              ["Batch records", "Harvest ID, QA checks, lot status"],
              ["Certification logs", "GlobalG.A.P, HACCP, KEPHIS & SMETA"],
              ["Buyer visibility", "Track status from harvest to shipment"],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm text-aero-slate">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="logistics" className="bg-aero-neon px-5 py-20 text-aero-base">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold tracking-[.18em]">LOGISTICS</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Air, sea, and cold-chain orchestration without friction.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["JKIA air freight", "Fast-turn delivery for time-sensitive produce"],
              ["Mombasa port", "Reefer and consolidated shipping lines"],
              ["Cold-chain visibility", "Temperature and transit monitoring"],
              ["Documentation", "Export docs and compliance file pack"],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-2xl bg-[#0D1F17]/10 p-5 ring-1 ring-[#0D1F17]/10">
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm text-[#12372b]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="compliance" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="glass rounded-2xl p-8 text-center sm:p-14">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-aero-neon/10 text-aero-neon">✓</div>
          <p className="text-xs font-bold tracking-[.18em] text-aero-neon">COMPLIANCE</p>
          <h2 className="mt-3 text-3xl font-black text-white">Regulated exports for secure cross-border transactions.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-aero-slate">eTunda helps buyers and exporters manage certificates, origin provenance, and freight documentation with less friction.</p>
          <button onClick={() => setModalOpen(true)} className="mt-8 rounded-full bg-aero-neon px-6 py-3 text-sm font-semibold text-aero-base">Book an export review</button>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-9 text-xs text-aero-slate">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} eTunda Marketplace</p>
          <div className="flex gap-5">
            <a href="#sourcing-engine" className="hover:text-white">Sourcing</a>
            <a href="#traceability" className="hover:text-white">Traceability</a>
            <a href="#logistics" className="hover:text-white">Logistics</a>
          </div>
        </div>
      </footer>

      <button onClick={whatsapp} aria-label="Contact eTunda on WhatsApp" className="fixed bottom-5 right-5 z-30 grid h-14 w-14 cursor-pointer place-items-center rounded-full bg-aero-neon text-2xl text-aero-base shadow-lg shadow-aero-neon/35">
        💬
      </button>

      <AnimatePresence>
        {modalOpen && <TradeModal close={() => setModalOpen(false)} />}
        {portal === "farmer" && <FarmerModal close={() => setPortal(null)} />}
      </AnimatePresence>
    </main>
  );
}

function TradeModal({ close }: { close: () => void }) {
  const submit = (e: FormEvent) => {
    e.preventDefault();
    close();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-[#0D1F17]/70 p-4 backdrop-blur-sm">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0D1F17] p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[.2em] text-aero-neon">Request quote</p>
            <h3 className="mt-2 text-2xl font-bold text-white">Buyer enquiry</h3>
          </div>
          <button onClick={close} className="text-lg text-aero-slate">✕</button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input placeholder="Company name" className="input-aero" />
          <input placeholder="Email address" type="email" className="input-aero" />
          <textarea placeholder="Tell us what volume, destination, and timing you need" className="input-aero min-h-[120px]" />
          <button type="submit" className="w-full rounded-full bg-aero-neon px-5 py-3 font-semibold text-aero-base">Submit enquiry</button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function FarmerModal({ close }: { close: () => void }) {
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-[#0D1F17]/70 p-4 backdrop-blur-sm">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0D1F17] p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[.2em] text-aero-neon">Farmer portal</p>
            <h3 className="mt-2 text-2xl font-bold text-white">Register a farm</h3>
          </div>
          <button onClick={close} className="text-lg text-aero-slate">✕</button>
        </div>

        {!done ? (
          <form onSubmit={submit} className="space-y-4">
            <input placeholder="Farm name" className="input-aero" />
            <input placeholder="Farmer name" className="input-aero" />
            <input placeholder="County or region" className="input-aero" />
            <button type="submit" className="w-full rounded-full bg-aero-neon px-5 py-3 font-semibold text-aero-base">Create profile</button>
          </form>
        ) : (
          <div className="rounded-2xl border border-aero-neon/20 bg-aero-neon/10 p-5 text-center">
            <p className="text-2xl">✅</p>
            <p className="mt-3 text-lg font-semibold text-white">Farm profile created</p>
            <p className="mt-2 text-sm text-aero-slate">Your account is ready for harvest onboarding.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
