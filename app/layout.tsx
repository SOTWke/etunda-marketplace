import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "eTunda Marketplace - B2B Agritech",
  description: "Global agricultural trade platform for farmers, buyers, and suppliers",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90' fill='%23059669'>🌾</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
