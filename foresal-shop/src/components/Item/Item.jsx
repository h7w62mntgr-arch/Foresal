import { Link } from 'react-router-dom';
import './Item.css';

const Item = ({ id, title, price, image, stock, unit, category }) => {
  return (
    <article className="item-card">
      <div className="item-card__img-wrapper">
        <img
          src={image}
          alt={title}
          className="item-card__img"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://placehold.co/400x280?text=Foresal'; }}
        />
        <span className="item-card__category">{category}</span>
      </div>
      <div className="item-card__body">
        <h3 className="item-card__title">{title}</h3>
        <div className="item-card__footer">
          <p className="item-card__price">
            ${price.toLocaleString('es-UY')}
            <span className="item-card__unit"> / {unit}</span>
          </p>
          <p className={`item-card__stock ${stock === 0 ? 'item-card__stock--empty' : ''}`}>
            {stock === 0 ? 'Sin stock' : `Stock: ${stock}`}
          </p>
        </div>
        <Link to={`/item/${id}`} className="item-card__btn">
          Ver detalle
        </Link>
      </div>
    </article>
  );
};

export default Item;
