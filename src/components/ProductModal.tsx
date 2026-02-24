import { useEffect, useMemo, useState } from "react";
import type { Product } from "../types/product";

type ProductModalProps = {
  product: Product;
  onClose: () => void;
};

export function ProductModal({ product, onClose }: ProductModalProps) {
  const images = useMemo(() => {
    const all = [product.thumbnail, ...(product.images ?? [])];
    return Array.from(new Set(all));
  }, [product.thumbnail, product.images]);

  const [activeImage, setActiveImage] = useState(images[0]);

  // برای fade-out قبل از unmount
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setActiveImage(images[0]);
  }, [images]);

  useEffect(() => {
    // یک tick برای trigger transition
    const t = window.setTimeout(() => setIsOpen(true), 10);
    return () => window.clearTimeout(t);
  }, []);

  const requestClose = () => {
    setIsOpen(false);
    // مدت باید با duration ها یکی باشه
    window.setTimeout(() => onClose(), 180);
  };

  // بستن با ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const oldPrice = product.discountPercentage
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(1)
    : null;

  return (
    <div
      className={[
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "bg-black/40 backdrop-blur-[2px]",
        "transition-opacity duration-180",
        isOpen ? "opacity-100" : "opacity-0",
      ].join(" ")}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={[
          "w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden",
          "bg-white text-gray-900 border border-gray-100",
          "dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800",
          "transform transition-all duration-180",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-[0.98] translate-y-2",
        ].join(" ")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Gallery */}
          <div className="p-6">
            <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 flex items-center justify-center">
              <img
                src={activeImage}
                alt={product.title}
                className="h-72 w-full object-contain"
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
                      "h-16 w-16 rounded-xl border overflow-hidden",
                      "bg-white dark:bg-slate-900",
                      isActive
                        ? "border-gray-900 dark:border-slate-200"
                        : "border-gray-200 dark:border-slate-700",
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
          <div className="p-6 border-t md:border-t-0 md:border-l border-gray-100 dark:border-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-gray-400 dark:text-slate-400">
                  {product.category}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <h2 className="text-2xl font-bold">{product.title}</h2>

                  {product.stock > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      In Stock
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-slate-300">
                  <span>⭐ {product.rating}</span>
                  <span className="text-gray-300 dark:text-slate-600">|</span>
                  <span>{product.brand}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={requestClose}
                className="h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center justify-center"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className="mt-4 text-gray-600 dark:text-slate-300 leading-7">
              {product.description}
            </p>

            <div className="mt-6 flex items-end gap-3">
              {product.discountPercentage ? (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-900 text-white dark:bg-slate-100 dark:text-slate-900">
                  {Math.round(product.discountPercentage)}%
                </span>
              ) : null}

              {oldPrice ? (
                <span className="text-sm text-gray-400 dark:text-slate-400 line-through">
                  ${oldPrice}
                </span>
              ) : null}

              <span className="text-3xl font-bold">${product.price}</span>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="flex-1 h-12 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                onClick={() => alert("Added to cart (demo)")}
              >
                ADD TO CART
              </button>

              <button
                type="button"
                className="h-12 w-12 rounded-xl border border-gray-200 hover:bg-gray-50 transition dark:border-slate-700 dark:hover:bg-slate-800"
                aria-label="Add to wishlist"
              >
                ♡
              </button>
            </div>

            <div className="mt-6 rounded-xl border border-gray-100 dark:border-slate-800 p-4 text-sm text-gray-600 dark:text-slate-300 space-y-2">
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
