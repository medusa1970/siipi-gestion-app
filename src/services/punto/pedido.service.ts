// import type { GqlPedidoIniciar } from '#gql';
import { postData } from '@/services/service.config';
import punto from '~/layouts/punto.vue';
// import { authStore } from '@/stores/auth.store';

// const useAuth = authStore();
interface Item {
  cantidad: number;
  oferta: string;
}

export const pedidoService = {
  leerCatalogoConOfertas: async (puntoID: string | null | undefined) =>
    postData(
      GqlPuntoLeerCatalogo({ busqueda: { _id: puntoID }, busquedaMenu: {} }),
    ),
  pedidoIniciar: async (
    entidadOrigen: string,
    entidadDestino: string,
    items: Item[],
    token: any,
  ) =>
    postData(
      GqlPedidoIniciar(
        {
          datos: { comprador: entidadOrigen, vendedor: entidadDestino, items },
        },
        token, // @ts-ignore
        // useGqlToken(useAuth.token),
      ),
    ),
  pedidoConfirmarItems: async (pedidoID: string) =>
    postData(
      GqlPedidoConfirmarItems({ busqueda: { _id: pedidoID }, itemIds: [] }),
    ),
  pedidoBuscar: async (
    puntoID?: string | null | undefined,
    punto2ID?: string | null | undefined,
    pedidoID?: string | null | undefined,
    token?: any,
  ) =>
    GqlPedidoBuscar(
      { busqueda: { comprador: puntoID, vendedor: punto2ID, _id: pedidoID } },
      token,
    ),
  // pedidoBuscarVendedor: async (
  //   puntoID?: string | null | undefined,
  //   token?: any,
  // ) =>
  //   postData(
  //     GqlPedidoBuscar(
  //       {
  //         busqueda: { vendedor: puntoID },
  //         opciones: { limit: 0, populate: true },
  //       },
  //       token,
  //     ),
  //   ),
  pedidoLeerEstado: async (pedidoID?: string | null | undefined) =>
    GqlPedidoLeerEstado({ busqueda: { _id: pedidoID } }),

  pedidoAceptarItems: async (pedidoID: string) =>
    postData(
      GqlPedidoAceptarItems({ busqueda: { _id: pedidoID }, itemIds: [] }),
    ),
  pedidoAjustarItem: async (
    pedidoID: string,
    itemID: string,
    cantidad: number,
    comentario: string,
  ) =>
    postData(
      GqlPedidoAjustarItem({
        busqueda: { _id: pedidoID },
        itemId: itemID,
        nuevaCantidad: cantidad,
        comentario,
      }),
    ),
  pedidoPrepararItems: async (pedidoID: string) =>
    postData(
      GqlPedidoPrepararItems({ busqueda: { _id: pedidoID }, itemIds: [] }),
    ),
  pedidoRecibirItems: async (pedidoID: string) =>
    postData(
      GqlPedidoRecibirItems({ busqueda: { _id: pedidoID }, itemIds: [] }),
    ),
  pedidoItemsEstado: async (pedidoID: string) =>
    postData(GqlPedidoItemsEstado({ busqueda: { _id: pedidoID } })),
  pedidosBuscarItems: async (pedidoIDS: string[]) =>
    postData(GqlPedidosBuscarItems({ busqueda: { _ids: pedidoIDS } })),
  pedidosAceptarOfertasSolicitables: async (pedidoIDS: string[]) =>
    postData(
      GqlPedidosAceptarOfertasSolicitables({ busqueda: { _ids: pedidoIDS } }),
    ),
  pedidosAceptarOfertasDirectas: async (pedidoIDS: string[]) =>
    postData(
      GqlPedidosAceptarOfertasDirectas({ busqueda: { _ids: pedidoIDS } }),
    ),
  pedidosOfertaPreparados: async (pedidoIds: string[], ofertaIds: string[]) =>
    postData(
      GqlPedidosPrepararOfertas({ busqueda: { _ids: pedidoIds }, ofertaIds }),
    ),
};
