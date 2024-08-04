import { useAlmacen } from "~/modulos/almacen/almacen.composable";

/**
 * Permisos requeridos para esta pagina
 */
export const permisosMedidaDetalle = ["ACCEDER"];

/**
 * Composable
 */
export const useMedidaDetalle = () => {
  const { store, authStore, router } = useAlmacen();
  if (!authStore.autorizar(permisosMedidaDetalle)) goTo(router, "noAutorizado");

  const estado = reactive({
    tab: "basico",
  });

  return {
    estado,
    store,
    authStore,
    router,
  };
};
