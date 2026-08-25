import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-playfair" });
const caveat = Caveat({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-caveat" });

export const viewport: Viewport = {
  themeColor: "#A7321C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "7x7 Journal | A Minimalist Approach to Self-Reflection",
  description: "Ten days of disciplined, identical questions yielding transformative insights.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "7x7 Journal",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${caveat.variable} antialiased selection:bg-primary/20 selection:text-primary`}>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/eruda" async></script>
        <script dangerouslySetInnerHTML={{ __html: 'window.onload = function () { if (typeof eruda !== "undefined") eruda.init(); }' }}></script>
      </head>
      <body className="min-h-screen bg-background text-on-background">
        {children}
      </body>
    </html>
  );
}
