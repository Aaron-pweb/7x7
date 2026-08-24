import { ShaderBackground } from "@/components/ShaderBackground";

export default function DashboardLoading() {
  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-background text-on-background">
      <ShaderBackground />
      <header className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-6xl">
        <div className="h-14 md:h-16 rounded-full bg-surface/75 backdrop-blur-2xl border border-primary/10 animate-pulse" />
      </header>

      <main className="flex-grow flex flex-col items-center relative z-10 px-4 md:px-8 pt-[100px] md:pt-[130px] pb-16 w-full max-w-5xl mx-auto gap-10 md:gap-14">
        <section className="w-full flex flex-col gap-4 text-left">
          <div className="w-32 h-4 bg-primary/20 rounded animate-pulse" />
          <div className="w-64 h-10 bg-on-surface/10 rounded-lg animate-pulse" />
          <div className="w-full max-w-xl h-6 bg-on-surface-variant/10 rounded animate-pulse" />
        </section>

        <div className="w-full h-[400px] rounded-2xl md:rounded-3xl bg-surface/40 backdrop-blur-xl border border-primary/10 animate-pulse" />
      </main>
    </div>
  );
}
