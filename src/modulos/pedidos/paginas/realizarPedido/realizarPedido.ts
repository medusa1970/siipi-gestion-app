import type { Catalogo, Oferta } from '#gql';
import { useOfertas } from '~/modulos/ofertas/ofertas.composable';
import { usePedidos } from '../../pedidos.composable';
import { apiPedido } from '../../API/pedidos.api';

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
    catalogo: null as Catalogo,
    filtros: {
      catalogo: null,
      buscar: null,
      seleccionados: false
    }
  });

  const rowsParaMostrar = computed(() => {
    let filtered = clone(estado.catalogo);
    if (!filtered) return null;

    // solo las ofertas completos
    const filtroCompleto = catalogo => {
      catalogo.ofertas = catalogo.ofertas.filter(o => !ofertaIncompleta(o));
      if (catalogo.hijas) {
        catalogo.hijas = catalogo.hijas.map(h => filtroCompleto(h));
      }
      return catalogo;
    };
    filtered = filtroCompleto(filtered);

    // // filtro segun busqueda
    // if (estado.filtros.buscar != null) {
    //   const regex = new RegExp(`${estado.filtros.buscar}`, 'i');
    //   const filtroBuscar = catalogo => {
    //     catalogo.ofertas = catalogo.ofertas.filter(o => {
    //       return regex.test(sinImportarAcentos(o.nombre));
    //     });
    //     if (catalogo.hijas) {
    //       catalogo.hijas = catalogo.hijas.map(h => filtroBuscar(h));
    //     }
    //     return catalogo;
    //   };
    //   filtered = filtroBuscar(filtered);
    // }

    // no mostrar las categorias vacias
    const hasOfertasCat = catalogo => {
      if (catalogo.ofertas && catalogo.ofertas.length > 0) {
        return catalogo;
      }
      if (catalogo.hijas) {
        const nuevasHijas = [];
        for (const hija of catalogo.hijas) {
          const nuevaHija = hasOfertasCat(hija);
          if (nuevaHija !== null) {
            nuevasHijas.push(nuevaHija);
          }
        }
        catalogo.hijas = nuevasHijas;
      }
      return catalogo.hijas && catalogo.hijas.length > 0 ? catalogo : null;
    };
    filtered = hasOfertasCat(filtered);

    return filtered;
  });

  onMounted(async () => {
    estado.catalogo = (await apiPedido.pedido_leerMenuCompleto(
      authStore.negocio._id,
      authStore.token
    )) as Catalogo;
  });

  const handleInputChange2 = (event, oferta) => {
    event.target.value = Math.max(
      0,
      event.target.value === '' ? 0 : event.target.value
    );
    const nuevoValor = event.target.value;
    const index = storePedidos.listaPedido.findIndex(
      item => item._id === oferta._id
    );

    if (nuevoValor > 0) {
      if (index > -1) {
        storePedidos.listaPedido[index].cantidad = nuevoValor;
      } else {
        storePedidos.listaPedido.push(
          Object.assign(oferta, { cantidad: nuevoValor })
        );
      }
    } else {
      if (index > -1) {
        storePedidos.listaPedido.splice(index, 1);
      }
    }
  };

  return {
    estado,
    storeOfertas,
    storePedidos,
    authStore,
    router,
    rowsParaMostrar,
    ofertaIncompleta,
    handleInputChange2
  };
};
