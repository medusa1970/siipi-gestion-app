import { ref, reactive, onMounted } from 'vue';
import {
  NotifyError,
  NotifySucess,
  NotifySucessCenter,
  hideLoading,
  showLoading,
} from '~/helpers/message.service';
import { useQuasar } from 'quasar';
import { pedidoService } from '@/services/punto/pedido.service';
import { authStore } from '@/stores/auth.store';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'vue-router';
import { pedidoStore } from '@/stores/pedido.store';
import { menuService } from '~/services/punto/menu.service';
import { ofertaService } from '~/services/marca/ofertas.service';
/**
 * LOGICA
 */
export const usePedido = () => {
  const useAuth = authStore();
  const router = useRouter();
  const usePedidoStore = pedidoStore();
  const estado = reactive({
    catalogosOfertas: [],
    modal: {
      isAddOferta: false,
      isAjustarItem: false,
    },
    isEditCantidad: false,
    pedidosEntidad: [],
    pedidoDetalle: {},
    precioGeneral: 0,
    pedidosAceptados: [],
    pedidosSinAceptar: [],
    pedidoItemsEstado: '',
    itemPedido: {
      id: '',
      cantidad: 0,
      comentario: '',
    },
    ListaOfertasPedido: [] as any[],
  });

  const obtenerCatalogosProductos = async () => {
    const { entidadLeerMenu } = await pedidoService.leerCatalogoConOfertas(
      useAuth.negocioElegido._id,
    ); //@ts-ignore
    estado.catalogosOfertas = [entidadLeerMenu];
  };

  const buscarPedidos = async () => {
    showLoading();
    const { pedidoBuscar } = await pedidoService.pedidoBuscar(
      useAuth.negocioElegido._id,
      undefined,
      undefined,
      useGqlToken(useAuth.token),
    ); //@ts-ignore
    estado.pedidosEntidad = await Promise.all(
      pedidoBuscar.map((pedido) =>
        pedidoService
          .pedidoLeerEstado(pedido._id)
          .then((res) => ({ ...pedido, estadoItems: res.pedidoLeerEstado })),
      ),
    );
    hideLoading();
  };
  const buscarPedidos2 = async () => {
    showLoading();
    const { pedidoBuscar } = await pedidoService.pedidoBuscar(
      undefined,
      useAuth.negocioElegido._id,
      undefined,
      useGqlToken(useAuth.token),
    );
    console.log('first', pedidoBuscar);
    //@ts-ignore
    estado.pedidosEntidad = await Promise.all(
      pedidoBuscar.map((pedido) =>
        pedidoService
          .pedidoLeerEstado(pedido._id)
          .then((res) => ({ ...pedido, estadoItems: res.pedidoLeerEstado })),
      ),
    );
    hideLoading();
    console.log(estado.pedidosEntidad);
    //@ts-ignore
    estado.pedidosAceptados = estado.pedidosEntidad.filter(
      (
        pedido, // prettier-ignore
      ) =>
        //@ts-ignore
        pedido.estadoItems == 'aceptado' || pedido.estadoItems == 'preparado',
    ); //@ts-ignore
    estado.pedidosSinAceptar = estado.pedidosEntidad.filter(
      // prettier-ignore
      //@ts-ignore
      (pedido) => pedido.estadoItems == 'iniciado' || pedido.estadoItems == 'confirmado',
    );
  };

  const buscarPedidoID = async (id: string) => {
    const { pedidoBuscar } = await pedidoService.pedidoBuscar(
      undefined,
      undefined,
      id,
      useGqlToken(useAuth.token),
    );
    estado.pedidoDetalle = pedidoBuscar[0]; //@ts-ignore
    estado.precioGeneral = pedidoBuscar[0].items.reduce((total, item) => {
      return total + item.oferta.precio * item.cantidad;
    }, 0);

    const { pedidoLeerEstado } = await pedidoService.pedidoLeerEstado(id);
    estado.pedidoItemsEstado = pedidoLeerEstado;

    // console.log(estado.precioGeneral);
  };

  const formatearFecha = (date: any) => {
    return format(new Date(date), 'dd-MM-yyyy, EEEE, HH:mm:ss', { locale: es });
  };

  const aceptarTodoPedido = async (pedidoID: string) => {
    const { pedidoAceptarItems } = await pedidoService.pedidoAceptarItems(
      pedidoID,
    );
    const { pedidoPrepararItems } = await pedidoService.pedidoPrepararItems(
      pedidoID,
    );
    if (pedidoAceptarItems && pedidoPrepararItems)
      NotifySucessCenter('Pedido aceptado y en preparacion');
    else NotifyError('Error al aceptar pedido');
    buscarPedidos2();
  };

  const ajustarItem = async (row: any) => {
    console.log(row);
    estado.modal.isAjustarItem = true;
    estado.itemPedido.id = row._id;
    estado.itemPedido.cantidad = row.cantidad;
  };
  const ajustarItemGuardar = async () => {
    const { pedidoAjustarItem } = await pedidoService.pedidoAjustarItem(
      //@ts-ignore
      estado.pedidoDetalle._id,
      estado.itemPedido.id,
      estado.itemPedido.cantidad,
      estado.itemPedido.comentario,
    );
    if (pedidoAjustarItem) {
      NotifySucessCenter('Cantidad ajustada'); //@ts-ignore
      buscarPedidoID(estado.pedidoDetalle._id);
    } else NotifyError('Error al ajustar cantidad');
    estado.modal.isAjustarItem = false;
  };

  const recibirPedido = async (pedidoID: string) => {
    const { pedidoRecibirItems } = await pedidoService.pedidoRecibirItems(
      pedidoID,
    );
    if (pedidoRecibirItems) {
      NotifySucessCenter('Pedido recibido');
      router.push('/punto/pedidos/listaPedidos');
    } else NotifyError('Error al recibir pedido');
  };

  const obtenerListaOfertas = async () => {
    const { entidadBuscarMenu } = await menuService.listarMenus(
      useAuth.negocioElegido._id,
    );
    const { catalogoOfertasRecursivo } = await ofertaService.catalogoRecursivo(
      entidadBuscarMenu[0].catalogo._id,
    );
    estado.ListaOfertasPedido = catalogoOfertasRecursivo;
    // ofertaService.catalogoRecursivo()
  };

  return {
    useAuth,
    estado,
    obtenerCatalogosProductos,
    buscarPedidos,
    buscarPedidos2,
    buscarPedidoID,
    formatearFecha,
    aceptarTodoPedido,
    ajustarItem,
    ajustarItemGuardar,
    recibirPedido,
    obtenerListaOfertas,
  };
};
