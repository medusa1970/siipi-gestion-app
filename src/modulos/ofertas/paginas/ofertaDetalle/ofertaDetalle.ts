import { useOfertas } from '~/modulos/ofertas/ofertas.composable';

/**
 * Permisos requeridos para esta pagina
 */
export const permisosOfertaDetalle = ['ADQUISICION', 'LOGISTICA', 'ALMACEN'];

/**
 * Composable
 */
export const useOfertaDetalle = () => {
  const { store, authStore, router, route } = useOfertas();
  if (!authStore.autorizar(permisosOfertaDetalle)) goTo(router, 'noAutorizado');

  return {
    store,
    authStore,
    router,
    route
  };
};
