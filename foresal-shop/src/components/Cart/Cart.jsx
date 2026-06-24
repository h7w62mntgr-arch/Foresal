import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from '../CartItem/CartItem';
import './Cart.css';

const Cart = () => {
  const { cart, clearCart, totalPrice, totalQuantity } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart cart--empty">
        <span className="cart__empty-icon">🛒</span>
        <h2>Tu carrito está vacío</h2>
        <p>Explorá nuestro catálogo y agregá productos.</p>
        <Link to="/" className="cart__btn">Ver productos</Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2 className="cart__title">Tu carrito</h2>

      <div className="cart__list">
        {cart.map((item) => (
          <CartItem key={item.id} {...item} />
        ))}
      </div>

      <div className="cart__summary">
        <div className="cart__summary-row">
          <span>Productos</span>
          <span>{totalQuantity} unidades</span>
        </div>
        <div className="cart__summary-row cart__summary-row--total">
          <span>Total</span>
          <span>${totalPrice.toLocaleString('es-UY')}</span>
        </div>
      </div>

      <div className="cart__actions">
        <button className="cart__btn cart__btn--clear" onClick={clearCart}>
          Vaciar carrito
        </button>
        <Link to="/checkout" className="cart__btn cart__btn--checkout">
          Finalizar compra
        </Link>
      </div>
    </div>
  );
};

export default Cart;
