export default function Loading({ label = 'Loading' }) {
  return (
    <div className="flex min-h-48 items-center justify-center gap-3 text-sm font-semibold text-slate-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      {label}
    </div>
  );
}

