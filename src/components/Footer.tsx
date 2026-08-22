import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="w-full border-t border-surface-variant bg-background/50 backdrop-blur-md py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Brand */}
        <div className="flex flex-col gap-4 items-center md:items-start">
          <Link href="/" className="inline-block transition-transform duration-200 hover:scale-[1.02]">
            <Logo className="h-10 md:h-12 w-auto" />
          </Link>
          <p className="text-[14px] text-secondary max-w-xs mx-auto md:mx-0">
            A minimalist approach to self-reflection. Ten days of disciplined, identical questions yielding transformative insights.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          <span className="font-label-caps text-[12px] uppercase tracking-widest text-on-surface-variant">Legal</span>
          <Link href="#" className="text-[14px] text-secondary hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="#" className="text-[14px] text-secondary hover:text-primary transition-colors">Terms of Service</Link>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <span className="font-label-caps text-[12px] uppercase tracking-widest text-on-surface-variant">Connect</span>
          <Link href="mailto:hello@7x7journal.com" className="text-[14px] text-secondary hover:text-primary transition-colors">hello@7x7journal.com</Link>
          <Link href="#" className="text-[14px] text-secondary hover:text-primary transition-colors">Twitter (X)</Link>
        </div>

      </div>

    </footer>
  );
}
