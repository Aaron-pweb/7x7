import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-on-background p-4">
      <div className="bg-surface border border-surface-variant rounded-3xl p-8 max-w-md w-full text-center flex flex-col items-center gap-6 shadow-sm">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <SearchX className="w-8 h-8 text-primary" />
        </div>
        
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold font-headline-md text-on-surface">Page Not Found</h2>
          <p className="text-on-surface-variant text-sm">
            We couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="w-full mt-2 py-3 px-4 bg-primary text-on-primary rounded-xl font-bold transition-colors hover:bg-primary/90 text-center"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
