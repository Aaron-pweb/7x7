import { ShaderBackground } from "@/components/ShaderBackground";

export default function DashboardLoading() {
  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-background text-on-background">
      <ShaderBackground />
      <header className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-6xl">
        <div className="h-14 md:h-16 rounded-full bg-surface/75 backdrop-blur-2xl border border-primary/10 animate-pulse" />
      </header>

      <main className="flex-grow flex flex-col items-center relative z-10 px-4 md:px-8 pt-[100px] md:pt-[130px] pb-16 w-full max-w-5xl mx-auto gap-10 md:gap-14">
        
        {/* Active Challenges Skeleton */}
        <section className="w-full">
          <div className="h-8 w-48 bg-surface-variant/50 animate-pulse rounded-md mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface/30 rounded-3xl border border-white/5 p-6 h-[220px] animate-pulse"></div>
            <div className="bg-surface/30 rounded-3xl border border-white/5 p-6 h-[220px] animate-pulse hidden md:block"></div>
          </div>
        </section>

        {/* Discover Challenges Skeleton */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 w-56 bg-surface-variant/50 animate-pulse rounded-md"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface/30 rounded-2xl border border-white/5 p-5 h-[180px] animate-pulse"></div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
