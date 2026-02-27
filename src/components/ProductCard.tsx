import type { Product } from "../types/product";
import { useCartStore } from "../store/useCartStore";

type ProductCardProps = {
  product: Product;
  onClick?: (product: Product) => void;
};

export function ProductCard({ product, onClick }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div
      className="rounded-xl shadow hover:shadow-md transition text-left overflow-hidden flex flex-col h-full
                 bg-white text-gray-900 border border-gray-100
                 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800"
    >
      {/* clickable area */}
      <button
        type="button"
        onClick={() => onClick?.(product)}
        className="flex flex-col flex-1 text-left"
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

      {/* Add to Cart button */}
      <div className="p-4 pt-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart({
              id: product.id,
              title: product.title,
              price: product.price,
              thumbnail: product.thumbnail,
            });
          }}
          className=" w-full py-2 rounded-lg  bg-black text-white  hover:bg-gray-800  active:scale-95  
          transition-all duration-200 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
