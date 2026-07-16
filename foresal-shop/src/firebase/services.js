import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { db } from './config';
import { mockProducts } from './mockData';

const PRODUCTS_COLLECTION = 'products';

// Convierte un snapshot de Firestore en un objeto de producto con su id.
const mapDoc = (snapshot) => ({ id: snapshot.id, ...snapshot.data() });

/**
 * Obtiene el listado de productos desde Firestore.
 * Ante cualquier error de red/configuración recae en los datos mock para que
 * la interfaz siga siendo navegable.
 *
 * La colección se puebla una única vez con `node scripts/reseed.mjs`.
 *
 * @param {string} [categoryId] - Categoría opcional para filtrar.
 */
export const getProducts = async (categoryId) => {
  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(colRef);
    const products = snapshot.docs.map(mapDoc);

    return categoryId
      ? products.filter((p) => p.category === categoryId)
      : products;
  } catch (error) {
    console.error('Error al leer productos de Firestore:', error);
    return categoryId
      ? mockProducts.filter((p) => p.category === categoryId)
      : mockProducts;
  }
};

/**
 * Obtiene un producto individual por su id de documento.
 * @param {string} id - Id del documento de Firestore.
 */
export const getProductById = async (id) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) return mapDoc(snapshot);
    return null;
  } catch (error) {
    console.error('Error al leer el producto de Firestore:', error);
    return mockProducts.find((p) => p.id === id) ?? null;
  }
};

/**
 * Obtiene productos filtrados por categoría usando una query de Firestore.
 * (Se expone por completitud; getProducts filtra en memoria para poder sembrar).
 * @param {string} categoryId
 */
export const getProductsByCategory = async (categoryId) => {
  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(colRef, where('category', '==', categoryId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDoc);
  } catch (error) {
    console.error('Error al filtrar productos por categoría:', error);
    return mockProducts.filter((p) => p.category === categoryId);
  }
};
