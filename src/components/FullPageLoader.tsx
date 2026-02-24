export function FullPageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-gray-900 animate-spin
                        dark:border-slate-700 dark:border-t-slate-100"
        />
        <p className="text-sm text-gray-600 dark:text-slate-300">
          Loading products...
        </p>
      </div>
    </div>
  );
}
