import type { Config } from "tailwindcss";
const config: Config = { content: ["./app/**/*.{js,ts,jsx,tsx}"], theme: { extend: { colors: { aero: { base: "#0D1F17", neon: "#00FF87", slate: "#A0AEC0" } }, boxShadow: { glow: "0 0 32px rgba(0,255,135,.28)" } } }, plugins: [] };
export default config;
