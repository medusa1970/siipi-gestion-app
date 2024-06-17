// import type { GqlPedidoIniciar } from '#gql';
import { postDataGql } from './service.config';
//
// const authStore = useAuthStore();
interface Item {
  cantidad: number;
  oferta: string;
}

/**
 * leerCatalogoConOfertas
 * @returns Catalogo (con hijas y ofertas populadas)
 */
export const pedidoService = {
  leerCatalogoConOfertas: async (puntoID: string, token?: any) => {
    const arbol = await postDataGql(
      GqlEntidadLeerMenu(
        {
          busqueda: { _id: [puntoID] },
          busquedaMenu: {},
          opciones: { limit: 1, errorSiVacio: true },
        },
        token,
      ),
    );
    return arbol;
  },

  /**
   * Iniciar un pedido
   * @returns Pedido
   */
  pedidoIniciar: async (
    entidadOrigen: string,
    entidadDestino: string,
    items: Item[],
    token: any,
  ) => {
    const pedido = await postDataGql(
      GqlIniciarPedido(
        {
          datos: {
            comprador: entidadOrigen,
            vendedor: entidadDestino,
            // @ts-expect-error estructura en backend
            items,
          },
        },
        token,
      ),
    );
    return pedido;
  },

  /**
   * pedidoBuscar
   * @returns Pedido[]
   */
  // @ts-expect-error estructura en backend
  pedidoBuscar: async (busqueda, token?: any) => {
    const pedidos = await postDataGql(GqlBuscarPedidos({ busqueda }, token));
    return pedidos;
  },

  /**
   * pedidoLeerEstado
   * @returns
   */
  pedidoLeerEstado: async (pedidoID: string, token?: any) => {
    const estado = await postDataGql(
      GqlLeerEstadoPedido(
        {
          busqueda: { _id: [pedidoID] },
          opciones: { limit: 1, errorSiVacio: true },
        },
        token,
      ),
    );
    return estado;
  },

  /**
   * pedidoConfirmarItems
   * @returns Pedido
   */
  pedidoConfirmarItems: async (pedidoID: string, token?: any) => {
    const pedido = await postDataGql(
      GqlCambiarEstadoItems(
        {
          busqueda: { _id: [pedidoID] },
          itemIds: [],
          estado: {
            estado: 'confirmado',
          },
          opciones: { limit: 1, errorSiVacio: true },
        },
        token,
      ),
    );
    return pedido;
  },

  /**
   * pedidoAceptarItems
   * @returns
   */
  pedidoAceptarItems: async (pedidoID: string, token?: any) => {
    const pedido = await postDataGql(
      GqlCambiarEstadoItems(
        {
          busqueda: { _id: [pedidoID] },
          opciones: { limit: 1, errorSiVacio: true },
          estado: {
            estado: 'aceptado',
          },
        },
        token,
      ),
    );
    return pedido;
  },

  /**
   * pedidoPrepararItems
   * @returns
   */
  pedidoPrepararItems: async (pedidoID: string, token?: any) => {
    const pedido = await postDataGql(
      GqlCambiarEstadoItems(
        {
          busqueda: { _id: [pedidoID] },
          opciones: { limit: 1, errorSiVacio: true },
          estado: {
            estado: 'preparado',
          },
        },
        token,
      ),
    );
    return pedido;
  },

  /**
   * pedidoRecibirItems
   * @returns
   */
  pedidoRecibirItems: async (pedidoID: string, token?: any) => {
    const pedido = await postDataGql(
      GqlCambiarEstadoItems(
        {
          busqueda: { _id: [pedidoID] },
          opciones: { limit: 1, errorSiVacio: true },
          estado: {
            estado: 'recibido',
          },
        },
        token,
      ),
    );
    return pedido;
  },

  /**
   * pedidoAjustarItem
   * @returns
   */
  pedidoAjustarItem: async (
    pedidoID: string,
    itemID: string,
    nuevaCantidad: number,
    comentario: string,
    token?: any,
  ) => {
    const pedido = await postDataGql(
      GqlAjustarItem(
        {
          busqueda: { _id: [pedidoID] },
          itemId: itemID,
          nuevaCantidad,
          comentario,
          opciones: { limit: 1, errorSiVacio: true },
        },
        token,
      ),
    );
    return pedido;
  },

  /**
   * Busca todos los items de un pedido
   * @returns Item[]
   */

  pedidoItemsEstado: async (pedidoID: string, token?: any) => {
    const pedido = await postDataGql(
      GqlBuscarPedidos_itemEstados(
        {
          busqueda: { _id: [pedidoID] },
          opciones: { limit: 1, errorSiVacio: true },
        },
        token,
      ),
    );
    return pedido.items;
  },

  /**
   * pedidosAceptarOfertasSolicitables
   * @returns Oferta[]
   */
  aceptarOfertasSolicitables: async (pedidoIDS: string[], token?: any) => {
    const ofertas = await postDataGql(
      GqlCambiarEstadoItemsPorOfertas_aceptar(
        {
          busqueda: { _id: pedidoIDS },
          estado: {
            estado: 'preparado',
          },
          tipo: 'solicitable',
        },
        token,
      ),
    );
    return ofertas;
  },

  /**
   * aceptarOfertasDirectas
   * @returns Oferta[]
   */
  aceptarOfertasDirectas: async (pedidoIDS: string[], token?: any) => {
    const ofertas = await postDataGql(
      GqlCambiarEstadoItemsPorOfertas_aceptar(
        {
          busqueda: { _id: pedidoIDS },
          estado: {
            estado: 'aceptado',
          },
          tipo: 'directo',
        },
        token,
      ),
    );
    return ofertas;
  },

  /**
   * pedidosOfertaPreparados
   * @returns
   */
  pedidosOfertaPreparados: async (
    pedidoIds: string[],
    ofertaIds: string[],
    token?: any,
  ) => {
    const ofertas = await postDataGql(
      GqlCambiarEstadoItemsPorOfertas_preparar(
        {
          busqueda: { _id: pedidoIds },
          ofertaIds,
          estado: {
            estado: 'preparado',
          },
        },
        token,
      ),
    );
    return ofertas;
  },

  /**
   * Ajusta todos los items de un pedido que tengan una oferta en particular
   * con un algoritmo simple para saber como distibuir la cantidad total a restar
   * @returns Oferta[]
   */
  pedidosOfertaAjustar: async (
    pedidoIds: string[],
    ofertaId: string,
    comentario: string,
    diferenciaTotal: number,
    token?: any,
  ) => {
    const ofertas = await postDataGql(
      GqlAjustarItemsPorOferta(
        {
          busqueda: { _id: pedidoIds },
          ofertaId,
          estado: {
            estado: 'ajustado',
            valor: [diferenciaTotal],
            comentario,
          },
        },
        token,
      ),
    );
    return ofertas;
  },
};
