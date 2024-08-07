import type { Marca } from "#gql";
import { useAlmacen } from "~/modulos/almacen/almacen.composable";

/**
 * Permisos requeridos para esta pagina
 */
export const permisosMarcas = ["ADQUISICION", "LOGISTICA", "ALMACEN"];

/**
 * Composable
 */
export const useMarcas = () => {
  const { store, authStore, router } = useAlmacen();
  if (!authStore.autorizar(permisosMarcas)) goTo(router, "noAutorizado");

  const estado = reactive({
    // lista de las marcas a recuperar del store (promisa resuelta)
    marcas: null as Marca[],
    // para seleccionar el row en edicion
    marca: null,
    // config de los filtros de la tabla
    filtros: {
      buscar: "",
    },
    // estado de los modales
    modal: {
      formModificarMarca: false,
      formCrearMarca: false,
    },
  });

  // Inicializaciones
  onMounted(async () => {
    await store.getMarcas();
  });

  // Rows para la tabla
  const rowsTabla = computed(() => {
    let rows = store.marcas;
    if (!rows) return [];
    if (estado.filtros.buscar != null) {
      const regex = new RegExp(`${estado.filtros.buscar}`, "i");
      rows = rows.filter((marca) => {
        return (
          regex.test(marca.nombre + sinAcentos(marca.nombre)) ||
          regex.test(marca.descripcion ?? "") ||
          regex.test(sinAcentos(marca.descripcion ?? ""))
        );
      });
    }
    return rows;
  });

  // se creó una marca
  const handleMarcaCreada = async (marca) => {
    NotifySucessCenter("Marca creada correctamente");
    estado.modal.formCrearMarca = false;
  };

  // se modificcó una marca
  const handleMarcaModificada = async (marca) => {
    NotifySucessCenter("Marca modificada correctamente");
    estado.modal.formModificarMarca = false;
  };

  return {
    estado,
    store,
    authStore,
    router,
    rowsTabla,
    handleMarcaCreada,
    handleMarcaModificada,
  };
};
