import type { Catalogo, Oferta } from '#gql';
import { useOfertas } from '~/modulos/ofertas/ofertas.composable';

/**
 * Permisos requeridos para esta pagina
 */
export const permisosPedido = ['ADQUISICION', 'LOGISTICA', 'ALMACEN'];

/**
 * Composable
 */

export const pedidoDespachar = () => {
  const { store, authStore, router, route } = useOfertas();
  if (!authStore.autorizar(permisosPedido)) goTo(router, 'noAutorizado');

  const estado = reactive({});

  const handlePedidoOk = () => {};
  const handlePedidoError = () => {};

  return {
    estado,
    store,
    route,
    authStore,
    router,
    permisosPedido,
    handlePedidoOk,
    handlePedidoError
  };
};
