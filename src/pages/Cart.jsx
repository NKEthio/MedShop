import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, total, removeFromCart, updateQuantity } = useCart();

  return (
    <section>
      <h1>Your cart</h1>
      {items.length === 0 ? (
        <p className="status">
          Your cart is empty. <Link to="/">Browse products</Link>
        </p>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </ul>
          <div className="cart-summary">
            <p>Total: ${total.toFixed(2)}</p>
            <Link className="button-link" to="/checkout">
              Go to checkout
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
