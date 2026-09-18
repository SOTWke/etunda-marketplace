import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "eTunda Marketplace | B2B Agritech Supply",
  description:
    "Verified agribusiness marketplace for East African produce, export pricing, sourcing, and trade visibility.",
  metadataBase: new URL("https://etunda-marketplace.vercel.app"),
  openGraph: {
    title: "eTunda Marketplace",
    description: "Export-ready produce marketplace for farmers, buyers, and traders.",
    siteName: "eTunda Marketplace",
    type: "website",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90' fill='%23b7ff77'>🌾</text></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#061b14] text-white antialiased">{children}</body>
    </html>
  );
}
