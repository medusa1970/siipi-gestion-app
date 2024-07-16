import type { Marca } from '#gql';
import { useAlmacen } from '~/modulos2/almacen/almacen.composable';

export const useMarcas = () => {
  const { store } = useAlmacen();
  const estado = reactive({
    // lista de las marcas a recuperar del store (promisa resuelta)
    marcas: null as Marca[],
    // para seleccionar el row en edicion
    marca: null,
    // config de los filtros de la tabla
    filtros: {
      buscar: '',
    },
    // estado de los modales
    modal: {
      formModificarMarca: false,
      formCrearMarca: false,
    },
  });

  // Inicializaciones
  onMounted(async () => {
    await store.traerMarcas();
  });

  // Rows para la tabla
  const rowsTabla = computed(() => {
    let rows = store.marcas;
    if (rows && estado.filtros.buscar != null) {
      const regex = new RegExp(`${estado.filtros.buscar}`, 'i');
      rows = rows.filter((marca) => {
        return regex.test(marca.nombre + sinAcentos(marca.nombre));
      });
    }
    return rows;
  });

  // se creó una marca
  const handleMarcaCreada = async (marca) => {
    NotifySucessCenter('Marca creada correctamente');
    estado.modal.formCrearMarca = false;
    await store.traerMarcas();
  };

  // se modificcó una marca
  const handleMarcaModificada = async (marca) => {
    NotifySucessCenter('Marca modificada correctamente');
    estado.modal.formModificarMarca = false;
    await store.traerMarcas();
  };

  return {
    estado,
    store,
    rowsTabla,
    handleMarcaCreada,
    handleMarcaModificada,
  };
};
