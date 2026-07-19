import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orders';

const initialForm = { name: '', phone: '', address: '' };

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <section>
        <h1>Checkout</h1>
        <p className="status">
          Your cart is empty. <Link to="/">Add products first</Link>
        </p>
      </section>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name || !form.phone || !form.address) {
      setFeedback({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    setSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      const orderId = await createOrder({
        customer: form,
        items,
        total,
      });
      clearCart();
      setForm(initialForm);
      setFeedback({ type: 'success', message: `Order placed successfully. ID: ${orderId}` });
      setTimeout(() => navigate('/'), 1200);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Could not place order.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h1>Checkout</h1>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            required
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
        </label>
        <label>
          Phone
          <input
            required
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
          />
        </label>
        <label>
          Address
          <textarea
            required
            rows="3"
            value={form.address}
            onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
          />
        </label>
        <p className="muted">Order total: ${total.toFixed(2)}</p>
        <button disabled={submitting} type="submit">
          {submitting ? 'Placing order...' : 'Place order'}
        </button>
      </form>
      {feedback.message && (
        <p className={`status ${feedback.type === 'error' ? 'error' : 'success'}`}>
          {feedback.message}
        </p>
      )}
    </section>
  );
}
