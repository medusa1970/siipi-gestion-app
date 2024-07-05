import type { Producto } from '#gql';
import localforage from 'localforage';
import { productoService } from '~/modulos/productos/API/productoService';
import { ofertaService } from '../API/oferta.service';
import { storeOferta } from '@/modulos/ofertas/negocio/oferta.store';

export const useProductoTab = () => {
  const ofertaStore = storeOferta();

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
        value: { _id: producto._id, variedades: producto.variedades },
        class: 'option',
        variedades: producto.variedades,
      });
    }
    return options;
  };

  const modificarOfertaProducto = async () => {
    const productoModificado =
      await ofertaService.modificarOfertaIngredienteSimple(
        {
          _id: [ofertaStore.oferta._id],
        },
        {
          ingredientes: {
            reemplazar: [
              {
                tipo: 'SIMPLE',
                producto: estado.datos_productoDeOferta.producto._id,
                marca: estado.datos_productoDeOferta.marca._id,
                cantidad: estado.datos_productoDeOferta.cantidad,
              },
            ],
          },
        },
      );
    if (productoModificado) {
      NotifySucessCenter('Producto modificado correctamente');
      ofertaStore.oferta.ingredientes[0] = {
        producto: productoModificado.ingredientes[0].producto,
        marca: productoModificado.ingredientes[0].marca,
        cantidad: productoModificado.ingredientes[0].cantidad,
      };
    }
  };

  return {
    estado,
    traerProductos,
    productoSelectOptions,
    modificarOfertaProducto,
    ofertaStore,
  };
};
