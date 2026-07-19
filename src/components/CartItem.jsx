export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <li className="cart-item">
      <div>
        <h3>{item.name}</h3>
        <p className="muted">${Number(item.price).toFixed(2)} each</p>
      </div>
      <div className="cart-actions">
        <input
          aria-label={`${item.name} quantity`}
          min="1"
          type="number"
          value={item.quantity}
          onChange={(event) => onQuantityChange(item.id, event.target.value)}
        />
        <button className="button-secondary" onClick={() => onRemove(item.id)}>
          Remove
        </button>
      </div>
    </li>
  );
}
