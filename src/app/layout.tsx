import type { Metadata } from "next";
import { Inter, Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const caveat = Caveat({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: "7x7 Journal | A Minimalist Approach to Self-Reflection",
  description: "Ten days of disciplined, identical questions yielding transformative insights.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${caveat.variable} antialiased selection:bg-primary/20 selection:text-primary`}>
      <body className="min-h-screen bg-background text-on-background">
        {children}
      </body>
    </html>
  );
}
