type ProductGridSkeletonProps = {
  count?: number;
};

export function ProductGridSkeleton({ count = 12 }: ProductGridSkeletonProps) {
  const safeCount = Math.max(0, count);

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {Array.from({ length: safeCount }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl shadow animate-pulse overflow-hidden flex flex-col h-full
                     bg-white border border-gray-100
                     dark:bg-slate-900 dark:border-slate-800"
        >
          <div className="h-44 bg-gray-200 dark:bg-slate-800/60" />

          <div className="p-4 flex flex-col flex-1">
            <div className="h-4 bg-gray-200 dark:bg-slate-800/60 rounded w-3/4 mb-3" />
            <div className="h-4 bg-gray-200 dark:bg-slate-800/60 rounded w-1/3 mt-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}
