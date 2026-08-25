"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, LayoutDashboard, PlusCircle, ArrowLeft, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayoutClient({ children, userEmail }: { children: React.ReactNode, userEmail: string }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const renderSidebarContent = () => (
    <>
      <div className="mb-10 flex flex-col gap-2">
        <h1 className="text-2xl font-bold font-headline-md tracking-tight">Admin</h1>
        <p className="text-sm text-on-surface-variant truncate">{userEmail}</p>
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        <Link href="/admin" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-variant/50 transition-colors">
          <LayoutDashboard className="w-5 h-5 text-primary" />
          <span className="font-medium text-on-surface">Overview</span>
        </Link>
        <Link href="/admin/challenges" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-variant/50 transition-colors">
          <PlusCircle className="w-5 h-5 text-primary" />
          <span className="font-medium text-on-surface">Challenges</span>
        </Link>
        <Link href="/admin/users" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-variant/50 transition-colors">
          <Users className="w-5 h-5 text-primary" />
          <span className="font-medium text-on-surface">Users</span>
        </Link>
      </nav>

      <div className="mt-auto pt-6 border-t border-surface-variant">
        <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-variant/50 transition-colors text-on-surface-variant hover:text-on-surface">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Exit Admin</span>
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background text-on-background">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-surface-variant sticky top-0 bg-background z-50 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <h1 className="font-bold text-lg">Admin Panel</h1>
        <button onClick={() => setIsMobileOpen(true)} className="p-2 -mr-2 text-on-surface-variant hover:text-on-background">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-surface-variant flex-col p-6 sticky top-0 h-screen overflow-y-auto bg-surface/30">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: "-100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="md:hidden fixed inset-y-0 left-0 w-[80vw] max-w-xs bg-background border-r border-surface-variant p-6 z-[101] flex flex-col pt-[calc(env(safe-area-inset-top)+1.5rem)] overflow-y-auto"
            >
              <button onClick={() => setIsMobileOpen(false)} className="absolute top-[calc(env(safe-area-inset-top)+1rem)] right-4 p-2 text-on-surface-variant hover:text-on-background">
                <X className="w-6 h-6" />
              </button>
              {renderSidebarContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-10 overflow-y-auto w-full pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        <div className="max-w-5xl mx-auto w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
