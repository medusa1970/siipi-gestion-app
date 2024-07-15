import { useAlmacen } from '~/modulos2/almacen/almacen.composable';

export const useProductoOfertas = () => {
  const { store, estado: estadoAlmacen } = useAlmacen();
  const estado = reactive({});

  return {
    store,
    estado,
  };
};
