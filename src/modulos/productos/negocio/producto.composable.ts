import type { CrearProductoBasico } from './producto.interface';
import { productoService } from '../API/productoService';
import { storeProducto } from './producto.store';
import type { Producto } from '~/modulos/productos/API/producto.interfaceApi';
import localforage from 'localforage';

export const useProducto = () => {
  const productoStore = storeProducto();
  const { $socket } = useNuxtApp();
  /**
   * Generar una lista de opciones para q-select a partir del
   * arbol de categorias
   */
  const categoriaSelectOptions = async () => {
    const options = [];
    const arbol = await productoStore.getCategoriaArbol();
    for (const cat of arbol.hijas) {
      options.push({
        label: `${cat.nombre} (${cat.hijas.length})`,
        disable: true,
        class: 'title',
      });
      for (const subcat of cat.hijas) {
        options.push({
          label: subcat.nombre,
          value: subcat._id,
          class: 'option',
        });
      }
    }
    return options;
  };

  /**
   * Agregar un producto (solo datos basicos)
   */
  const crearProductoBasico = async (datos: CrearProductoBasico) => {
    const productoCreado = await productoService.crearProductoBasico(datos);
    if (productoCreado) {
      productoStore.addProducto(productoCreado);
    }
    console.log(productoCreado);
    // El producto creado quiero hacer push en mi indexdb productos

    return productoCreado;
  };

  //
  const traerProductos = async () => {
    const productosAlmacenados = await localforage.getItem('productos');

    if (!productosAlmacenados) {
      const productos = await productoService.buscarProductos();
      //si existe producto lo guardamos y si no le damos un []
      await localforage.setItem('productos', productos ? productos : []);
    }
  };

  const actProductosDB = async () => {
    const productos = await postDataGql(
      GqlProductosBuscar({
        opciones: {
          populate: true,
          sort: '-_modificado -_creado',
        },
      }),
    );
    console.log(productos);
    const res = await localforage.setItem(
      'productos',
      productos ? productos : [],
    );
    console.log(res);
    if (res) console.log('Se actualizo la base de datos');
  };

  // // const deletePeople = (fila) => {
  // //   storePersona.deletePeople(fila._id);
  // // };
  // onMounted(async () => {
  //   // await storePersona.traerProductos();
  //   $socket.on('productoChanged', async (data: any) => {
  //     console.log(data);
  //     // if (data) await storePersona.traerProductos();
  //     window.alert('SE CAMBIO PRODUCTOS');
  //   });
  // });
  // onUnmounted(() => {
  //   $socket.off('productoChanged');
  // });

  return {
    categoriaSelectOptions,
    crearProductoBasico,
    traerProductos,
    actProductosDB,
  };
};
