"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-on-background p-4">
      <div className="bg-surface border border-surface-variant rounded-3xl p-8 max-w-md w-full text-center flex flex-col items-center gap-6 shadow-sm">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-error" />
        </div>
        
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold font-headline-md text-on-surface">Something went wrong!</h2>
          <p className="text-on-surface-variant text-sm">
            An unexpected error occurred while processing your request. We&apos;ve been notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-4 bg-primary text-on-primary rounded-xl font-bold transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="flex-1 py-3 px-4 bg-surface-variant text-on-surface-variant rounded-xl font-bold transition-colors hover:bg-surface-variant/80 text-center"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
