import { useAlmacen } from '~/modulos/almacen/almacen.composable';

/**
 * Permisos requeridos para esta pagina
 */
export const permisosProductoDetalle = ['ADQUISICION', 'LOGISTICA', 'ALMACEN'];

/**
 * Composable
 */
export const useProductoDetalle = () => {
  const { store, authStore, route, router } = useAlmacen();
  if (!authStore.autorizar(permisosProductoDetalle))
    goTo(router, 'noAutorizado');

  return {
    store,
    authStore,
    route,
    router
  };
};
