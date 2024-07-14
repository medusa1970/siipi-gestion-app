import { useAlmacen } from '~/modulos2/almacen/almacen.composable';

export const useProductoProveedores = () => {
  const { store, estado: estadoAlmacen } = useAlmacen();
  const estado = reactive({});

  return {
    store,
    estado,
  };
};
