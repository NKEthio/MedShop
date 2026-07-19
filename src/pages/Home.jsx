import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { missingFirebaseEnvVars } from '../services/firebase';
import { getProducts } from '../services/products';

export default function Home() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: '' });

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        const list = await getProducts();
        if (mounted) {
          setProducts(list);
          setStatus({ loading: false, error: '' });
        }
      } catch {
        if (mounted) {
          setStatus({ loading: false, error: 'Could not load products.' });
        }
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  if (status.loading) {
    return <p className="status">Loading products...</p>;
  }

  return (
    <section>
      <h1>Products</h1>
      {missingFirebaseEnvVars.length > 0 && (
        <p className="status warning">
          Firebase is not fully configured. Set: {missingFirebaseEnvVars.join(', ')}
        </p>
      )}
      {status.error && <p className="status error">{status.error}</p>}
      {products.length === 0 ? (
        <p className="status">No products found yet. Add products in Firestore.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      )}
    </section>
  );
}
