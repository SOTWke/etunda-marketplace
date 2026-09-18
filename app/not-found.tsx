export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">404</p>
        <h1 className="mt-4 text-4xl font-bold">Page not found</h1>
        <p className="mt-4 text-sm text-slate-300">
          The page you are looking for doesn’t exist or has moved.
        </p>
        <a
          href="/"
          className="mt-6 inline-block rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}
