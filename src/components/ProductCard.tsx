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
      className="bg-white p-4 rounded-xl shadow hover:shadow-md transition text-left"
    >
      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-full h-40 object-cover rounded-lg mb-3"
        loading="lazy"
      />
      <h2 className="font-semibold line-clamp-1">{product.title}</h2>
      <p className="text-gray-600">${product.price}</p>
    </button>
  );
}
