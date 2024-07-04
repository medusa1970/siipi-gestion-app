import type { Producto } from '#gql';
import localforage from 'localforage';
import { productoService } from '~/modulos/productos/API/productoService';

export const useProductoTab = () => {
  const estado = reactive({
    datos_productoDeOferta: {
      producto: null as Producto,
      marca: null as { _id: string; nombre: string },
      cantidad: null as number,
    },
    productos: [] as Producto[],
    productosOpciones: [] as any[],
  });

  const traerProductos = async () => {
    let productos = await localforage.getItem<Producto[]>('productos');
    if (!productos) {
      productos = await productoService.buscarProductos();
      await localforage.setItem('productos', productos);
    }
    estado.productos = productos;
  };
  const productoSelectOptions = () => {
    const options = [];

    for (const producto of estado.productos) {
      options.push({
        label: producto.nombre,
        value: { id: producto._id, variedades: producto.variedades },
        class: 'option',
        variedades: producto.variedades,
      });
    }
    return options;
  };

  return { estado, traerProductos, productoSelectOptions };
};
