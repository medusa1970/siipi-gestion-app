import type { Medida } from '#gql';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';

/**
 * Permisos requeridos para esta pagina
 */
export const permisosMedidas = ['ADQUISICION', 'LOGISTICA', 'ALMACEN'];

/**
 * Composable
 */
export const useMedidas = () => {
  const { store, authStore, router } = useAlmacen();
  if (!authStore.autorizar(permisosMedidas)) goTo(router, 'noAutorizado');

  const estado = reactive({
    // lista de las medidas a recuperar del store (promisa resuelta)
    medidas: null as Medida[],
    // para seleccionar el row en edicion
    medida: null,
    // config de los filtros de la tabla
    filtros: {
      buscar: ''
    },
    // estado de los modales
    modal: {
      formModificarMedida: false,
      formCrearMedida: false
    }
  });

  // Inicializaciones
  onMounted(async () => {
    await store.getMedidas();
  });

  // Rows para la tabla
  const rowsTabla = computed(() => {
    let rows = store.medidas;
    if (!rows) return [];
    if (estado.filtros.buscar != null) {
      const regex = crearRegex(estado.filtros.buscar);
      rows = rows.filter(medida => {
        return regex.test(sinImportarAcentos(medida.nombre));
      });
    }
    return rows;
  });

  // se creó una medida
  const handleMedidaCreada = async medida => {
    NotifySucessCenter('Medida creada correctamente');
    estado.modal.formCrearMedida = false;
  };

  return {
    estado,
    store,
    authStore,
    router,
    rowsTabla,
    handleMedidaCreada
  };
};
