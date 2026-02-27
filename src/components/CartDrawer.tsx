import { X } from "lucide-react";
import { useCartStore } from "../store/useCartStore";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const totalPrice = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity z-40 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 flex flex-col
        bg-white dark:bg-slate-900
        shadow-2xl border-l border-gray-200 dark:border-slate-800
        transform transition-transform duration-300 z-50
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800">
          <h2 className="font-semibold text-lg">Cart</h2>

          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-slate-400">
              Your cart is empty
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 border-b border-gray-100 dark:border-slate-800 pb-3"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-14 w-14 object-contain rounded-md bg-gray-50 dark:bg-slate-800 p-1"
                />

                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-1">
                    {item.title}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="h-6 w-6 rounded-full
                      bg-gray-100 dark:bg-slate-800
                      flex items-center justify-center
                      hover:bg-gray-200 dark:hover:bg-slate-700
                      text-xs transition"
                    >
                      −
                    </button>

                    <span className="text-sm font-medium w-6 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="h-6 w-6 rounded-full
                      bg-gray-100 dark:bg-slate-800
                      flex items-center justify-center
                      hover:bg-gray-200 dark:hover:bg-slate-700
                      text-xs transition"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="h-8 w-8 rounded-full
                  hover:bg-gray-100 dark:hover:bg-slate-800
                  flex items-center justify-center
                  text-sm transition"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600 dark:text-slate-300">
                Total
              </span>
              <span className="font-semibold text-lg">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              className="w-full h-11 rounded-xl
              bg-gray-900 text-white
              dark:bg-slate-100 dark:text-slate-900
              font-semibold hover:opacity-90 transition"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
