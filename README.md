# 🛍️ React Product Store - Technical Assessment for React Frontend Developer Position

This project was implemented as a technical assessment for a **React Frontend Developer** position.

It demonstrates clean architecture, scalable state management, modern React patterns, and production-ready UI practices.

---

## 🚀 Live Demo

👉 https://react-product-store-zeta.vercel.app/

---

## 📦 GitHub Repository

👉 https://github.com/hamoontakhmiri1984/react-product-store

---

## 🛠 Tech Stack

- **React 18 + TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **TanStack Query (React Query v5)**
- **Zustand (with persist middleware)**
- **Axios**
- **MUI (Drawer & Slider)**

---

## ✨ Core Features

### 🔍 Search & Filtering

- Real-time search with debounce
- Sorting:
  - Newest
  - Price (Low → High / High → Low)
  - Rating
  - Discount
- Multi-category filtering
- Multi-brand filtering
- Price range slider
- In-stock toggle

### 📦 Product Display

- Fully responsive grid layout
- Server-side pagination
- Product detail modal
- Lazy-loaded images
- Clean empty states

### 🛒 Shopping Cart

- Persistent cart (localStorage via Zustand)
- Add / Remove items
- Quantity controls (+ / −)
- Derived total price & item count via selectors
- Drawer-based cart UI
- Fully responsive

### 🌙 UI / UX

- Dark / Light mode toggle
- Accessible controls
- Smooth transitions
- Mobile filter drawer
- Clean and modular component structure

---

## 🧠 Architecture Highlights

The project is structured with separation of concerns in mind:
src/
├── components/
│ ├── CartDrawer
│ ├── ProductCard
│ ├── ProductModal
│ ├── ProductsToolbar
│ ├── PriceRangeSlider
│ └── ...
│
├── features/
│ └── products/
│ ├── useProducts.ts
│ ├── useProductsPageState.ts
│ ├── productService.ts
│ ├── selectors.ts
│ ├── queryKeys.ts
│ └── types.ts
│
├── store/
│ └── useCartStore.ts
│
└── App.tsx

### 🔹 Data Layer

- API abstraction in `productService.ts`
- Centralized query keys
- React Query for caching and background refetching

### 🔹 UI State

Encapsulated inside a custom hook:

useProductsPageState

Handles:

- Search
- Filters
- Sorting
- Pagination
- URL synchronization

### 🔹 Cart State

Managed using Zustand + persist.

Only raw `items` are persisted.  
Derived values (total price / total items) are calculated via selectors.

---

## 📡 API

Data is fetched from:

https://dummyjson.com/docs/products

Endpoints used:

- `/products`
- `/products/search`
- `/products/category/:category`

---

## 📱 Responsive Design

- Desktop: Inline filter dropdowns
- Mobile: Bottom Drawer filter panel
- Adaptive grid system
- Tailwind utility-based styling

---

## ⚡ Performance Considerations

- Query caching with React Query
- Derived state instead of duplicated state
- Memoized selectors
- Lazy image loading
- Minimal unnecessary re-renders

---

## ▶ Run Locally

```bash
npm install
npm run dev
```

📌 What This Project Demonstrates

Strong TypeScript usage

Clean and scalable folder structure

Proper state separation (Server vs UI vs Global)

Modern React patterns (hooks, memoization, derived state)

Production-oriented frontend architecture
