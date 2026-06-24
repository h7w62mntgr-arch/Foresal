import { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useCart } from '../../context/CartContext';
import './CheckoutForm.css';

const EMPTY_FORM = { name: '', lastName: '', email: '', emailConfirm: '', phone: '' };

const CheckoutForm = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'El nombre es requerido.';
    if (!form.lastName.trim()) e.lastName = 'El apellido es requerido.';
    if (!form.email.includes('@')) e.email = 'Email inválido.';
    if (form.email !== form.emailConfirm) e.emailConfirm = 'Los emails no coinciden.';
    if (form.phone.trim().length < 7) e.phone = 'Teléfono inválido.';
    return e;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const order = {
      buyer: {
        name: `${form.name} ${form.lastName}`,
        email: form.email,
        phone: form.phone,
      },
      items: cart.map(({ id, title, price, quantity }) => ({ id, title, price, quantity })),
      total: totalPrice,
      date: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'orders'), order);
    clearCart();
    setOrderId(docRef.id);
    setLoading(false);
  };

  if (cart.length === 0 && !orderId) {
    return (
      <div className="checkout checkout--empty">
        <h2>No hay productos en el carrito</h2>
        <Link to="/" className="checkout__btn checkout__btn--primary">Ver productos</Link>
      </div>
    );
  }

  if (orderId) {
    return (
      <div className="checkout checkout--success">
        <span className="checkout__success-icon">✅</span>
        <h2>¡Compra realizada con éxito!</h2>
        <p>Gracias por tu compra. Tu número de orden es:</p>
        <code className="checkout__order-id">{orderId}</code>
        <p className="checkout__success-sub">Te enviaremos los detalles a tu correo.</p>
        <Link to="/" className="checkout__btn checkout__btn--primary">Seguir comprando</Link>
      </div>
    );
  }

  return (
    <div className="checkout">
      <h2 className="checkout__title">Finalizar compra</h2>

      <div className="checkout__layout">
        <form className="checkout__form" onSubmit={handleSubmit} noValidate>
          <div className="checkout__field">
            <label htmlFor="name">Nombre *</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} />
            {errors.name && <span className="checkout__error">{errors.name}</span>}
          </div>

          <div className="checkout__field">
            <label htmlFor="lastName">Apellido *</label>
            <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} />
            {errors.lastName && <span className="checkout__error">{errors.lastName}</span>}
          </div>

          <div className="checkout__field">
            <label htmlFor="email">Email *</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
            {errors.email && <span className="checkout__error">{errors.email}</span>}
          </div>

          <div className="checkout__field">
            <label htmlFor="emailConfirm">Confirmar email *</label>
            <input id="emailConfirm" name="emailConfirm" type="email" value={form.emailConfirm} onChange={handleChange} />
            {errors.emailConfirm && <span className="checkout__error">{errors.emailConfirm}</span>}
          </div>

          <div className="checkout__field">
            <label htmlFor="phone">Teléfono *</label>
            <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
            {errors.phone && <span className="checkout__error">{errors.phone}</span>}
          </div>

          <button
            type="submit"
            className="checkout__btn checkout__btn--primary checkout__btn--submit"
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Confirmar compra'}
          </button>
        </form>

        <aside className="checkout__summary">
          <h3 className="checkout__summary-title">Resumen</h3>
          {cart.map((item) => (
            <div key={item.id} className="checkout__summary-item">
              <span>{item.title} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toLocaleString('es-UY')}</span>
            </div>
          ))}
          <div className="checkout__summary-total">
            <span>Total</span>
            <span>${totalPrice.toLocaleString('es-UY')}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutForm;
