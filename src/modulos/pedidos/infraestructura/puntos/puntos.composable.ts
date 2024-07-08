import type { Pedido } from '#gql';

export const usePedidoPuntos = () => {
  const estado = reactive({
    pedidosSinAceptar: [] as Pedido[],
    pedidosAceptados: [] as Pedido[],
  });

  return { estado };
};
