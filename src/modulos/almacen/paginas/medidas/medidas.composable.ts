import type { Medida } from "#gql";
import { useAlmacen } from "~/modulos/almacen/almacen.composable";

export const useMedidas = () => {
  const { store } = useAlmacen();
  const estado = reactive({
    // lista de las medidas a recuperar del store (promisa resuelta)
    medidas: null as Medida[],
    // para seleccionar el row en edicion
    medida: null,
    // config de los filtros de la tabla
    filtros: {
      buscar: "",
    },
    // estado de los modales
    modal: {
      formModificarMedida: false,
      formCrearMedida: false,
    },
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
      const regex = new RegExp(`${estado.filtros.buscar}`, "i");
      rows = rows.filter((medida) => {
        return regex.test(medida.nombre + sinAcentos(medida.nombre));
      });
    }
    return rows;
  });

  // se creó una medida
  const handleMedidaCreada = async (medida) => {
    NotifySucessCenter("Medida creada correctamente");
    estado.modal.formCrearMedida = false;
  };

  // se modificcó una medida
  const handleMedidaModificada = async (medida) => {
    NotifySucessCenter("Medida modificada correctamente");
    estado.modal.formModificarMedida = false;
  };

  return {
    estado,
    store,
    rowsTabla,
    handleMedidaCreada,
    handleMedidaModificada,
  };
};
