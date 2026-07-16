// Script de mantenimiento: deja la colección `products` con un único documento
// por título (elimina duplicados) y siembra si está vacía.
// Uso: node scripts/reseed.mjs
import { readFileSync } from 'node:fs';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

// Lee credenciales desde .env (formato VITE_FIREBASE_*).
const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => {
      const [k, ...v] = l.split('=');
      return [k.trim(), v.join('=').trim()];
    })
);

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
});
const db = getFirestore(app);

const products = [
  { title: 'Madera de Eucalyptus', description: 'Madera de eucalyptus de primera calidad, ideal para construcción rural, postes y muebles. Secado natural, sin tratamientos químicos.', price: 2500, stock: 40, category: 'maderas', image: 'https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=600&q=80', unit: 'm³' },
  { title: 'Tableros de Pino', description: 'Tableros de pino cepillados y canteados, perfectos para carpintería y construcción. Dimensiones estándar disponibles.', price: 1800, stock: 60, category: 'maderas', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', unit: 'paquete' },
  { title: 'Vigas de Roble', description: 'Vigas de roble macizo de alta resistencia, ideales para techos y estructuras. Madera noble con acabado rústico.', price: 5500, stock: 15, category: 'maderas', image: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=600&q=80', unit: 'viga' },
  { title: 'Leña Premium', description: 'Leña de eucalyptus y pino mezclada, seca y lista para usar. Ideal para chimeneas y parrillas. Entrega en domicilio.', price: 950, stock: 100, category: 'combustibles', image: 'https://images.unsplash.com/photo-1576867757603-05b134ebc379?w=600&q=80', unit: '100 kg' },
  { title: 'Carbón Vegetal', description: 'Carbón vegetal artesanal producido en horno, sin aditivos. Alta temperatura de combustión, ideal para asados y cocción.', price: 650, stock: 80, category: 'combustibles', image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80', unit: 'bolsa 20 kg' },
  { title: 'Motosierra Profesional', description: 'Motosierra de 50cc con espada de 18 pulgadas. Motor de alta potencia para tala y poda de árboles de gran porte.', price: 35000, stock: 8, category: 'herramientas', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80', unit: 'unidad' },
  { title: 'Kit de Poda Profesional', description: 'Kit completo con tijera, serrucho y podadora de altura. Acero inoxidable de alta resistencia, mango ergonómico.', price: 4200, stock: 20, category: 'herramientas', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80', unit: 'kit' },
  { title: 'Hacha Forestal Profesional', description: 'Hacha de leñador con mango de madera de fresno y cabeza de acero forjado. Balance perfecto para trabajo prolongado.', price: 3800, stock: 12, category: 'herramientas', image: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=600&q=80', unit: 'unidad' },
  { title: 'Fertilizante Forestal NPK', description: 'Fertilizante granulado NPK 15-15-15, especialmente formulado para plantaciones forestales. Acción de lenta liberación.', price: 1200, stock: 50, category: 'insumos', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80', unit: 'bolsa 25 kg' },
  { title: 'Semillas de Pino Radiata', description: 'Semillas certificadas de Pinus radiata, alta tasa de germinación (90%). Seleccionadas genéticamente para máximo rendimiento maderero.', price: 780, stock: 35, category: 'insumos', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', unit: 'sobre 500 semillas' },
];

const colRef = collection(db, 'products');
const snapshot = await getDocs(colRef);

// 1) Elimina duplicados: conserva el primer documento de cada título.
const seen = new Set();
let deleted = 0;
for (const d of snapshot.docs) {
  const title = d.data().title;
  if (seen.has(title)) {
    await deleteDoc(doc(db, 'products', d.id));
    deleted++;
  } else {
    seen.add(title);
  }
}

// 2) Siembra los títulos que falten.
let added = 0;
for (const product of products) {
  if (!seen.has(product.title)) {
    await addDoc(colRef, product);
    seen.add(product.title);
    added++;
  }
}

console.log(`Duplicados eliminados: ${deleted} | Productos agregados: ${added} | Total únicos: ${seen.size}`);
process.exit(0);
