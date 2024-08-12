import { useEmpresa } from '~/modulos/empresa/empresa.composable';
const route = useRoute();

/**
 * Permisos requeridos para esta pagina
 */
export const permisosTesoreria = ['ADMINISTRACION'];

/**
 * Composable
 */
export const useTesoreriaPagos = () => {
  const { store, authStore, estadoEmpresa, router, useEntidad2 } = useEmpresa();
  if (!authStore.autorizar(permisosTesoreria)) goTo(router, 'noAutorizado');

  const estado = reactive({
    transacciones: [],
    filtros: {
      buscar: ''
    },
    showModal: {
      // recibirPagoQR: false,
      recibirPagoGiro: false,
      recibirPagoEfectivo: false
    }
  });

  const refreshTransacciones = async (id = null) => {
    try {
      estado.transacciones = await api.buscarTransacciones({
        comprador: [store.entidad._id]
      });
    } catch (err) {
      errFallBack(err);
    }
  };

  onMounted(async () => {
    refreshTransacciones(store.infoPedidos);
  });

  // Rows para la tabla
  const rowsTabla = computed(() => {
    return estado.transacciones;
  });

  const handlePagoEfectivo = () => {
    estado.showModal.recibirPagoEfectivo = false;
    refreshTransacciones();
  };
  const handlePagoGiro = () => {
    estado.showModal.recibirPagoGiro = false;
    refreshTransacciones();
  };
  // const handlePagoQR = () => {
  //   estado.showModal.recibirPagoQR = false;
  // };

  return {
    estado,
    store,
    authStore,
    router,
    rowsTabla,
    handlePagoEfectivo,
    handlePagoGiro
    // handlePagoQR
  };
};
