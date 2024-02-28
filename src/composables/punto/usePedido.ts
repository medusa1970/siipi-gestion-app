import { ref, reactive, onMounted } from 'vue';
import {
  NotifyError,
  NotifySucess,
  hideLoading,
  showLoading,
} from '~/helpers/message.service';
import { useQuasar } from 'quasar';
import { pedidoService } from '@/services/punto/pedido.service';
import { authStore } from '@/stores/auth.store';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
/**
 * LOGICA
 */
export const usePedido = () => {
  const useAuth = authStore();
  const estado = reactive({
    catalogosOfertas: [],
    modal: {
      isAddOferta: false,
    },
    isEditCantidad: false,
    pedidosEntidad: [],
    pedidoDetalle: {},
    precioGeneral: 0,
    pedidosAceptados: [],
    pedidosSinAceptar: [],
  });

  const obtenerCatalogosProductos = async () => {
    const { entidadLeerMenu } = await pedidoService.leerCatalogoConOfertas(
      useAuth.negocioElegido._id,
    ); //@ts-ignore
    estado.catalogosOfertas = [entidadLeerMenu];
  };

  const buscarPedidos = async () => {
    const { pedidoBuscar } = await pedidoService.pedidoBuscar(
      useAuth.negocioElegido._id,
      undefined,
      undefined,
      useGqlToken(useAuth.token),
    ); //@ts-ignore
    estado.pedidosEntidad = pedidoBuscar;
  };
  const buscarPedidos2 = async () => {
    const { pedidoBuscar } = await pedidoService.pedidoBuscar(
      undefined,
      useAuth.negocioElegido._id,
      undefined,
      useGqlToken(useAuth.token),
    ); //@ts-ignore
    estado.pedidosEntidad = pedidoBuscar; //@ts-ignore
    estado.pedidosAceptados = pedidoBuscar.filter(
      (
        pedido, //@ts-ignore
      ) => pedido.estado.some((estado) => estado.estado === 'pagado'),
    ); //@ts-ignore
    estado.pedidosSinAceptar = pedidoBuscar.filter(
      //@ts-ignore
      (pedido) => !pedido.estado.some((estado) => estado.estado === 'pagado'),
    );

    // console.log(pedidosConAceptado);
    // console.log(pedidosSinAceptar);
  };

  const buscarPedidoID = async (id: string) => {
    const { pedidoBuscar } = await pedidoService.pedidoBuscar(
      undefined,
      undefined,
      id,
      useGqlToken(useAuth.token),
    );
    // console.log(pedidoBuscar);
    estado.pedidoDetalle = pedidoBuscar[0]; //@ts-ignore
    estado.precioGeneral = pedidoBuscar[0].items.reduce((total, item) => {
      return total + item.oferta.precio * item.cantidad;
    }, 0);

    // console.log(estado.precioGeneral);
  };

  const formatearFecha = (date: any) => {
    return format(new Date(date), 'dd-MM-yyyy, EEEE, HH:mm:ss', { locale: es });
  };

  return {
    useAuth,
    estado,
    obtenerCatalogosProductos,
    buscarPedidos,
    buscarPedidos2,
    buscarPedidoID,
    formatearFecha,
  };
};
