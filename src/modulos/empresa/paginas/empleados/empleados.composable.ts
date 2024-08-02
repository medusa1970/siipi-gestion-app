import type { Empleado } from '#gql';
import { useEmpresa } from '~/modulos/empresa/empresa.composable';

/**
 * Permisos requeridos para esta pagina
 */
export const permisosEmpleados = ['ADQUISICION', 'ALMACEN'];

/**
 * Composable para empresa/empleados
 */
export const useEmpleados = () => {
  const { store, authStore, router } = useEmpresa();
  if (!authStore.autorizar(permisosEmpleados)) goTo(router, '/noAutorizado');

  const estado = reactive({
    // lista de las empleados a recuperar del store (promisa resuelta)
    empleados: null as Empleado[],
    // para seleccionar el row en edicion
    empleado: null,
    // config de los filtros de la tabla
    filtros: {
      buscar: '',
    },
    // estado de los modales
    modal: {
      formModificarEmpleado: false,
      formCrearEmpleado: false,
    },
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
      const regex = new RegExp(`${estado.filtros.buscar}`, 'i');
      rows = rows.filter((empleado) => {
        return regex.test(
          JSON.stringify(empleado) + sinAcentos(JSON.stringify(empleado)),
        );
      });
    }
    console.log(rows);
    return rows;
  });

  // se creó una empleado
  const handleEmpleadoCreada = async (empleado) => {
    NotifySucessCenter('Empleado creada correctamente');
    estado.modal.formCrearEmpleado = false;
  };

  // se modificcó una empleado
  const handleEmpleadoModificada = async (empleado) => {
    NotifySucessCenter('Empleado modificada correctamente');
    estado.modal.formModificarEmpleado = false;
  };

  return {
    estado,
    store,
    authStore,
    router,
    rowsTabla,
    handleEmpleadoCreada,
    handleEmpleadoModificada,
  };
};
