import { useAuthStore } from '@/modulos/main/useAuthStore';

export const usePedido = () => {
  const route = useRoute();
  const estado = reactive({
    pedidoDetalle: {},
    pedidoItemsEstado: '',
    itemsEstadoAjustado: [],
    precioGeneral: [],

    modal: {
      isAjustarItem: false
    },
    pedido_item: {
      id: '',
      cantidad: '',
      comentario: ''
    }
  });
  const authStore = useAuthStore();

  const buscarPedidoID = async (pedidoID: string) => {
    let pedido;
    try {
      const pedido = await buscarUno(GqlBuscarPedidos, {
        busqueda: pedidoID
      });
    } catch (err) {
      errFailback(err);
    }
    estado.pedidoDetalle = pedido;
    estado.precioGeneral = pedido.items.reduce((total, item) => {
      return total + item.oferta.precio * item.cantidad;
    }, 0);

    estado.pedidoItemsEstado =
      pedido.items[0].estado?.[pedido.items[0].estado?.length - 1];
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
  };

  const ajustarItem = async (row: any) => {
    estado.modal.isAjustarItem = true;
    estado.pedido_item.id = row._id;
    estado.pedido_item.cantidad = row.cantidad;
  };
  const ajustarItemGuardar = async () => {
    try {
      const pedidoAjustarItem = await buscarUno(GqlAjustarItem, {
        busqueda: route.params.id,
        itemId: estado.pedido_item.id,
        nuevaCantidad: estado.pedido_item.cantidad,
        comentario: estado.pedido_item.comentario
      });
    } catch (err) {
      NotifyError('Error al ajustar cantidad');
      errFailback(err);
      return;
    }
    NotifySucessCenter('Cantidad ajustada');
    buscarPedidoID(route.params.id as string);
    estado.modal.isAjustarItem = false;
  };
  return {
    estado,
    buscarPedidoID,
    authStore,
    ajustarItem,
    ajustarItemGuardar
  };
};
