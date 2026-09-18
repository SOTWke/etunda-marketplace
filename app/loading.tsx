export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
        <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Loading eTunda</p>
      </div>
    </div>
  );
}
