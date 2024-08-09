import { useAuthStore } from '~/modulos/main/useAuthStore';
import { apiPedido } from '../../API/pedidos.api';

export const useMisPedidos = () => {
  const authStore = useAuthStore();
  const estado = reactive({
    pedidosEntidad: [],
    pedidosRecibidos: []
  });

  const buscarPedidos = async () => {
    // showLoading();
    // const listaPedidos = await pedidoService.pedidoBuscar(
    //   { comprador: [useAuth.negocioElegido._id] },
    //   // @ts-expect-error (creado dinamicamente)
    //   useGqlToken(useAuth.token)
    // );
    const listaPedidos = await apiPedido.pedido_buscar(
      { comprador: [authStore.negocio._id] },
      {},
      useGqlToken(authStore.token)
    );
    console.log(listaPedidos);
    //@ts-ignore
    estado.pedidosEntidad = await Promise.all(
      listaPedidos.map(pedido =>
        apiPedido
          .pedido_leerEstadoItems(
            { _id: pedido._id },
            { loading: true },
            authStore.token
          )
          .then(res => ({ ...pedido, estadoItems: res }))
      )
    );
    console.log(estado.pedidosEntidad);
    // console.log(estado.pedidosEntidad);
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

  return {
    estado,
    buscarPedidos
  };
};
