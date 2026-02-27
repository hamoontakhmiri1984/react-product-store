import { create } from "zustand";

type CartItem = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  totalItems: number;

  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;

  clearCart: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  totalItems: 0,

  addToCart: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);

      let updatedItems;

      if (existing) {
        updatedItems = state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      } else {
        updatedItems = [...state.items, { ...item, quantity: 1 }];
      }

      return {
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }),

  removeFromCart: (id) =>
    set((state) => {
      const updatedItems = state.items.filter((i) => i.id !== id);

      return {
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }),

  increaseQuantity: (id) =>
    set((state) => {
      const updatedItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      );

      return {
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }),

  decreaseQuantity: (id) =>
    set((state) => {
      const updatedItems = state.items
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0);

      return {
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }),

  clearCart: () =>
    set({
      items: [],
      totalItems: 0,
    }),
}));
