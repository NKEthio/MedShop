import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter font for a clean look
import './globals.css';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster
import ClientCartInitializer from '@/components/ClientCartInitializer'; // Component to access cart count on client
import { AuthProvider } from '@/context/AuthContext'; // Import AuthProvider

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'MediShop - Medical Equipment E-commerce',
  description: 'Your trusted source for quality medical equipment.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen bg-background`}>
        <AuthProvider> {/* Wrap with AuthProvider */}
          {/* ClientCartInitializer renders the Header client-side to access cart count */}
          <ClientCartInitializer />
          <main className="flex-grow">{children}</main>
          <Toaster /> {/* Add Toaster for notifications */}
          <footer className="bg-secondary py-4 mt-auto">
              <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
                    © {new Date().getFullYear()} MediShop. All rights reserved.
              </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
