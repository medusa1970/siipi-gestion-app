import type { Empleado } from '#gql';
import { useEmpresa } from '~/modulos/empresa/empresa.composable';

/**
 * Permisos requeridos para esta pagina
 */
export const permisosEmpleados = ['ADMINISTRACION'];

/**
 * Composable para empresa/empleados
 */
export const useEmpleados = () => {
  const { store, authStore, estadoEmpresa, router } = useEmpresa();
  if (!authStore.autorizar(permisosEmpleados)) goTo(router, 'noAutorizado');

  const estado = reactive({
    // lista de las empleados a recuperar del store (promisa resuelta)
    empleados: null as Empleado[],
    // para seleccionar el row en edicion
    empleado: null,
    // config de los filtros de la tabla
    filtros: {
      buscar: ''
    },
    // estado de los modales
    showModal: {
      crearEmpleado: false
    }
  });

  // Inicializaciones
  onMounted(async () => {
    await store.getEmpleados();
  });

  // Rows para la tabla
  const rowsTabla = computed(() => {
    let rows = store.empleados;
    if (!rows) return [];
    if (estado.filtros.buscar != null) {
      const regex = crearRegex(estado.filtros.buscar);
      rows = rows.filter(empleado => {
        return regex.test(sinImportarAcentos(JSON.stringify(empleado)));
      });
    }
    return rows;
  });

  // se creó una empleado
  const handleEmpleadoCreado = async empleado => {
    NotifySucessCenter('Empleado creado correctamente');
    estado.showModal.crearEmpleado = false;
  };

  return {
    estado,
    store,
    authStore,
    router,
    rowsTabla,
    handleEmpleadoCreado
  };
};
