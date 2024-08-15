import type { Producto } from '#gql';
import { storeAlmacen } from './almacen.store';
import { useAuthStore } from '@/modulos/main/useAuthStore';

export const useAlmacen = () => {
  const router = useRouter();
  const store = storeAlmacen();
  const estadoAlmacen = reactive({});
  const authStore = useAuthStore();

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

  // exports
  return {
    estadoAlmacen,
    store,
    authStore,
    router,
    productoIncompleto
  };
};
