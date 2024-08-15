import { useAuthStore } from '~/modulos/main/useAuthStore';
import { apiPedido } from '../../API/pedidos.api';
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
    // showLoading();
    const listaPedidos = await api.buscarPedidos(
      { comprador: [authStore.negocio._id] },
      {},
      {},
      useGqlToken(authStore.token)
    );
    //@ts-ignore
    estado.pedidosEntidad = await Promise.all(
      listaPedidos.map(pedido =>
        apiPedido
          .pedido_leerEstadoItems(
            { _id: [pedido._id] },
            { loading: true },
            authStore.token
          )
          .then(res => ({ ...pedido, estadoItems: res }))
      )
    );
    console.log(estado.pedidosEntidad);

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
    // hideLoading();
    estado.pedidosRecibidos = pedidos.recibidos;
    estado.pedidosEntidad = pedidos.noRecibidos;

    // hideLoading();
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
    console.log(estado.pedidosFiltrados);

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
