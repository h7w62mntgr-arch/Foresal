import Item from '../Item/Item';
import './ItemList.css';

const ItemList = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="item-list__empty">
        <p>No hay productos en esta categoría.</p>
      </div>
    );
  }

  return (
    <div className="item-list">
      {products.map((product) => (
        <Item key={product.id} {...product} />
      ))}
    </div>
  );
};

export default ItemList;
