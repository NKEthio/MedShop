# MedShop (Minimal React + Vite + Firebase MVP)

A minimal, fast e-commerce MVP using React + Vite on the frontend and Firebase Firestore as the backend.

## Stack

- React + Vite
- React Router
- Firebase JS SDK (Firestore)
- Plain CSS

## Project structure

```txt
src/
  components/
    ProductCard.jsx
    Navbar.jsx
    CartItem.jsx
  pages/
    Home.jsx
    Cart.jsx
    Checkout.jsx
  context/
    CartContext.jsx
  services/
    firebase.js
    products.js
    orders.js
  App.jsx
  main.jsx
  styles.css
```

## 1) Firebase setup

1. Create a Firebase project at https://console.firebase.google.com
2. Create a **Firestore Database** (start in test mode for local MVP work).
3. Create a **Web App** in Project Settings and copy the Firebase config values.
4. In your local project, create `.env` from the example:

```bash
cp .env.example .env
```

5. Fill in these exact env vars in `.env`:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## 2) Seed sample products

In Firebase Console → Firestore → Data, create collection **`products`** and add sample documents like:

```json
{
  "name": "Digital Thermometer",
  "price": 12.99,
  "image": "https://images.unsplash.com/photo-1584515933487-779824d29309"
}
```

Add a few products. The Home page reads from `products` and shows an empty state when none exist.

## 3) Run locally

```bash
npm install
npm run dev
```

App runs on the URL printed by Vite (usually http://localhost:5173).

## 4) Build and preview

```bash
npm run build
npm run preview
```

## 5) Checkout data

When checkout succeeds, a document is written to Firestore collection **`orders`** with:

- `customer` (`name`, `phone`, `address`)
- `items` (cart line items)
- `total`
- `createdAt`

## Deploy

You can deploy the Vite `dist/` output to Firebase Hosting, Netlify, Vercel, or similar static hosts.
