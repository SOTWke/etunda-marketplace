"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BadgeCheck, Check, ChevronDown, ClipboardCheck, Container, Factory, FileCheck2, Globe2, Leaf, MapPin, Menu, MessageCircle, Plane, ShieldCheck, Ship, Sparkles, Sun, ThermometerSnowflake, Truck, Wheat, X } from "lucide-react";

const products = [
  { name: "Hass Avocado", grade: "Grade A · Count 16–20", origin: "Kiambu County, Kenya", harvest: "Harvested 18 Jun", tonnes: "24.0 tonnes", certs: ["GlobalG.A.P", "HACCP"], price: "$2.80/kg CIF Dubai", image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=1000&q=85" },
  { name: "Fine Beans", grade: "Extra Fine · 150–180mm", origin: "Nairobi County, Kenya", harvest: "Harvested today", tonnes: "8.5 tonnes", certs: ["SMETA", "KEPHIS"], price: "$3.60/kg CIF Amsterdam", image: "https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=1000&q=85" },
  { name: "Snow Peas", grade: "Premium · Sugar Snap", origin: "Nyeri County, Kenya", harvest: "Harvested 17 Jun", tonnes: "6.2 tonnes", certs: ["GlobalG.A.P", "HACCP"], price: "$3.40/kg CIF Rotterdam", image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=1000&q=85" },
  { name: "Fuerte Avocado", grade: "Export · Count 18–22", origin: "Murang’a County, Kenya", harvest: "Harvested 16 Jun", tonnes: "18.0 tonnes", certs: ["GlobalG.A.P", "KEPHIS"], price: "$2.40/kg CIF Dubai", image: "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?auto=format&fit=crop&w=1000&q=85" },
];

const routes = { "Air Freight via JKIA": 1.45, "Sea Freight 40ft Reefer via Mombasa": 0.32 };
const terms = { EXW: 0, "FOB Mombasa": 0.16, "CIF Rotterdam": 0.81, "CIF Dubai": 0.57 };

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false); const [modalOpen, setModalOpen] = useState(false);
  const [portal, setPortal] = useState<"trade" | "farmer" | null>(null);
  const [produce, setProduce] = useState("Hass Avocado"); const [grade, setGrade] = useState("Grade A · Count 16–20 · DM 23%+"); const [shipping, setShipping] = useState<keyof typeof routes>("Sea Freight 40ft Reefer via Mombasa"); const [incoterm, setIncoterm] = useState<keyof typeof terms>("CIF Dubai");
  const estimate = useMemo(() => { const base = produce.includes("Hass") ? 1.91 : produce.includes("Fuerte") ? 1.63 : produce.includes("Fine") ? 2.12 : 2.05; return (base + routes[shipping] + terms[incoterm]).toFixed(2); }, [produce, shipping, incoterm]);
  const whatsapp = () => { const text = `Hello eTunda, I would like an export quote for ${produce} (${grade}), ${shipping}, ${incoterm}. Estimated price shown: $${estimate}/kg.`; window.open(`https://wa.me/254784972601?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer"); };
  return <main className="overflow-hidden bg-aero-base">
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#0D1F17]/80 backdrop-blur-xl"><div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">[...]
    <section id="top" className="grid-bg relative pt-20">[...]
    <div className="overflow-hidden border-y border-aero-neon/20 bg-aero-neon/10 py-3"><div className="ticker flex w-max gap-12 whitespace-nowrap text-xs font-medium text-aero-neon"><span>HASS AVOCADO · FINE BEANS · SNOW PEAS · TRACEABLE EAST AFRICAN SUPPLY</span><span>HASS AVOCADO · FINE BEANS · SNOW PEAS · TRACEABLE EAST AFRICAN SUPPLY</span></div></div>
    <section id="sourcing-engine" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">[...]</section>
    <section id="live-market" className="border-y border-white/10 bg-[#0a1a14]">[...]</section>
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">[...]</section>
    <section id="traceability" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">[...]</section>
    <section id="logistics" className="bg-aero-neon px-5 py-20 text-aero-base">[...]</section>
    <section id="compliance" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">[...]</section>
    <footer className="border-t border-white/10 px-5 py-9 text-xs text-aero-slate"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row lg:px-8"><p>© {new Date().getFullYear()} eTunda Marketplace. Built for accountable global produce trade.</p><p>Indicative price data only · Subject to commercial confirmation</p></div></footer>
    <a href="https://wa.me/254784972601" target="_blank" rel="noopener noreferrer" onClick={whatsapp} role="button" aria-label="Contact eTunda on WhatsApp" className="fixed bottom-5 right-5 z-30 grid h-14 w-14 cursor-pointer place-items-center rounded-full bg-aero-neon text-aero-base shadow-glow transition hover:scale-105"><span className="text-xl font-bold">✆</span></a>
    <AnimatePresence>{modalOpen&&<TradeModal close={()=>setModalOpen(false)}/>} {portal==="farmer"&&<FarmerModal close={()=>setPortal(null)}/>}</AnimatePresence>
  </main>;
}

function TradeModal({close}:{close:()=>void}) { const submit=(e:FormEvent)=>{e.preventDefault(); close();}; return <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">[...]</motion.div> }

function FarmerModal({close}:{close:()=>void}) { const [done,setDone]=useState(false); const submit=(e:FormEvent)=>{e.preventDefault();setDone(true)}; return <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">[...]</motion.div> }
