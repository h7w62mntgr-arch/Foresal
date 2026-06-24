import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockProducts } from '../../firebase/mockData';
import ItemDetail from '../ItemDetail/ItemDetail';
import Loader from '../Loader/Loader';
import './ItemDetailContainer.css';

const ItemDetailContainer = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const found = mockProducts.find((p) => p.id === id) ?? null;
      setProduct(found);
      setLoading(false);
    }, 400);
  }, [id]);

  if (loading) return <div className="item-detail-container"><Loader /></div>;

  if (!product) {
    return (
      <div className="item-detail-container item-detail-container--not-found">
        <p>Producto no encontrado.</p>
        <Link to="/" className="item-detail-container__back">← Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="item-detail-container">
      <Link to="/" className="item-detail-container__back">← Volver al catálogo</Link>
      <ItemDetail {...product} />
    </div>
  );
};

export default ItemDetailContainer;
