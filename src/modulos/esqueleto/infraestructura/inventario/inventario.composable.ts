import { storeProducto } from '~/modulos/productos/negocio/producto.store';

export const useInventario = () => {
  /** DECLARACIONES */
  const productoStore = storeProducto();
  const router = useRouter();

  /** REACTIVOS */
  const estado = reactive({});

  /** FUNCIONES */
  const test = () => {};

  return {
    estado,
    test,
  };
};
