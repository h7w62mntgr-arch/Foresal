import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProducts } from '../../firebase/services';
import ItemList from '../ItemList/ItemList';
import Loader from '../Loader/Loader';
import './ItemListContainer.css';

const CATEGORY_LABELS = {
  maderas: 'Maderas',
  combustibles: 'Combustibles',
  herramientas: 'Herramientas',
  insumos: 'Insumos Forestales',
};

const ItemListContainer = ({ greeting }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    getProducts(categoryId)
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, [categoryId]);

  const heading = categoryId
    ? CATEGORY_LABELS[categoryId] ?? categoryId
    : greeting ?? 'Todos los productos';

  return (
    <section className="item-list-container">
      <div className="item-list-container__header">
        <h2 className="item-list-container__title">{heading}</h2>
        {categoryId && (
          <p className="item-list-container__subtitle">
            {products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
      {loading ? <Loader /> : <ItemList products={products} />}
    </section>
  );
};

export default ItemListContainer;
