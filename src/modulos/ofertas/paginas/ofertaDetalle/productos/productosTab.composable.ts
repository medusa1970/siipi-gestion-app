import type { Producto } from '#gql';
import { apiOfertas } from '@/modulos/ofertas/API/ofertas.api';
import { storeOferta } from '@/modulos/ofertas/ofertas.store.js';

export const useProductoTab = () => {
  const store = storeOferta();

  const estado = reactive({
    datos_productoDeOferta: {
      producto: null as Producto,
      marca: null as { _id: string; nombre: string },
      cantidad: null as number,
    },
    productos: [] as Producto[],
    productosOpciones: [] as any[],
  });

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
    const ofertaModificada = await api.modificarOferta(
      {
        _id: [store.oferta._id],
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
    if (ofertaModificada) {
      NotifySucessCenter('Producto modificado correctamente');
      store.oferta = ofertaModificada;
    }
  };

  return {
    estado,
    productoSelectOptions,
    modificarOfertaProducto,
    store,
  };
};
