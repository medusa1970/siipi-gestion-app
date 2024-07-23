import { useAlmacen } from '~/modulos/almacen/almacen.composable';

export const useProductoOfertas = () => {
  const { store, estado: estadoAlmacen } = useAlmacen();
  const estado = reactive({});

  return {
    store,
    estado,
  };
};
