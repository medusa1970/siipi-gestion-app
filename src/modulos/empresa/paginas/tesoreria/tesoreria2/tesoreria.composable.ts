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
  const $q = useQuasar();

  const montos = ref([200, 5, 100, 2, 50, 1, 20, 0.5, 10]); // Montos disponibles
  const estado = reactive({
    pedidosCaja: [],
    multa: null,
    showModal: {
      cobrar: false,
      calculator: false
    },
    montoCobrar: null,
    montoCambio: null,
    personaPro: {
      usuario: null,
      contrasena: null
    },
    personaPun: {
      usuario: null,
      contrasena: null
    },
    cantidades: new Array(montos.value.length).fill(0), // Cantidades ingresadas
    detalleCobro: {
      entidad: null,
      saldoTotal: 0
    }
  });

  const totalCambio = computed(() => {
    let total = 0;
    for (let i = 0; i < montos.value.length; i++) {
      total += montos.value[i] * estado.cantidades[i];
    }
    return total;
  });

  const getTable = async () => {
    // Obtener la fecha de inicio y fin de la semana actual
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - today.getDay()); // Lunes de la semana actual
    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + (6 - today.getDay())); // Domingo de la semana actual

    const pedidos = await api.buscarPedidos({
      vendedor: [authStore.getNegocio._id]
    });
    const pedidosSemanaActual = pedidos.filter(pedido => {
      const fechaPedido = new Date(pedido._creado);
      return fechaPedido >= startOfWeek && fechaPedido <= endOfWeek;
    });
    const pedidosAnteriores = pedidos.filter(pedido => {
      const fechaPedido = new Date(pedido._creado);
      return fechaPedido < startOfWeek;
    });

    // Filtrar los pedidos de la semana actual
    estado.pedidosCaja = [];
    for (const pedido of pedidosSemanaActual) {
      let encontrado = estado.pedidosCaja.find(
        p => p.entidad === pedido.comprador
      );
      if (!encontrado) {
        estado.pedidosCaja.push({
          entidad: pedido.comprador,
          pedidosSemanaActual: [],
          pedidosAnteriores: []
        });
        encontrado = ultimo(estado.pedidosCaja);
      }

      const fechaPedido = new Date(pedido._creado);
      if (fechaPedido >= startOfWeek && fechaPedido <= endOfWeek) {
        encontrado.pedidosSemanaActual.push(pedido);
      }
      if (fechaPedido < startOfWeek) {
        encontrado.pedidosSemanaActual.push(pedido);
      }
    }
  };

  const obtenerNombreMes = fechaPedido => {
    const meses = [
      'ENERO',
      'FEBRERO',
      'MARZO',
      'ABRIL',
      'MAYO',
      'JUNIO',
      'JULIO',
      'AGOSTO',
      'SEPTIEMBRE',
      'OCTUBRE',
      'NOVIEMBRE',
      'DICIEMBRE'
    ];
    const fecha = new Date(fechaPedido);
    const nombreMes = meses[fecha.getMonth()];
    return nombreMes;
  };
  const obtenerDiaSemana = fechaPedido => {
    const diasSemana = [
      'DOMINGO',
      'LUNES',
      'MARTES',
      'MIERCOLES',
      'JUEVES',
      'VIERNES',
      'SABADO'
    ];
    const fecha = new Date(fechaPedido);
    const nombreDia = diasSemana[fecha.getDay()];
    return nombreDia;
  };

  const multar = row => {
    console.log('first');
    $q.dialog({
      title: `${row.entidad}`,
      message: '¿Quiere activar multa?',
      cancel: true,
      persistent: true,
      prompt: {
        model: estado.multa,
        type: 'number',
        clearable: true,
        step: 2,
        label: 'Ingrese la cantidad',
        outlined: true,
        dense: true
      }
    }).onOk(async () => {
      NotifySucessCenter('Multa agregado correctamente');
    });
  };
  const bloquear = row => {
    console.log('first');
    $q.dialog({
      title: `${row.entidad}`,
      message: '¿Quiere bloquear los pedidos?',
      cancel: true,
      persistent: true
    }).onOk(async () => {
      NotifySucessCenter('Multa agregado correctamente');
    });
  };
  const abrirCobrar = fila => {
    console.log('first');
    console.log(fila);
    estado.showModal.cobrar = true;
    estado.detalleCobro.entidad = fila.entidad;
    // estado.pedidoPagar.saldoTotal = fi

    let totalPedidosPorPagar = 0;

    for (const pedido of fila.pedidosSemanaActual) {
      totalPedidosPorPagar += pedido.porPagar;
    }

    for (const pedido of fila.pedidosAnteriores) {
      totalPedidosPorPagar += pedido.porPagar;
    }
    console.log(totalPedidosPorPagar);
    estado.detalleCobro.saldoTotal = totalPedidosPorPagar;
  };

  const filter = ref('');

  onMounted(() => {
    getTable();
  });

  return {
    estado,
    store,
    authStore,
    router,
    getTable,
    totalCambio
  };
};
