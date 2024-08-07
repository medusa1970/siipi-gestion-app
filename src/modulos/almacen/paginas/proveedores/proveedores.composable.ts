import type { Entidad } from "#gql";
import { useAlmacen } from "~/modulos/almacen/almacen.composable";

/**
 * Permisos requeridos para esta pagina
 */
export const permisosProveedores = ["ADQUISICION", "LOGISTICA", "ALMACEN"];

/**
 * Composable
 */
export const useProveedores = () => {
  const { store, authStore, router } = useAlmacen();
  if (!authStore.autorizar(permisosProveedores)) goTo(router, "noAutorizado");

  const estado = reactive({
    // lista de las proveedores a recuperar del store (promisa resuelta)
    proveedores: null as Entidad[],
    // para seleccionar el row en edicion
    proveedor: null,
    // config de los filtros de la tabla
    filtros: {
      buscar: "",
    },
    // estado de los modales
    modal: {
      formModificarProveedor: false,
      formCrearProveedor: false,
    },
  });

  // Inicializaciones
  onMounted(async () => {
    await store.getProveedores();
  });

  // Rows para la tabla
  const rowsTabla = computed(() => {
    let rows = store.proveedores;
    if (!rows) return [];
    if (estado.filtros.buscar != null) {
      const regex = new RegExp(`${estado.filtros.buscar}`, "i");
      rows = rows.filter((proveedor) => {
        return (
          regex.test(proveedor.nombre + sinAcentos(proveedor.nombre)) ||
          regex.test(proveedor.descripcion ?? "") ||
          regex.test(sinAcentos(proveedor.descripcion ?? ""))
        );
      });
    }
    return rows;
  });

  // se creó un proveedor
  const handleProveedorCreado = async (proveedor) => {
    NotifySucessCenter("Proveedor creado correctamente");
    estado.modal.formCrearProveedor = false;
  };

  // se modificcó un proveedor
  const handleProveedorModificado = async (proveedor) => {
    NotifySucessCenter("Proveedor modificado correctamente");
    estado.modal.formModificarProveedor = false;
  };

  return {
    estado,
    store,
    authStore,
    router,
    rowsTabla,
    handleProveedorCreado,
    handleProveedorModificado,
  };
};
