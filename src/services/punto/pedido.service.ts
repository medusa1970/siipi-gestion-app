// import type { GqlPedidoIniciar } from '#gql';
import { postData } from '@/services/service.config';
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
};
