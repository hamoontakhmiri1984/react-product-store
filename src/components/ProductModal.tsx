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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setActiveImage(images[0]);
  }, [images]);

  useEffect(() => {
    const t = window.setTimeout(() => setIsOpen(true), 10);
    return () => window.clearTimeout(t);
  }, []);

  const requestClose = () => {
    setIsOpen(false);
    window.setTimeout(() => onClose(), 200);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const oldPrice = product.discountPercentage
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(1)
    : null;

  return (
    <div
      className={[
        "fixed inset-0 z-50",
        "bg-black/40 backdrop-blur-[2px]",
        "transition-opacity duration-200",
        isOpen ? "opacity-100" : "opacity-0",
      ].join(" ")}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      {/* container */}
      <div className="fixed inset-0 flex items-start md:items-center justify-center p-4 overflow-y-auto">
        <div
          className={[
            "w-full max-w-4xl",
            "bg-white dark:bg-slate-900",
            "rounded-2xl shadow-2xl",
            "border border-gray-100 dark:border-slate-800",
            "transform transition-all duration-200",
            isOpen
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-[0.98]",
            "max-h-[95vh] overflow-y-auto",
          ].join(" ")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left */}
            <div className="p-5 md:p-6">
              <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 flex items-center justify-center">
                <img
                  src={activeImage}
                  alt={product.title}
                  className="h-64 md:h-72 w-full object-contain"
                />
              </div>

              <div className="mt-4 flex gap-3 flex-wrap">
                {images.slice(0, 4).map((img) => {
                  const isActive = img === activeImage;
                  return (
                    <button
                      key={img}
                      onClick={() => setActiveImage(img)}
                      className={[
                        "h-14 w-14 md:h-16 md:w-16 rounded-xl border overflow-hidden",
                        isActive
                          ? "border-gray-900 dark:border-slate-200"
                          : "border-gray-200 dark:border-slate-700",
                      ].join(" ")}
                    >
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right */}
            <div className="p-5 md:p-6 border-t md:border-t-0 md:border-l border-gray-100 dark:border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-400 dark:text-slate-400">
                    {product.category}
                  </p>

                  <h2 className="text-xl md:text-2xl font-bold mt-1">
                    {product.title}
                  </h2>

                  <div className="mt-2 text-sm text-gray-600 dark:text-slate-300">
                    ⭐ {product.rating} · {product.brand}
                  </div>
                </div>

                <button
                  onClick={requestClose}
                  className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <p className="mt-4 text-sm md:text-base text-gray-600 dark:text-slate-300 leading-6">
                {product.description}
              </p>

              <div className="mt-6 flex items-end gap-3">
                {product.discountPercentage && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-900 text-white dark:bg-slate-100 dark:text-slate-900">
                    {Math.round(product.discountPercentage)}%
                  </span>
                )}

                {oldPrice && (
                  <span className="text-sm line-through text-gray-400">
                    ${oldPrice}
                  </span>
                )}

                <span className="text-2xl md:text-3xl font-bold">
                  ${product.price}
                </span>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 h-11 md:h-12 rounded-xl bg-gray-900 text-white font-semibold dark:bg-slate-100 dark:text-slate-900">
                  ADD TO CART
                </button>

                <button className="h-11 w-11 md:h-12 md:w-12 rounded-xl border border-gray-200 dark:border-slate-700">
                  ♡
                </button>
              </div>

              <div className="mt-6 text-sm text-gray-600 dark:text-slate-300 space-y-2">
                <div>🚚 Ships in 2 weeks</div>
                <div>🛡️ 3 year warranty</div>
                <div>↩️ 7 day return</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
