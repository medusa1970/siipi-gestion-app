import { storeProducto } from '@/modulos/productos/negocio/producto.store';
import { useAuthStore } from '@/modulos/main/negocio/useAuthStore.js';
import type { Producto } from '#gql';

export const useProductoDetalle = () => {
  const productoStore = storeProducto();
  const authStore = useAuthStore();

  const estado = reactive({
    producto: null as Producto,
    tab: 'datosBasicos',
  });

  return {
    estado,
    productoStore,
    authStore,
  };
};
