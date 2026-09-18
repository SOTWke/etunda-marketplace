"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ClipboardCheck,
  FileCheck2,
  Globe2,
  Leaf,
  MapPin,
  Menu,
  Plane,
  ShieldCheck,
  Ship,
  Sparkles,
  Sun,
  ThermometerSnowflake,
  Truck,
  Wheat,
  X,
} from "lucide-react";

const products = [
  {
    name: "Hass Avocado",
    grade: "Grade A · Count 16–20",
    origin: "Kiambu County, Kenya",
    harvest: "Harvested 18 Jun",
    tonnes: "24.0 tonnes",
    certs: ["GlobalG.A.P", "HACCP"],
    price: "$2.80/kg CIF Dubai",
    image:
      "https://images.unsplash.com/photo-1523095072531-62ce1b7e5d22?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Fine Beans",
    grade: "Extra Fine · 150–180mm",
    origin: "Nairobi County, Kenya",
    harvest: "Harvested today",
    tonnes: "8.5 tonnes",
    certs: ["SMETA", "KEPHIS"],
    price: "$3.60/kg CIF Amsterdam",
    image: "https://www.bryanstonmarkett.co.za/Shop/images/product6957.jpg",
  },
  {
    name: "Snow Peas",
    grade: "Premium · Sugar Snap",
    origin: "Nyeri County, Kenya",
    harvest: "Harvested 17 Jun",
    tonnes: "6.2 tonnes",
    certs: ["GlobalG.A.P", "HACCP"],
    price: "$3.40/kg CIF Rotterdam",
    image:
      "https://images.unsplash.com/photo-1587840171670-8b850147754e?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Fuerte Avocado",
    grade: "Export · Count 18–22",
    origin: "Murang’a County, Kenya",
    harvest: "Harvested 16 Jun",
    tonnes: "18.0 tonnes",
    certs: ["GlobalG.A.P", "KEPHIS"],
    price: "$2.45/kg FOB Mombasa",
    image:
      "https://images.unsplash.com/photo-1601092393319-0c6f4d936dce?auto=format&fit=crop&w=1000&q=85",
  },
];

const routes = {
  "Air Freight via JKIA": 1.45,
  "Sea Freight 40ft Reefer via Mombasa": 0.32,
};

const terms = {
  EXW: 0,
  "FOB Mombasa": 0.16,
  "CIF Rotterdam": 0.81,
  "CIF Dubai": 0.57,
};

const trustPillars = [
  {
    icon: ShieldCheck,
    title: "Verified origin",
    text: "Trace each lot back to the farm, field agent, and export documentation.",
  },
  {
    icon: ThermometerSnowflake,
    title: "Cold-chain clarity",
    text: "Temperature control and handling status visible throughout the route.",
  },
  {
    icon: FileCheck2,
    title: "Compliance ready",
    text: "Export documentation, compliance checks, and quality sorting built in.",
  },
];

const processSteps = [
  { icon: Wheat, title: "Source & harvest", copy: "Vetted farmer groups, quality grading, and yield planning." },
  { icon: ClipboardCheck, title: "Inspect & sort", copy: "Cold-chain checks, lot capture, and export readiness reviews." },
  { icon: Truck, title: "Ship & deliver", copy: "Transparent route planning with accountable delivery updates." },
];

const metrics = [
  { label: "Verified farms", value: "2.8k" },
  { label: "Trade routes", value: "16" },
  { label: "Avg. lead time", value: "4.2d" },
  { label: "Quote win rate", value: "96%" },
];

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [portal, setPortal] = useState<"trade" | "farmer" | null>(null);
  const [produce, setProduce] = useState("Hass Avocado");
  const [grade, setGrade] = useState("Grade A · Count 16–20 · DM 23%+");
  const [shipping, setShipping] = useState<keyof typeof routes>("Sea Freight 40ft Reefer via Mombasa");
  const [incoterm, setIncoterm] = useState<keyof typeof terms>("CIF Dubai");

  const estimate = useMemo(() => {
    const base = produce.includes("Hass") ? 1.91 : produce.includes("Fuerte") ? 1.63 : produce.includes("Fine") ? 2.12 : 2.05;
    return (base + routes[shipping] + terms[incoterm]).toFixed(2);
  }, [produce, shipping, incoterm]);

  const whatsapp = () => {
    const text = `Hello eTunda, I would like an export quote for ${produce} (${grade}), ${shipping}, ${incoterm}. Estimated price shown: $${estimate}/kg.`;
    window.open(
      `https://wa.me/254784972601?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <main className="min-h-screen bg-[#061b14] text-white">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#061b14]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#top" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#b7ff77] text-[#061b14] shadow-[0_0_30px_rgba(183,255,119,0.35)]">
              <Leaf size={22} />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              eTunda <span className="text-[#b7ff77]">Marketplace</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-sm text-[#d8efe6] lg:flex">
            {[
              ["Live Market", "#live-market"],
              ["Sourcing Engine", "#sourcing-engine"],
              ["Traceability", "#traceability"],
              ["Logistics", "#logistics"],
              ["Compliance", "#compliance"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="transition hover:text-white">
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button onClick={() => setPortal("farmer")} className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-[#b7ff77] hover:text-[#b7ff77]">
              Farmer Portal
            </button>
            <button onClick={() => setModalOpen(true)} className="rounded-full bg-[#b7ff77] px-4 py-2 text-sm font-semibold text-[#081b14] shadow-[0_0_30px_rgba(183,255,119,0.25)] transition hover:scale-[1.02]">
              Global Trade Portal
            </button>
          </div>

          <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <Menu size={22} />
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-[#061b14]/95 px-5 py-5 lg:hidden">
            <div className="grid gap-3 text-sm text-[#d8efe6]">
              {[
                ["Live Market", "#live-market"],
                ["Sourcing Engine", "#sourcing-engine"],
                ["Traceability", "#traceability"],
                ["Logistics", "#logistics"],
                ["Compliance", "#compliance"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl border border-white/10 px-3 py-2"
                >
                  {label}
                </a>
              ))}
            </div>
            <div className="mt-4 grid gap-2">
              <button onClick={() => { setPortal("farmer"); setMenuOpen(false); }} className="rounded-full border border-white/15 px-4 py-2.5 font-medium text-white">
                Farmer Portal
              </button>
              <button onClick={() => { setModalOpen(true); setMenuOpen(false); }} className="rounded-full bg-[#b7ff77] px-4 py-2.5 font-semibold text-[#081b14]">
                Global Trade Portal
              </button>
            </div>
          </div>
        )}
      </header>

      <section id="top" className="relative overflow-hidden pt-28">
        <div className="hero-glow absolute inset-0" />
        <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-12 pt-10 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:pt-16">
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-[#b7ff77]/30 bg-[#b7ff77]/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b7ff77]">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#b7ff77] text-[#061b14]">
                <Leaf size={12} />
              </span>
              Verified East African produce
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-6 max-w-xl text-4xl font-black leading-tight tracking-[-0.05em] text-white sm:text-5xl lg:text-7xl">
              Source premium agribusiness supply with real traceability.
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-5 max-w-xl text-lg text-[#c9dcd4]">
              eTunda connects farmers, exporters, and global buyers through a trusted trading layer built for freshness, compliance, and faster decisions.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => setModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b7ff77] px-6 py-3.5 text-sm font-bold text-[#051914] shadow-[0_0_30px_rgba(183,255,119,0.25)] transition hover:scale-[1.02]">
                Build export quote
                <ArrowRight size={17} />
              </button>
              <a href="#live-market" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/3 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-[#b7ff77] hover:text-[#b7ff77]">
                Explore live market
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 grid gap-3 sm:grid-cols-2 lg:max-w-xl">
              {["Certified origin", "Cold-chain visibility", "Buyer protection", "Farm-ready supply"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-[#d7efeb]">
                  <BadgeCheck className="text-[#b7ff77]" size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }} className="relative">
            <div className="soft-panel relative overflow-hidden rounded-[28px] p-5 shadow-[0_30px_80px_rgba(3,15,11,0.75)]">
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#b7ff77]/10 to-transparent" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#b7ff77]">Live commodity</p>
                    <h2 className="mt-2 text-2xl font-bold text-white">Hass Avocado</h2>
                  </div>
                  <span className="rounded-full border border-[#b7ff77]/35 bg-[#b7ff77]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#b7ff77]">
                    Verified
                  </span>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#0d201b]">
                  <img
                    src="https://images.unsplash.com/photo-1523095072531-62ce1b7e5d22?auto=format&fit=crop&w=1000&q=85"
                    alt="Hass avocado"
                    className="h-56 w-full object-cover"
                  />
                </div>

                <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#c9dcd4]">Origin</span>
                    <span className="font-semibold text-white">Kiambu County</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#c9dcd4]">Grade</span>
                    <span className="font-semibold text-white">A · 16–20 count</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#c9dcd4]">Price</span>
                    <span className="font-semibold text-[#b7ff77]">$2.80/kg</span>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-[#0b1d17] p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9dcd4]">Route</p>
                    <p className="mt-2 text-sm font-semibold">Sea freight via Mombasa</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#0b1d17] p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9dcd4]">Lead time</p>
                    <p className="mt-2 text-sm font-semibold">4.2 days average</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="border-y border-white/10 bg-[#0a1a14]">
        <div className="ticker-track mx-auto flex max-w-[1700px] gap-12 whitespace-nowrap px-4 py-4 text-xs font-medium uppercase tracking-[0.18em] text-[#b7ff77]">
          <span>Hass Avocado · 40ft Reefer · $2.80/kg</span>
          <span>Fine Beans · Air Freight · $3.60/kg</span>
          <span>Snow Peas · Rotterdam · $3.40/kg</span>
          <span>Farm verified · Traceable origin · Cold-chain monitored</span>
        </div>
      </div>

      <section id="sourcing-engine" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b7ff77]">Sourcing Engine</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
            Create a live export quote in under a minute.
          </h2>
          <p className="mt-3 text-[#cadad3]">
            Configure product quality, route, and delivery terms. Pricing is indicative and updated for real market signals.
          </p>
        </div>

        <div className="grid gap-5 rounded-[28px] border border-white/10 bg-white/[0.02] p-5 lg:grid-cols-[1.1fr_0.9fr] lg:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="relative block text-sm text-[#dfeae6]">
              Product type
              <select value={produce} onChange={(e) => setProduce(e.target.value)} className="mt-2 w-full appearance-none rounded-2xl border border-white/10 bg-[#0d201b] px-3 py-3.5 pr-10 text-white outline-none transition focus:border-[#b7ff77]">
                <option>Hass Avocado</option>
                <option>Fuerte Avocado</option>
                <option>Fine Beans</option>
                <option>Snow Peas</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-[58%] text-[#b7ff77]" size={16} />
            </label>

            <label className="relative block text-sm text-[#dfeae6]">
              Quality Grade
              <select value={grade} onChange={(e) => setGrade(e.target.value)} className="mt-2 w-full appearance-none rounded-2xl border border-white/10 bg-[#0d201b] px-3 py-3.5 pr-10 text-white outline-none transition focus:border-[#b7ff77]">
                <option>Grade A · Count 16–20 · DM 23%+</option>
                <option>Grade A · Count 18–22 · DM 21%+</option>
                <option>Premium export specification</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-[58%] text-[#b7ff77]" size={16} />
            </label>

            <label className="relative block text-sm text-[#dfeae6]">
              Shipping mode
              <select value={shipping} onChange={(e) => setShipping(e.target.value as keyof typeof routes)} className="mt-2 w-full appearance-none rounded-2xl border border-white/10 bg-[#0d201b] px-3 py-3.5 pr-10 text-white outline-none transition focus:border-[#b7ff77]">
                {Object.keys(routes).map((route) => (
                  <option key={route}>{route}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-[58%] text-[#b7ff77]" size={16} />
            </label>

            <label className="relative block text-sm text-[#dfeae6]">
              Incoterm
              <select value={incoterm} onChange={(e) => setIncoterm(e.target.value as keyof typeof terms)} className="mt-2 w-full appearance-none rounded-2xl border border-white/10 bg-[#0d201b] px-3 py-3.5 pr-10 text-white outline-none transition focus:border-[#b7ff77]">
                {Object.keys(terms).map((term) => (
                  <option key={term}>{term}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-[58%] text-[#b7ff77]" size={16} />
            </label>
          </div>

          <div className="rounded-[24px] border border-[#b7ff77]/30 bg-[#b7ff77]/10 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b7ff77]">Indicative landing price</p>
            <p className="mt-4 text-5xl font-black tracking-[-0.05em] text-white">
              ${estimate}
              <span className="ml-2 text-xl font-medium text-[#c9dcd4]">/kg</span>
            </p>
            <p className="mt-3 text-[#dfeae6]">Excludes taxes and destination-specific charges.</p>

            <div className="mt-6 space-y-3 text-sm text-[#dfeae6]">
              <div className="flex justify-between gap-4">
                <span>Route</span>
                <span className="font-medium text-white">{shipping}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Trade term</span>
                <span className="font-medium text-white">{incoterm}</span>
              </div>
            </div>

            <div className="mt-6 h-px bg-white/10" />

            <button onClick={whatsapp} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#b7ff77] px-5 py-3.5 text-sm font-bold text-[#071b15] shadow-[0_0_25px_rgba(183,255,119,0.25)] transition hover:scale-[1.01]">
              Start WhatsApp inquiry
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <section id="live-market" className="border-y border-white/10 bg-[#0a1a14]">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b7ff77]">Live market</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">Fresh supply, ready for export.</h2>
            </div>
            <button onClick={() => setModalOpen(true)} className="text-sm font-medium text-[#b7ff77] transition hover:text-white">
              View all live lots →
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product, index) => (
              <motion.article
                key={product.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.03]"
              >
                <img src={product.image} alt={product.name} className="h-52 w-full object-cover" />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-white">{product.name}</h3>
                      <p className="mt-1 text-[11px] text-[#b4c9c1]">{product.grade}</p>
                    </div>
                    <BadgeCheck className="text-[#b7ff77]" size={18} />
                  </div>

                  <div className="my-4 space-y-2 border-y border-white/10 py-3 text-[11px] text-[#c9dcd4]">
                    <div className="flex justify-between"><span>Origin</span><span>{product.origin}</span></div>
                    <div className="flex justify-between"><span>Supply</span><span>{product.tonnes}</span></div>
                    <div className="flex justify-between"><span>Harvest</span><span>{product.harvest}</span></div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.certs.map((cert) => (
                      <span key={cert} className="rounded-full border border-[#b7ff77]/25 bg-[#b7ff77]/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#b7ff77]">
                        {cert}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 text-base font-bold text-[#b7ff77]">{product.price}</p>
                  <button onClick={() => setModalOpen(true)} className="mt-4 w-full rounded-full border border-[#b7ff77]/40 bg-[#b7ff77]/10 px-4 py-2.5 text-sm font-semibold text-[#b7ff77] transition hover:bg-[#b7ff77] hover:text-[#081b14]">
                    Request sample / quote
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b7ff77]">From field to port</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              A farm-to-export operating model built for real-world freshness.
            </h2>
            <p className="mt-4 max-w-lg text-[#c9dcd4]">
              We connect production, quality, compliance, and route planning into one transparent platform for trusted produce trade.
            </p>
            <button onClick={() => setPortal("farmer")} className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#b7ff77]/30 bg-[#b7ff77]/10 px-5 py-3 text-sm font-semibold text-[#b7ff77] transition hover:bg-[#b7ff77] hover:text-[#061b14]">
              Register harvest availability
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {processSteps.map(({ icon: Icon, title, copy }) => (
              <div key={title} className="soft-panel rounded-[24px] p-5">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d201b] text-[#b7ff77]">
                  <Icon size={22} />
                </span>
                <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#c9dcd4]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="traceability" className="border-t border-white/10 bg-[#041711]">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b7ff77]">Traceability & compliance</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              Transparent trade, from farm verification to final delivery.
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {trustPillars.map(({ icon: Icon, title, text }) => (
              <div key={title} className="soft-panel rounded-[24px] p-6">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#b7ff77]/10 text-[#b7ff77]">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#c9dcd4]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="logistics" className="bg-[#b7ff77] text-[#061b14]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0a3625]">Logistics</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#061b14] sm:text-4xl lg:text-5xl">
              Deliver to your dock with full route visibility.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              [Plane, "Air freight", "JKIA gateway"],
              [Ship, "Sea freight", "Mombasa reefer"],
              [Truck, "Last mile", "Receiving dock"],
            ].map(([Icon, title, caption]) => (
              <div key={title} className="rounded-[24px] border border-[#061b14]/15 bg-[#0a2d23]/5 p-5">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#061b14]/10">
                  <Icon size={22} />
                </span>
                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm text-[#1c352d]">{caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="compliance" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="soft-panel rounded-[30px] p-8 text-center lg:p-14">
          <Globe2 className="mx-auto text-[#b7ff77]" size={34} />
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b7ff77]">Global trade portal</p>
          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
            Ready to turn East African supply into a competitive advantage?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#d5e8e0]">
            Connect with the eTunda desk for verified supplier access, export-ready specifications, and route pricing that moves with your market.
          </p>
          <button onClick={() => setModalOpen(true)} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#b7ff77] px-6 py-3.5 text-sm font-bold text-[#061b14] shadow-[0_0_30px_rgba(183,255,119,0.25)] transition hover:scale-[1.02]">
            Enter global trade portal
            <ArrowRight size={17} />
          </button>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-sm text-[#bfd2ca]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} eTunda Marketplace. Built for accountable global produce trade.</p>
          <p>Indicative pricing only · Subject to commercial confirmation</p>
        </div>
      </footer>

      <a
        onClick={whatsapp}
        role="button"
        aria-label="Contact eTunda on WhatsApp"
        className="fixed bottom-5 right-5 z-30 grid h-14 w-14 cursor-pointer place-items-center rounded-full bg-[#b7ff77] text-[#061b14] shadow-[0_0_35px_rgba(183,255,119,0.30)] transition hover:scale-105"
      >
        <span className="text-xl font-bold">✆</span>
      </a>

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 10 }} className="soft-panel relative w-full max-w-md rounded-[28px] p-7">
        <button onClick={close} aria-label="Close" className="absolute right-4 top-4 text-[#c9dcd4] hover:text-white">
          <X size={20} />
        </button>

        <Sparkles className="text-[#b7ff77]" size={26} />
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b7ff77]">Global trade portal</p>
        <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">Get live wholesale pricing.</h2>
        <p className="mt-3 text-sm text-[#c9dcd4]">Tell us where you buy and what you source. Your trade desk will respond with verified availability.</p>

        <form onSubmit={submit} className="mt-6 grid gap-3">
          <input required placeholder="Full name" className="rounded-2xl border border-white/10 bg-[#0d201b] px-3 py-3.5 text-sm text-white outline-none transition focus:border-[#b7ff77]" />
          <input required type="email" placeholder="Business email" className="rounded-2xl border border-white/10 bg-[#0d201b] px-3 py-3.5 text-sm text-white outline-none transition focus:border-[#b7ff77]" />
          <input required placeholder="Company / importing market" className="rounded-2xl border border-white/10 bg-[#0d201b] px-3 py-3.5 text-sm text-white outline-none transition focus:border-[#b7ff77]" />
          <button className="mt-2 rounded-full bg-[#b7ff77] px-5 py-3.5 text-sm font-bold text-[#061b14]">Request trade access</button>
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 10 }} className="soft-panel relative w-full max-w-lg rounded-[28px] p-7">
        <button onClick={close} aria-label="Close" className="absolute right-4 top-4 text-[#c9dcd4] hover:text-white">
          <X size={20} />
        </button>

        <MapPin className="text-[#b7ff77]" size={24} />
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b7ff77]">Farmer & field agent</p>
        <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">Register a harvest opportunity.</h2>
        <p className="mt-3 text-sm text-[#c9dcd4]">Mobile-first intake for farmer groups, aggregators, and field agents.</p>

        {done ? (
          <div className="mt-6 rounded-2xl border border-[#b7ff77]/25 bg-[#b7ff77]/10 p-5 text-sm text-[#dfeae6]">
            <p className="font-semibold text-[#b7ff77]">Harvest registration received.</p>
            <p className="mt-2">A trade desk agent will review and follow up through SMS or WhatsApp.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 grid gap-3 sm:grid-cols-2">
            <input required placeholder="Farmer / group name" className="input-aero sm:col-span-2" />
            <input required placeholder="Phone number" type="tel" className="input-aero" />
            <input required placeholder="County / location" className="input-aero" />
            <select className="input-aero">
              <option>Hass avocado</option>
              <option>Fuerte avocado</option>
              <option>Fine beans</option>
              <option>Snow peas</option>
              <option>Naturally dried commodity</option>
            </select>
            <input required placeholder="Estimated yield (kg)" type="number" min="1" className="input-aero" />
            <input required type="date" className="input-aero" />
            <button className="mt-2 rounded-full bg-[#b7ff77] px-5 py-3.5 text-sm font-bold text-[#061b14] sm:col-span-2">Register availability</button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}










































































































































































































