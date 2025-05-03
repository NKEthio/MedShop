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
*   Shopping Cart functionality (`useCart` hook)
*   Basic Checkout Flow (stubbed payment processing)
*   Product Listing and Detail Pages
*   Responsive Design
*   **(Optional)** Genkit integration for potential GenAI features (requires setup)

## Environment Variables Needed

*   `NEXT_PUBLIC_FIREBASE_API_KEY`
*   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
*   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
*   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
*   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
*   `NEXT_PUBLIC_FIREBASE_APP_ID`
*   `GOOGLE_GENAI_API_KEY` (Optional, for Genkit)
