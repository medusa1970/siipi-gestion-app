import { useAuthStore } from '~/modulos/main/useAuthStore';
import { storePedido } from '@/modulos/pedidos/pedidos.store';

export const useMisPedidos = () => {
  const pedidoStore = storePedido();
  const authStore = useAuthStore();
  const estado = reactive({
    pedidosEntidad: [],
    pedidosRecibidos: [],
    pedidosFiltrados: []
  });

  const buscarPedidos = async () => {
    let listaPedidos;
    try {
      listaPedidos = await buscarVarios(GqlBuscarPedidos, {
        busqueda: {
          comprador: [authStore.negocio._id]
        }
      });
    } catch (err) {
      errFailback(err);
    }
    estado.pedidosEntidad = await Promise.all(
      listaPedidos.map(pedido =>
        buscarUno(GqlLeerEstadoPedido, {
          busqueda: pedido._id
        }).then(res => ({ ...pedido, estadoItems: res }))
      )
    );

    const pedidos = estado.pedidosEntidad.reduce(
      (accumulator: any, pedido: any) => {
        const hasReceived = pedido.items.some((item: any) =>
          item.estado.some((estado: any) => estado.estado === 'recibido')
        );

        if (hasReceived) {
          accumulator.recibidos.push(pedido);
        } else {
          accumulator.noRecibidos.push(pedido);
        }

        return accumulator;
      },
      { recibidos: [], noRecibidos: [] }
    );
    pedidoStore.pedidosRecibidos = pedidos.recibidos;
    estado.pedidosEntidad = pedidos.noRecibidos;
  };

  const filtroHistorial = (date: any) => {
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    estado.pedidosFiltrados = pedidoStore.pedidosRecibidos.filter(
      (pedido: any) => {
        const pedidoDate = new Date(pedido._creado);
        pedidoDate.setHours(0, 0, 0, 0);

        return pedidoDate.getTime() === dateObj.getTime();
      }
    );

    // console.log(pedidosFiltrados);
    // console.log(pedidosFiltrados.length);
  };

  return {
    estado,
    authStore,
    buscarPedidos,
    filtroHistorial
  };
};
