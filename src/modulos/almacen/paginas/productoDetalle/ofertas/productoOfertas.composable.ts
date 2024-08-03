import { useAlmacen } from "~/modulos/almacen/almacen.composable";

export const useProductoOfertas = () => {
  const { store, authStore, estadoAlmacen, router } = useAlmacen();
  const estado = reactive({});

  return {
    estado,
    store,
    authStore,
    router,
  };
};
