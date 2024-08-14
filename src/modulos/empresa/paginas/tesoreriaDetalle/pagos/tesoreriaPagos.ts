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
  const { store, authStore, apiEmpresa, router, useEntidad2 } = useEmpresa();
  if (!authStore.autorizar(permisosTesoreria)) goTo(router, 'noAutorizado');

  const estado = reactive({
    transacciones: [],
    filtros: {
      buscar: '',
      modalidad: null,
      estado: null
    },
    showModal: {
      // recibirPagoQR: false,
      recibirPagoCupon: false,
      recibirPagoGiro: false,
      recibirPagoEfectivo: false
    },
    porPagar: null
  });

  const refreshTransacciones = async () => {
    try {
      estado.transacciones = await api.buscarTransacciones(
        {
          comprador: [store.entidad._id]
        },
        { sort: '-_creado' }
      );
    } catch (err) {
      errFailback(err);
    }
  };

  watch(
    () => store.entidad,
    async val => {
      let pedidos;
      try {
        console.log('ok');
        pedidos = await apiEmpresa.pedidosPorPagarEntidad(val._id);
        console.log('ok2');
      } catch (err) {
        errFailback(err);
      }
      estado.porPagar = pedidos.reduce(
        (total, pedido) => total + pedido.precio - pedido.pagado,
        0
      );
      console.log(estado.porPagar);
    },
    { immediate: true }
  );

  onMounted(async () => {
    refreshTransacciones();
  });

  // Rows para la tabla
  const rowsTabla = computed(() => {
    let filtered = estado.transacciones;
    if (!filtered) return [];
    if (estado.filtros.modalidad) {
      filtered = filtered.filter(
        transaccion => transaccion.modalidad === estado.filtros.modalidad
      );
    }
    if (estado.filtros.estado) {
      filtered = filtered.filter(
        transaccion => transaccion.estado === estado.filtros.estado
      );
    }
    return filtered;
  });

  const handlePagoEfectivo = () => {
    estado.showModal.recibirPagoEfectivo = false;
    refreshTransacciones();
  };
  const handlePagoGiro = () => {
    estado.showModal.recibirPagoGiro = false;
    refreshTransacciones();
  };
  const handlePagoCupon = () => {
    estado.showModal.recibirPagoCupon = false;
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
    handlePagoGiro,
    handlePagoCupon
    // handlePagoQR
  };
};
