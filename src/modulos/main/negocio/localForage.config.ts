import localforage from 'localforage';

// Configurar LocalForage con manejo de errores
export const iniciarLocalForage = async () => {
  try {
    localforage.config({
      name: 'siipi',
      storeName: 'dataStore', // Nombre del almacenamiento (opcional)
      driver: localforage.INDEXEDDB, // Asegúrate de usar IndexedDB
    });
  } catch (err) {
    console.error('Error al configurar LocalForage:', err);
  }

  // const products = [
  //   {
  //     id: 1,
  //     name: 'Product 1',
  //     price: 10.0,
  //     details: [
  //       { feature: 'Feature 1', value: 'Value 1' },
  //       { feature: 'Feature 2', value: 'Value 2' },
  //     ],
  //     addres: {
  //       city: 'City 1',
  //       country: 'Country 1',
  //     },
  //   },
  //   { id: 2, name: 'Product 2', price: 20.0 },
  // ];
  const offers = [
    { id: 1, productId: 1, discount: 0.1 },
    { id: 2, productId: 2, discount: 0.2 },
  ];
  // const res = await localforage.setItem('products', products);
  const oferts = await localforage.setItem('offers', offers);
  // console.log(res);
  console.log(oferts);
};

// export const traerProductos = async () => {
//   const productos = await localforage.getItem('products');
//   console.log(productos);

//   if (productos) {
//     console.log('Productos:', productos);
//   } else {
//     console.log('No hay productos');
//   }
// };
