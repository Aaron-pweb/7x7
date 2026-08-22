import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const merriweather = Merriweather({ weight: ["300", "400", "700"], subsets: ["latin"], variable: "--font-merriweather" });

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
    <html lang="en" className={`${inter.variable} ${merriweather.variable} antialiased selection:bg-primary/20 selection:text-primary`}>
      <body className="min-h-screen bg-background text-on-background">
        {children}
      </body>
    </html>
  );
}
