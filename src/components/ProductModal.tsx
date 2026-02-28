import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product } from "../features/products/types";
import { useCartStore } from "../store/useCartStore";

type ProductModalProps = {
  product: Product;
  onClose: () => void;
};

export function ProductModal({ product, onClose }: ProductModalProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const images = useMemo(() => {
    const all = [product.thumbnail, ...(product.images ?? [])];
    return Array.from(new Set(all));
  }, [product.thumbnail, product.images]);

  const [activeImage, setActiveImage] = useState(product.thumbnail);
  const [isOpen, setIsOpen] = useState(false);

  // Reset image when product changes
  // useEffect(() => {
  //   setActiveImage(product.thumbnail);
  // }, [product.thumbnail]);

  // Animate in
  useEffect(() => {
    const t = window.setTimeout(() => setIsOpen(true), 10);
    return () => window.clearTimeout(t);
  }, []);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const requestClose = useCallback(() => {
    setIsOpen(false);
    window.setTimeout(onClose, 200);
  }, [onClose]);

  // Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [requestClose]);

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }),
    [],
  );

  const oldPrice = product.discountPercentage
    ? product.price / (1 - product.discountPercentage / 100)
    : null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start md:items-center justify-center
      p-2 md:p-4 overflow-y-auto
      bg-black/40 backdrop-blur-[2px]
      transition-opacity duration-200
      ${isOpen ? "opacity-100" : "opacity-0"}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <div
        className={`w-full
        max-w-full md:max-w-4xl
        min-h-[95vh] md:min-h-0
        max-h-[95vh] overflow-y-auto
        rounded-none md:rounded-2xl
        shadow-xl
        bg-white text-gray-900 border border-gray-100
        dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800
        transform transition-all duration-200
        ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* LEFT */}
          <div className="p-4 md:p-6">
            <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4 md:p-6 flex items-center justify-center">
              <img
                src={activeImage}
                alt={product.title}
                className="h-52 md:h-72 w-full object-contain"
              />
            </div>

            <div className="mt-4 flex gap-3 flex-wrap">
              {images.slice(0, 4).map((img) => {
                const active = img === activeImage;
                return (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    aria-label="Select image"
                    className={`h-14 w-14 md:h-16 md:w-16 rounded-xl overflow-hidden
                      border transition
                      ${
                        active
                          ? "ring-2 ring-gray-900 dark:ring-slate-200 border-transparent"
                          : "border-gray-200 dark:border-slate-700"
                      }`}
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

          {/* RIGHT */}
          <div className="p-4 md:p-6 border-t md:border-t-0 md:border-l border-gray-100 dark:border-slate-800">
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
                type="button"
                onClick={requestClose}
                aria-label="Close"
                className="h-9 w-9 md:h-10 md:w-10 rounded-full
                hover:bg-gray-100 dark:hover:bg-slate-800
                flex items-center justify-center
                focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                ✕
              </button>
            </div>

            <p className="mt-4 text-sm md:text-base text-gray-600 dark:text-slate-300 leading-6 md:leading-7">
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
                  {priceFormatter.format(oldPrice)}
                </span>
              )}

              <span className="text-2xl md:text-3xl font-bold">
                {priceFormatter.format(product.price)}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() =>
                  addToCart({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    thumbnail: product.thumbnail,
                  })
                }
                className="flex-1 h-11 md:h-12 rounded-xl
                bg-gray-900 text-white font-semibold
                hover:bg-gray-800 active:scale-95
                transition-all duration-200
                dark:bg-slate-100 dark:text-slate-900
                dark:hover:bg-slate-200
                focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                ADD TO CART
              </button>

              <button
                type="button"
                aria-label="Add to favorites"
                className="h-11 w-11 md:h-12 md:w-12 rounded-xl border border-gray-200
                hover:bg-gray-50 transition
                dark:border-slate-700 dark:hover:bg-slate-800
                focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                ♡
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
