import { AuthForm } from "./AuthForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background text-on-background px-4 py-6 relative overflow-hidden">
      {/* Background Orbs - CRITICAL: pointer-events-none to prevent Safari touch interception */}
      <div className="absolute pointer-events-none -top-1/4 -right-1/4 w-full h-full max-w-3xl max-h-[800px] bg-primary/10 rounded-full mix-blend-multiply filter blur-[120px]" />
      <div className="absolute pointer-events-none -bottom-1/4 -left-1/4 w-full h-full max-w-3xl max-h-[800px] bg-primary-container/20 rounded-full mix-blend-multiply filter blur-[120px]" />
      
      <div className="w-full max-w-md bg-surface sm:bg-surface/95 sm:backdrop-blur-3xl border border-primary/20 p-6 sm:p-10 relative flex flex-col rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:shadow-[0_20px_60px_-15px_rgba(167,50,28,0.15)] z-10">
        <Suspense fallback={<div className="h-48 flex items-center justify-center text-on-surface-variant">Loading...</div>}>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}
