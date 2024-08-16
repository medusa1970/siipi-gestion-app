import { apiPedido } from '~/modulos/pedidos/API/pedidos.api';
import { useAuthStore } from '@/modulos/main/useAuthStore';

export const useMiPedido = () => {
  const router = useRouter();
  const route = useRoute();
  const estado = reactive({
    pedidoDetalle: {},
    pedidoItemsEstado: '',
    itemsEstadoAjustado: [],
    precioGeneral: [],

    modal: {
      isShowPassword: false,
      isAjustarItem: false
    },
    pedidoID: '',
    passwordChofer: '',
    pedido_item: {
      id: '',
      cantidad: '',
      comentario: ''
    }
  });
  const authStore = useAuthStore();

  const buscarPedidoID = async (pedidoID: string) => {
    const pedido = await apiPedido.pedido_buscarUno(
      { _id: [pedidoID] }, //@ts-expect-error
      useGqlToken(authStore.token)
    );

    estado.pedidoDetalle = pedido; //@ts-ignore
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
  };

  const abrirModalRecibirPedido = (pedidoID: string) => {
    estado.modal.isShowPassword = true;
    estado.pedidoID = pedidoID;
  };

  const recibirPedido = async () => {
    // INPUT PASSWORD CHOFER
    const password = 'choferSiipi123';

    if (estado.passwordChofer == password) {
      console.log(estado.pedidoID);
      const pedidoRecibido = await apiPedido.pedido_recibirOfertas(
        estado.pedidoID,
        authStore.token
      );
      console.log(pedidoRecibido);
      if (pedidoRecibido) {
        NotifySucessCenter('Pedido recibido');
        estado.modal.isShowPassword = false;
        estado.passwordChofer = '';
        router.push('/punto/misPedidos');
      } else NotifyError('Error al recibir pedido');
    } else {
      NotifyError('Contraseña incorrecta');
      estado.modal.isShowPassword = false;
      estado.passwordChofer = '';
    }
  };

  const ajustarItem = async (row: any) => {
    estado.modal.isAjustarItem = true;
    estado.pedido_item.id = row._id;
    estado.pedido_item.cantidad = row.cantidad;
  };
  const ajustarItemGuardar = async () => {
    route.params.id;
    const pedidoAjustarItem = await apiPedido.pedido_ajustar(
      //@ts-ignore
      route.params.id,
      estado.pedido_item.id,
      estado.pedido_item.cantidad,
      estado.pedido_item.comentario
    );
    console.log(pedidoAjustarItem);
    if (pedidoAjustarItem) {
      NotifySucessCenter('Cantidad ajustada'); //@ts-ignore
      buscarPedidoID(route.params.id);
    } else NotifyError('Error al ajustar cantidad');
    estado.modal.isAjustarItem = false;
  };
  return {
    estado,
    buscarPedidoID,
    authStore,
    abrirModalRecibirPedido,
    recibirPedido,
    ajustarItem,
    ajustarItemGuardar
  };
};
//cambio
