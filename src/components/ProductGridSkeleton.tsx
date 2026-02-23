type ProductGridSkeletonProps = {
  count?: number;
};

export function ProductGridSkeleton({ count = 12 }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-xl shadow animate-pulse">
          <div className="w-full h-40 bg-gray-200 rounded-lg mb-3" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}
