import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './config';

const products = [
  {
    title: 'Madera de Eucalyptus',
    description: 'Madera de eucalyptus de primera calidad, ideal para construcción rural, postes y muebles. Secado natural, sin tratamientos químicos.',
    price: 2500,
    stock: 40,
    category: 'maderas',
    image: 'https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=600&q=80',
    unit: 'm³',
  },
  {
    title: 'Tableros de Pino',
    description: 'Tableros de pino cepillados y canteados, perfectos para carpintería y construcción. Dimensiones estándar disponibles.',
    price: 1800,
    stock: 60,
    category: 'maderas',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    unit: 'paquete',
  },
  {
    title: 'Vigas de Roble',
    description: 'Vigas de roble macizo de alta resistencia, ideales para techos y estructuras. Madera noble con acabado rústico.',
    price: 5500,
    stock: 15,
    category: 'maderas',
    image: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=600&q=80',
    unit: 'viga',
  },
  {
    title: 'Leña Premium',
    description: 'Leña de eucalyptus y pino mezclada, seca y lista para usar. Ideal para chimeneas y parrillas. Entrega en domicilio.',
    price: 950,
    stock: 100,
    category: 'combustibles',
    image: 'https://images.unsplash.com/photo-1576867757603-05b134ebc379?w=600&q=80',
    unit: '100 kg',
  },
  {
    title: 'Carbón Vegetal',
    description: 'Carbón vegetal artesanal producido en horno, sin aditivos. Alta temperatura de combustión, ideal para asados y cocción.',
    price: 650,
    stock: 80,
    category: 'combustibles',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80',
    unit: 'bolsa 20 kg',
  },
  {
    title: 'Motosierra Profesional',
    description: 'Motosierra de 50cc con espada de 18 pulgadas. Motor de alta potencia para tala y poda de árboles de gran porte.',
    price: 35000,
    stock: 8,
    category: 'herramientas',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80',
    unit: 'unidad',
  },
  {
    title: 'Kit de Poda Profesional',
    description: 'Kit completo con tijera, serrucho y podadora de altura. Acero inoxidable de alta resistencia, mango ergonómico.',
    price: 4200,
    stock: 20,
    category: 'herramientas',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
    unit: 'kit',
  },
  {
    title: 'Hacha Forestal Profesional',
    description: 'Hacha de leñador con mango de madera de fresno y cabeza de acero forjado. Balance perfecto para trabajo prolongado.',
    price: 3800,
    stock: 12,
    category: 'herramientas',
    image: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=600&q=80',
    unit: 'unidad',
  },
  {
    title: 'Fertilizante Forestal NPK',
    description: 'Fertilizante granulado NPK 15-15-15, especialmente formulado para plantaciones forestales. Acción de lenta liberación.',
    price: 1200,
    stock: 50,
    category: 'insumos',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
    unit: 'bolsa 25 kg',
  },
  {
    title: 'Semillas de Pino Radiata',
    description: 'Semillas certificadas de Pinus radiata, alta tasa de germinación (90%). Seleccionadas genéticamente para máximo rendimiento maderero.',
    price: 780,
    stock: 35,
    category: 'insumos',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
    unit: 'sobre 500 semillas',
  },
];

export const seedFirestore = async () => {
  try {
    const colRef = collection(db, 'products');
    const existing = await getDocs(colRef);
    if (!existing.empty) return;
    for (const product of products) {
      await addDoc(colRef, product);
    }
    console.log('Productos cargados en Firestore');
  } catch (error) {
    console.error('Error en seed de Firestore:', error);
  }
};
