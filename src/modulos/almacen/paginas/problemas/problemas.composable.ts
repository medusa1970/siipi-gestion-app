import type { Problema } from '#gql';
import type { SelectOpcion } from '~/components/input/select.interface';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';

/**
 * Permisos requeridos para esta pagina
 */
export const permisosProblemas = ['ADMINISTRACION'];

/**
 * Composable
 */
export const useProblemas = () => {
  const { store, authStore, estadoAlmacen, router } = useAlmacen();
  if (!authStore.autorizar(permisosProblemas)) goTo(router, 'noAutorizado');

  const estado = reactive({
    problemaID: null as String,
    // config de los filtros de la tabla
    filtros: {
      productoSeleccionado: '',
      estado: null
    },
    showModal: {
      resolver: false
    }
  });

  const problemaSeleccionado = computed(() => {
    return store.problemas?.find(p => p._id === estado.problemaID);
  });

  const rowsTabla = computed(() => {
    let filtered = store.problemas ?? [];
    if (
      estado.filtros.productoSeleccionado != null &&
      estado.filtros.productoSeleccionado !== ''
    ) {
      filtered = filtered.filter(
        problema =>
          problema.producto._id === estado.filtros.productoSeleccionado
      );
    }
    if (estado.filtros.estado === 'soloPendientes') {
      filtered = filtered.filter(problema => !problema.resuelto);
    }
    if (estado.filtros.estado === 'soloResueltos') {
      filtered = filtered.filter(problema => problema.resuelto);
    }
    return filtered;
  });
  const rowsTablaPendientes = computed(() =>
    rowsTabla.value.filter(problema => !problema.resuelto)
  );
  const rowsTablaResueltos = computed(() =>
    rowsTabla.value.filter(problema => problema.resuelto)
  );

  const selectProductoFiltro = computed(() => {
    let options = [];
    if (store.productos) {
      for (const prod of store.productos) {
        options.push(<SelectOpcion>{
          label: prod.nombre,
          value: prod._id
        });
      }
    }
    return options;
  });

  onBeforeMount(async () => {
    store.getProductos();
    store.getProblemas();
  });

  const handleProblemaResuelto = async empleado => {
    NotifySucessCenter('Problema resuelto correctamente');
    estado.showModal.resolver = false;
  };

  return {
    estado,
    store,
    authStore,
    router,
    rowsTablaResueltos,
    rowsTablaPendientes,
    selectProductoFiltro,
    problemaSeleccionado,
    handleProblemaResuelto
  };
};
