export default function ProductCard({ product, onAddToCart }) {
  return (
    <article className="card">
      <img
        className="product-image"
        src={product.image || 'https://placehold.co/600x400?text=No+Image'}
        alt={product.name}
        loading="lazy"
      />
      <div className="card-content">
        <h3>{product.name}</h3>
        <p className="muted">${Number(product.price || 0).toFixed(2)}</p>
        <button onClick={() => onAddToCart(product)}>Add to cart</button>
      </div>
    </article>
  );
}
