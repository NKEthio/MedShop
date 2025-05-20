
# Firebase Studio - MediShop E-commerce

This is a Next.js starter project for MediShop, an e-commerce platform for medical equipment, built within Firebase Studio.

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

2.  **Set up Environment Variables:**
    *   Copy the example environment file:
        ```bash
        cp src/.env.local.example src/.env.local
        ```
    *   Open `src/.env.local` and fill in your Firebase project configuration values. You can find these in your Firebase project settings (Project settings > General > Your apps > Web app > SDK setup and configuration > Config).
    *   **(Optional)** If you plan to use GenAI features with Genkit, uncomment and add your `GOOGLE_GENAI_API_KEY`.

3.  **Run the Development Server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    The application will be available at [http://localhost:9002](http://localhost:9002) (or the port specified in `package.json`).

4.  **Explore the Code:**
    *   Start by looking at the main page component: `src/app/page.tsx`.
    *   Firebase configuration is in `src/lib/firebase.ts`.
    *   Authentication context is managed in `src/context/AuthContext.tsx`.
    *   Product data is located in `src/data/products.ts`.
    *   UI components built with ShadCN/UI are in `src/components/ui/`.

## Features

*   Next.js 15 (App Router)
*   TypeScript
*   Tailwind CSS with ShadCN/UI components
*   Firebase Authentication (Email/Password)
*   Firestore for data (User roles: Admin, Seller, Buyer)
*   Shopping Cart functionality (`useCart` hook)
*   Basic Checkout Flow (stubbed payment processing)
*   Product Listing and Detail Pages (including selling, editing, deleting for authorized users)
*   Owner Dashboard for Admins
*   Profile Page displaying user role
*   Responsive Design
*   **(Optional)** Genkit integration for potential GenAI features (requires setup)

## Setting up User Roles (Admin, Seller, Buyer)

User roles are managed in Firestore.

### Admin Role:
There are two ways to designate a user as an admin:

1.  **Primary Method (via `users` collection - Recommended for all roles):**
    *   Create a user account in your application.
    *   Find the user's Firebase UID (Firebase console -> Authentication -> Users).
    *   Go to Firestore Database -> Data tab.
    *   Create a collection named `users` if it doesn't exist.
    *   Add a new document to the `users` collection. Set the **Document ID** to the user's UID.
    *   Inside this document, add a field:
        *   **Field name:** `role`
        *   **Field type:** `string`
        *   **Field value:** `admin`
    *   Click "Save".

2.  **Legacy Method (via `admins` collection - Still works for 'admin'):**
    *   Create a user account (e.g., `nuredinkassaw599@gmail.com`).
    *   Find their Firebase UID.
    *   Go to Firestore Database -> Data tab.
    *   Create the `admins` collection if it doesn't exist.
    *   Add a document to the `admins` collection:
        *   **Document ID:** User's UID.
        *   Fields can be empty or have `role: "owner"`. The existence of the UID as a document ID is sufficient for admin rights through this legacy method.
    *   Click "Save".

The `AuthProvider` will first check the `admins` collection. If the user's UID is found there, they are an 'admin'. Otherwise, it checks the `users/{UID}` document for a `role` field.

### Seller Role:

1.  **Create a user account.**
2.  **Find the user's Firebase UID.**
3.  **Go to Firestore Database -> Data tab.**
4.  **Ensure the `users` collection exists.**
5.  **Add/Update the user's document in the `users` collection:**
    *   If a document with the user's UID as ID doesn't exist, create it.
    *   Add/Set a field:
        *   **Field name:** `role`
        *   **Field type:** `string`
        *   **Field value:** `seller`
    *   Click "Save".

Sellers will have access to the "Sell" and "My Products" pages.

### Buyer Role (Default):

If a user is not found in the `admins` collection and does not have a specific `role` field in their `users/{UID}` document (or the document doesn't exist), they will default to the 'buyer' role. Buyers can browse products, add to cart, and checkout.

**Example `users` collection structure:**

```
users/
  {userUID_1}/
    role: "admin"
    // other fields...
  {userUID_2}/
    role: "seller"
    // other fields...
  {userUID_3}/
    role: "buyer"
    // other fields...
  {userUID_4}/
    // (no role field, will default to buyer)
```

When a user with the 'admin' role logs in, the "Owner" link will appear in the header. Users with 'seller' role will see "Sell" and "My Products" links.

## Environment Variables Needed

*   `NEXT_PUBLIC_FIREBASE_API_KEY`
*   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
*   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
*   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
*   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
*   `NEXT_PUBLIC_FIREBASE_APP_ID`
*   `GOOGLE_GENAI_API_KEY` (Optional, for Genkit)
```