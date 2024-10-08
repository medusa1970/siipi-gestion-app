import type { Bloque } from '#gql';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';

/**
 * Permisos requeridos para esta pagina
 */
export const permisosBloques = ['ADQUISICION', 'LOGISTICA', 'ALMACEN'];

/**
 * Composable
 */
export const useBloques = () => {
  const { store, authStore, router } = useAlmacen();
  if (!authStore.autorizar(permisosBloques)) goTo(router, 'noAutorizado');

  const estado = reactive({
    // lista de las bloques a recuperar del store (promisa resuelta)
    bloques: null as Bloque[],
    // para seleccionar el row en edicion
    bloque: null,
    // config de los filtros de la tabla
    filtros: {
      buscar: ''
    },
    // estado de los modales
    modal: {
      formModificarBloque: false,
      formCrearBloque: false
    }
  });

  // Inicializaciones
  onMounted(async () => {
    await store.getEntidad();
  });

  // Rows para la tabla
  const rowsTabla = computed(() => {
    if (!store.entidad?.bloques) return [];
    let rows = store.entidad.bloques;
    if (!rows) return [];
    if (estado.filtros.buscar != null) {
      const regex = crearRegex(estado.filtros.buscar);
      rows = rows.filter(bloque => {
        return regex.test(
          sinImportarAcentos(bloque.nombre + (bloque.descripcion ?? ''))
        );
      });
    }
    return rows;
  });

  // se creó un bloque
  const handleBloqueCreado = async bloque => {
    NotifySucessCenter('Bloque creada correctamente');
    estado.modal.formCrearBloque = false;
    store.refreshEntidad();
  };

  // se modificcó un bloque
  const handleBloqueModificado = async bloque => {
    NotifySucessCenter('Bloque modificada correctamente');
    estado.modal.formModificarBloque = false;
    store.refreshEntidad();
  };

  return {
    estado,
    store,
    authStore,
    router,
    rowsTabla,
    handleBloqueCreado,
    handleBloqueModificado
  };
};
