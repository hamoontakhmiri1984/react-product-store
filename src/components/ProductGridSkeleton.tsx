type ProductGridSkeletonProps = {
  count?: number;
};

export function ProductGridSkeleton({ count = 12 }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow animate-pulse overflow-hidden flex flex-col h-full"
        >
          {/* image frame (same height as ProductCard) */}
          <div className="h-44 bg-gray-200" />

          <div className="p-4 flex flex-col flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-4 bg-gray-200 rounded w-1/3 mt-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}
