import { useAlmacen } from '~/modulos/almacen/almacen.composable';
import { useOfertas } from '~/modulos/ofertas/ofertas.composable';

export const useProductoOfertas = () => {
  const { store, authStore, router, productoOfertas, route } = useAlmacen();
  const { ofertaIncompleta } = useOfertas();
  const estado = reactive({
    ofertas: [],
    filtros: {
      buscar: null,
      completud: null
    }
  });

  onMounted(async () => {
    estado.ofertas = await productoOfertas(route.params.id);
  });

  const rowsParaMostrar = computed(() => {
    let filtered = estado.ofertas;
    if (!filtered) return [];

    filtered = filtered.filter(oferta => {
      // solo ofertas completas?
      const incompleto = ofertaIncompleta(oferta);
      if (
        (estado.filtros.completud === 'soloCompletos' && incompleto) ||
        (estado.filtros.completud === 'soloIncompletos' && !incompleto)
      ) {
        return false;
      }
      // busqueda textual
      if (estado.filtros.buscar) {
        const regex = crearRegex(estado.filtros.buscar);
        if (!regex.test(sinImportarAcentos(oferta.nombre))) {
          return false;
        }
      }
      return true;
    });

    return filtered;
  });

  return {
    estado,
    store,
    authStore,
    router,
    ofertaIncompleta,
    rowsParaMostrar
  };
};
