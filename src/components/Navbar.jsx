import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link className="brand" to="/">
          MedShop
        </Link>
        <nav className="nav-links">
          <NavLink to="/">Products</NavLink>
          <NavLink to="/cart">Cart ({itemCount})</NavLink>
        </nav>
      </div>
    </header>
  );
}
