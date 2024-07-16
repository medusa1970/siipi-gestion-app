import type { Entidad } from '#gql';
import { useAlmacen } from '~/modulos2/almacen/almacen.composable';

export const useProveedores = () => {
  const { store } = useAlmacen();
  const estado = reactive({
    // lista de las proveedores a recuperar del store (promisa resuelta)
    proveedores: null as Entidad[],
    // para seleccionar el row en edicion
    proveedor: null,
    // config de los filtros de la tabla
    filtros: {
      buscar: '',
    },
    // estado de los modales
    modal: {
      formModificarProveedor: false,
      formCrearProveedor: false,
    },
  });

  // Inicializaciones
  onMounted(async () => {
    await store.traerProveedores();
  });

  // Rows para la tabla
  const rowsTabla = computed(() => {
    let rows = store.proveedores;
    if (!rows) return [];
    if (estado.filtros.buscar != null) {
      const regex = new RegExp(`${estado.filtros.buscar}`, 'i');
      rows = rows.filter((proveedor) => {
        return (
          regex.test(proveedor.nombre + sinAcentos(proveedor.nombre)) ||
          regex.test(proveedor.descripcion ?? '') ||
          regex.test(sinAcentos(proveedor.descripcion ?? ''))
        );
      });
    }
    return rows;
  });

  // se creó una proveedor
  const handleProveedorCreado = async (proveedor) => {
    NotifySucessCenter('Proveedor creada correctamente');
    estado.modal.formCrearProveedor = false;
    await store.traerProveedores();
  };

  // se modificcó una proveedor
  const handleProveedorModificado = async (proveedor) => {
    NotifySucessCenter('Proveedor modificada correctamente');
    estado.modal.formModificarProveedor = false;
    await store.traerProveedores();
  };

  return {
    estado,
    store,
    rowsTabla,
    handleProveedorCreado,
    handleProveedorModificado,
  };
};
