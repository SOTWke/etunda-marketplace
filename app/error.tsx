"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="max-w-md text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
            eTunda Marketplace
          </p>
          <h1 className="text-3xl font-bold">Something went wrong</h1>
          <p className="mt-4 text-sm text-slate-300">
            We hit an unexpected issue while loading the platform. Please try again.
          </p>
          <button
            onClick={reset}
            className="mt-6 rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
