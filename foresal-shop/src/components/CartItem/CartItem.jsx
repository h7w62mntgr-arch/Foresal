import { useCart } from '../../context/CartContext';
import './CartItem.css';

const CartItem = ({ id, title, price, quantity, image, unit }) => {
  const { removeItem } = useCart();

  return (
    <div className="cart-item">
      <img
        src={image}
        alt={title}
        className="cart-item__img"
        onError={(e) => { e.target.src = 'https://placehold.co/80x80?text=F'; }}
      />
      <div className="cart-item__info">
        <h4 className="cart-item__title">{title}</h4>
        <p className="cart-item__unit">{unit}</p>
      </div>
      <div className="cart-item__qty">x {quantity}</div>
      <div className="cart-item__subtotal">
        ${(price * quantity).toLocaleString('es-UY')}
      </div>
      <button
        className="cart-item__remove"
        onClick={() => removeItem(id)}
        aria-label="Eliminar producto"
      >
        ✕
      </button>
    </div>
  );
};

export default CartItem;
