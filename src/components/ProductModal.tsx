import { useEffect, useMemo, useState } from "react";
import type { Product } from "../types/product";

type ProductModalProps = {
  product: Product;
  onClose: () => void;
};

export function ProductModal({ product, onClose }: ProductModalProps) {
  const images = useMemo(() => {
    // thumbnail رو هم اول لیست بذار که همیشه باشه
    const all = [product.thumbnail, ...(product.images ?? [])];
    // حذف تکراری‌ها
    return Array.from(new Set(all));
  }, [product.thumbnail, product.images]);

  const [activeImage, setActiveImage] = useState(images[0]);

  useEffect(() => {
    setActiveImage(images[0]);
  }, [images]);

  // بستن با ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const oldPrice = product.discountPercentage
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(1)
    : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        // کلیک روی بک‌دراپ ببنده (ولی کلیک داخل مودال نه)
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Gallery */}
          <div className="p-6">
            <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-center">
              <img
                src={activeImage}
                alt={product.title}
                className="h-72 object-contain"
              />
            </div>

            <div className="mt-4 flex gap-3">
              {images.slice(0, 4).map((img) => {
                const isActive = img === activeImage;
                return (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={[
                      "h-16 w-16 rounded-xl border bg-white overflow-hidden",
                      isActive ? "border-gray-900" : "border-gray-200",
                    ].join(" ")}
                    aria-label="Select product image"
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Info */}
          <div className="p-6 border-t md:border-t-0 md:border-l border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-gray-400">{product.category}</p>
                <div className="flex items-center gap-2 mt-1">
                  <h2 className="text-2xl font-bold">{product.title}</h2>
                  {product.stock > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                      In Stock
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <span>⭐ {product.rating}</span>
                  <span className="text-gray-300">|</span>
                  <span>{product.brand}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="h-10 w-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className="mt-4 text-gray-600 leading-7">
              {product.description}
            </p>

            <div className="mt-6 flex items-end gap-3">
              {product.discountPercentage ? (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-900 text-white">
                  {Math.round(product.discountPercentage)}%
                </span>
              ) : null}

              {oldPrice ? (
                <span className="text-sm text-gray-400 line-through">
                  ${oldPrice}
                </span>
              ) : null}

              <span className="text-3xl font-bold">${product.price}</span>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="flex-1 h-12 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition"
                onClick={() => alert("Added to cart (demo)")}
              >
                ADD TO CART
              </button>

              <button
                type="button"
                className="h-12 w-12 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
                aria-label="Add to wishlist"
              >
                ♡
              </button>
            </div>

            <div className="mt-6 rounded-xl border border-gray-100 p-4 text-sm text-gray-600 space-y-2">
              <div className="flex items-center gap-2">
                <span>🚚</span>
                <span>Shipping Information: Ships in 2 weeks</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🛡️</span>
                <span>Warranty Information: 3 year warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <span>↩️</span>
                <span>Return Policy: 7 days return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
