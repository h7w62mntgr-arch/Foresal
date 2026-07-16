import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import ItemCount from '../ItemCount/ItemCount';
import './ItemDetail.css';

const ItemDetail = ({ id, title, description, price, stock, image, unit, category }) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (quantity) => {
    addItem({ id, title, price, image, unit, category }, quantity);
    setAdded(true);
  };

  return (
    <article className="item-detail">
      <div className="item-detail__img-wrapper">
        <img
          src={image}
          alt={title}
          className="item-detail__img"
          onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Foresal'; }}
        />
        <span className="item-detail__category">{category}</span>
      </div>

      <div className="item-detail__info">
        <h1 className="item-detail__title">{title}</h1>
        <p className="item-detail__description">{description}</p>

        <div className="item-detail__price-row">
          <span className="item-detail__price">
            ${price.toLocaleString('es-UY')}
          </span>
          <span className="item-detail__unit">/ {unit}</span>
        </div>

        <p className={`item-detail__stock ${stock === 0 ? 'item-detail__stock--empty' : ''}`}>
          {stock === 0 ? '⚠ Sin stock disponible' : `✓ Stock disponible: ${stock} unidades`}
        </p>

        {!added ? (
          <ItemCount stock={stock} onAdd={handleAdd} />
        ) : (
          <div className="item-detail__added">
            <p className="item-detail__added-msg">✓ Agregado al carrito</p>
            <div className="item-detail__added-btns">
              <Link to="/cart" className="item-detail__btn item-detail__btn--cart">
                Ver carrito
              </Link>
              <Link to="/" className="item-detail__btn item-detail__btn--back">
                Seguir comprando
              </Link>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default ItemDetail;
