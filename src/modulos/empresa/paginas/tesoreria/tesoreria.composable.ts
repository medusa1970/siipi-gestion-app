import type { Pedido } from '#gql';
import { useEmpresa } from '~/modulos/empresa/empresa.composable';

/**
 * Permisos requeridos para esta pagina
 */
export const permisosTesoreria = ['ADMINISTRACION'];

/**
 * Composable
 */
export const useTesoreria = () => {
  const { store, authStore, estadoEmpresa, router } = useEmpresa();
  if (!authStore.autorizar(permisosTesoreria)) goTo(router, 'noAutorizado');

  const estado = reactive({
    pedidos: [] as Pedido[],
    pedidosSemanaActual: [] as Pedido[],
    pedidosAnteriores: [] as Pedido[],
    row: null,
    filtros: {
      buscar: ''
    },
    showModal: {
      detalles: false
    }
  });

  onBeforeMount(async () => {
    estado.pedidos = await api.buscarPedidos({
      vendedor: [authStore.getNegocio._id]
    });
    estado.pedidosSemanaActual = estado.pedidos.filter(pedido => {
      return new Date(pedido._creado) >= lunes(0);
    });
    estado.pedidosAnteriores = estado.pedidos.filter(pedido => {
      return new Date(pedido._creado) < lunes(0);
    });
  });

  /**
   * 1 : el proximo lunes
   * 0 : el ultimo lunes
   * -1: el lunes la semana anterior
   * -2: etc...
   */
  const lunes = (semana = 0) => {
    // hoy, a las 00:00:00
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);

    // lunes anterior
    const lunes = new Date(today);
    lunes.setDate(today.getDate() - today.getDay() + 1 + 7 * semana);
    return lunes;
  };

  // Rows para la tabla
  const rowsTabla = computed(() => {
    let rows = [];
    if (!estado.pedidos) return [];

    for (const pedido of estado.pedidosSemanaActual) {
      let encontrado = rows.findIndex(
        p => p.entidad._id === pedido.comprador._id
      );
      if (encontrado >= 0) {
        rows[encontrado].pedidosSemanaActual.push(pedido);
      } else {
        rows.push({
          entidad: pedido.comprador,
          pedidosSemanaActual: [pedido],
          pedidosAnteriores: []
        });
      }
    }

    for (const pedido of estado.pedidosAnteriores) {
      let encontrado = rows.findIndex(
        p => p.entidad._id === pedido.comprador._id
      );
      if (encontrado) {
        rows[encontrado].pedidosAnteriores.push(pedido);
      } else {
        rows.push({
          entidad: pedido.comprador,
          pedidosSemanaActual: [],
          pedidosAnteriores: [pedido]
        });
      }
    }

    return rows;
  });

  return {
    estado,
    store,
    authStore,
    router,
    rowsTabla
  };
};
