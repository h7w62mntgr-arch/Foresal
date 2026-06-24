import { useState } from 'react';
import './ItemCount.css';

const ItemCount = ({ stock, initial = 1, onAdd }) => {
  const [count, setCount] = useState(initial);

  const decrement = () => setCount((c) => Math.max(1, c - 1));
  const increment = () => setCount((c) => Math.min(stock, c + 1));

  return (
    <div className="item-count">
      <div className="item-count__controls">
        <button
          className="item-count__btn"
          onClick={decrement}
          disabled={count <= 1}
          aria-label="Disminuir cantidad"
        >
          −
        </button>
        <span className="item-count__value">{count}</span>
        <button
          className="item-count__btn"
          onClick={increment}
          disabled={count >= stock}
          aria-label="Aumentar cantidad"
        >
          +
        </button>
      </div>
      <button
        className="item-count__add"
        onClick={() => onAdd(count)}
        disabled={stock === 0}
      >
        {stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
      </button>
    </div>
  );
};

export default ItemCount;
