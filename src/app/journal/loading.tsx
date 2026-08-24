import { ShaderBackground } from "@/components/ShaderBackground";

export default function JournalLoading() {
  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-background text-on-background">
      <ShaderBackground />
      <main className="flex-grow flex flex-col items-center justify-center relative z-10 px-4 md:px-8 w-full max-w-5xl mx-auto">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center animate-pulse">
          <div className="w-full flex items-center justify-between mb-12">
            <div className="w-20 h-4 bg-on-surface/10 rounded" />
            <div className="flex gap-2">
              <div className="w-8 h-1.5 rounded-full bg-primary/50" />
              <div className="w-2 h-1.5 rounded-full bg-white/10" />
              <div className="w-2 h-1.5 rounded-full bg-white/10" />
            </div>
            <div className="w-[80px]" />
          </div>
          
          <div className="w-full relative h-[400px] flex flex-col">
            <div className="w-32 h-4 bg-primary/20 rounded mb-4" />
            <div className="w-3/4 h-10 bg-on-surface/10 rounded mb-8" />
            <div className="w-full h-12 bg-white/5 rounded border-b-2 border-white/10" />
          </div>
        </div>
      </main>
    </div>
  );
}
