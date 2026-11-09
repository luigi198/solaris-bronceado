const SKELETON_ROWS = 4;

export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando" className="space-y-3 motion-safe:animate-pulse">
      <div className="h-8 w-48 rounded bg-slate-200 mb-6" />
      {Array.from({ length: SKELETON_ROWS }, (_, i) => (
        <div key={i} className="h-20 rounded-xl bg-slate-200" />
      ))}
    </div>
  );
}
