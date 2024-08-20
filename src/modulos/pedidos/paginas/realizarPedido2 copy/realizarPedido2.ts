import type { Catalogo, Oferta } from '#gql';
import { useOfertas } from '~/modulos/ofertas/ofertas.composable';
import { usePedidos } from '../../pedidos.composable';

/**
 * Permisos requeridos para esta pagina
 */
export const permisosOfertas = ['ADQUISICION', 'LOGISTICA', 'ALMACEN'];

/**
 * Composable
 */

export const useRealizarPedido2 = () => {
  const { store: storePedidos } = usePedidos();
  const {
    store: storeOfertas,
    authStore,
    router,
    ofertaIncompleta
  } = useOfertas();
  if (!authStore.autorizar(permisosOfertas)) goTo(router, 'noAutorizado');

  const estado = reactive({
    ofertas: [] as Oferta[],
    catalogoSeleccionado: null,
    filtros: {
      catalogo: null,
      buscarFiltro: null,
      seleccionados: false
    }
  });

  const handleInputChange2 = (event, oferta) => {
    console.log(oferta);
    event.target.value = Math.max(0, event.target.value);
    const nuevoValor = event.target.value;
    const index = storePedidos.listaPedido.findIndex(
      item => item._id === oferta._id
    );
    if (index > -1) {
      storePedidos.listaPedido[index].cantidad = nuevoValor;
    } else {
      storePedidos.listaPedido.push(
        Object.assign(oferta, { cantidad: nuevoValor })
      );
    }
  };

  return {
    estado,
    storeOfertas,
    storePedidos,
    authStore,
    router,
    ofertaIncompleta,
    handleInputChange2
  };
};
