import { useOfertas } from '~/modulos/ofertas/ofertas.composable';

/**
 * Permisos requeridos para esta pagina
 */
export const permisosPedido = ['ADQUISICION', 'LOGISTICA', 'ALMACEN'];

/**
 * Composable
 */

export const pedidoRecibir = () => {
  const { store, authStore, router, route } = useOfertas();
  if (!authStore.autorizar(permisosPedido)) goTo(router, 'noAutorizado');

  const estado = reactive({});

  const handlePedidoOk = () => {};
  const handlePedidoError = () => {};

  return {
    estado,
    store,
    authStore,
    router,
    route,
    permisosPedido,
    handlePedidoOk,
    handlePedidoError
  };
};
