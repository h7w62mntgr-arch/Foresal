import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartWidget.css';

const CartWidget = () => {
  const { totalQuantity } = useCart();

  return (
    <Link to="/cart" className="cart-widget">
      <span className="cart-widget__icon">🛒</span>
      {totalQuantity > 0 && (
        <span className="cart-widget__badge">{totalQuantity}</span>
      )}
    </Link>
  );
};

export default CartWidget;
