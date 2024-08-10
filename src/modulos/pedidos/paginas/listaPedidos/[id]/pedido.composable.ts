import { apiPedido } from '~/modulos/pedidos/API/pedidos.api';
import { useAuthStore } from '@/modulos/main/useAuthStore';

export const usePedido = () => {
  const estado = reactive({
    pedidoDetalle: {},
    pedidoItemsEstado: '',
    itemsEstadoAjustado: []
  });
  const authStore = useAuthStore();

  const buscarPedidoID = async (pedidoID: string) => {
    console.log('first');
    const pedido = await apiPedido.pedido_buscar(
      { _id: [pedidoID] }, //@ts-expect-error
      useGqlToken(authStore.token)
    );
    console.log(pedido);
    // const [pedido] = await pedidoService.pedidoBuscar(
    //   { _id: [pedidoID] },
    //   // @ts-expect-error (creado dinamicamente)
    //   useGqlToken(useAuth.token)
    // );
    estado.pedidoDetalle = pedido;
    estado.precioGeneral = pedido.items.reduce((total, item) => {
      //@ts-ignore
      return total + item.oferta.precio * item.cantidad;
    }, 0);

    //@ts-ignore
    estado.pedidoItemsEstado = //@ts-ignore
      pedido.items[0].estado?.[pedido.items[0].estado?.length - 1]; //@ts-ignore
    //@ts-ignore
    const itemsConEstadoAjustado = pedido.items.filter((item: any) => {
      const estadosAjustados = item.estado.filter(
        (estado: any) => estado.estado === 'ajustado'
      );
      return estadosAjustados.length > 0; // Solo retener items con al menos un estado "ajustado"
    });

    // Obtener la información de nombre, estado ajustado, comentario y valor (último estado ajustado)
    estado.itemsEstadoAjustado = itemsConEstadoAjustado.map((item: any) => {
      const estadosAjustados = item.estado.filter(
        (estado: any) => estado.estado === 'ajustado'
      );
      const ultimoEstadoAjustado =
        estadosAjustados[estadosAjustados.length - 1];
      return {
        nombre: item.oferta.nombre,
        estadoAjustado: ultimoEstadoAjustado.estado,
        comentario: ultimoEstadoAjustado.comentario,
        valor: ultimoEstadoAjustado.valor
      };
    });

    // Mostrar la información
  };

  return {
    estado,
    buscarPedidoID,
    authStore
  };
};
