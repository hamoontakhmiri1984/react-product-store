import type { Product } from "../types/product";

type ProductCardProps = {
  product: Product;
  onClick?: (product: Product) => void;
};

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(product)}
      className="rounded-xl shadow hover:shadow-md transition text-left overflow-hidden flex flex-col h-full
                 bg-white text-gray-900 border border-gray-100
                 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800"
    >
      {/* image frame */}
      <div className="h-44 bg-gray-50 flex items-center justify-center p-3 dark:bg-slate-800">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      {/* body */}
      <div className="p-4 flex flex-col flex-1">
        <h2 className="font-semibold line-clamp-2 min-h-40px">
          {product.title}
        </h2>

        <div className="mt-auto pt-2">
          <p className="text-gray-600 font-medium dark:text-slate-300">
            ${product.price}
          </p>
        </div>
      </div>
    </button>
  );
}
