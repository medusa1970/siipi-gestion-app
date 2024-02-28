// import type { GqlPedidoIniciar } from '#gql';
import { postData } from '@/services/service.config';
import { authStore } from '@/stores/auth.store';

const useAuth = authStore();
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
  ) =>
    postData(
      GqlPedidoIniciar(
        {
          datos: { comprador: entidadOrigen, vendedor: entidadDestino, items },
        }, // @ts-ignore
        useGqlToken(useAuth.token),
      ),
    ),
};
