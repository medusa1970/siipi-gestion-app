import type { Producto } from '#gql';
import { storeAlmacen } from './almacen.store';
import { storeOferta } from '@/modulos/ofertas/ofertas.store';
import { useAuthStore } from '@/modulos/main/useAuthStore';

export const useAlmacen = () => {
  const route = useRoute();
  const router = useRouter();
  const store = storeAlmacen();
  const estadoAlmacen = reactive({});
  const authStore = useAuthStore();
  const ofertaStore = storeOferta();

  /**
   * Saber si un producto esta completo.
   */
  const productoIncompleto = (producto: Producto) => {
    const res = [];
    if (!producto.imagen) res.push('imagen');
    if (producto.variedades.length === 0) res.push('variedad');
    if (!producto.medida) res.push('medida');
    if (!producto.categoria) res.push('categoria');
    return res.length > 0 ? res : null;
  };

  /**
   * Recuperar las ofertas de un producto
   */
  const productoOfertas = productoId => {
    if (!ofertaStore.ofertas) return null;
    return ofertaStore.ofertas.filter(oferta => {
      for (const ingrediente of oferta.ingredientes) {
        if (ingrediente.producto == null) {
          console.log('Ingrediente producto null en oferta #' + oferta._id);
        }
        if (ingrediente.producto?._id === productoId) {
          return true;
        }
      }
    });
  };

  // exports
  return {
    estadoAlmacen,
    store,
    authStore,
    router,
    route,

    productoOfertas,
    productoIncompleto
  };
};
