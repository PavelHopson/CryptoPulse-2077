import type { Metadata, Viewport } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const orbitron = Orbitron({ 
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const rajdhani = Rajdhani({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#05000a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "CryptoPulse 2077",
  description: "High-fidelity cyberpunk margin trading simulator",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        "min-h-screen bg-background font-rajdhani antialiased",
        orbitron.variable,
        rajdhani.variable
      )}>
        <div className="scanlines" />
        <div className="noise" />
        <div className="relative z-10 h-screen flex flex-col">
           {children}
        </div>
      </body>
    </html>
  );
}