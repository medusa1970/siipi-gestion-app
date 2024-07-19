import { useAuthStore } from '@/modulos/main/negocio/useAuthStore';

export const listaPedidos = () => {
  const authStore = useAuthStore();

  const estado = reactive({
    pedidosEntidad: [],
    pedidosFiltrados: [],
    pedidosRecibidos: [],
  });

  const buscarPedidos = async () => {
    try {
      const pedidos = await apiPedido.pedidos_buscar(
        { comprador: [authStore.negocio._id] },
        { loading: true },
        {},
        authStore.token,
      );
      // console.log(listaPedidos);
      //@ts-ignore
      estado.pedidosEntidad = await Promise.all(
        pedidos.map((pedido) =>
          apiPedido
            .pedido_leerEstado(
              { _id: [pedido._id] },
              { errorSiVacio: true },
              authStore.token,
            )
            .then((res) => ({ ...pedido, estadoItems: extraer(res) })),
        ),
      );

      if (pedidos) {
        // console.log(estado.pedidosEntidad);
        const pedidos = estado.pedidosEntidad.reduce(
          (accumulator: any, pedido: any) => {
            const hasReceived = pedido.items.some((item: any) =>
              item.estado.some((estado: any) => estado.estado === 'recibido'),
            );

            if (hasReceived) {
              accumulator.recibidos.push(pedido);
            } else {
              accumulator.noRecibidos.push(pedido);
            }

            return accumulator;
          },
          { recibidos: [], noRecibidos: [] },
        );
        estado.pedidosRecibidos = pedidos.recibidos;
        estado.pedidosEntidad = pedidos.noRecibidos;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filtroHistorial = (date: any) => {
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    estado.pedidosFiltrados = estado.pedidosRecibidos.filter((pedido: any) => {
      const pedidoDate = new Date(pedido._creado);
      pedidoDate.setHours(0, 0, 0, 0);

      return pedidoDate.getTime() === dateObj.getTime();
    });
  };

  return { estado, buscarPedidos, filtroHistorial };
};
