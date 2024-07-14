import { useAlmacen } from '~/modulos2/almacen/almacen.composable';

export const useProveedores = () => {
  const { store } = useAlmacen();
  const estado = reactive({
    //...
  });

  return {
    estado,
    store,
  };
};
