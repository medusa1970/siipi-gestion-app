import { postData } from '@/services/service.config';

export const pedidoService = {
  leerCatalogoConOfertas: async (puntoID: string | null | undefined) =>
    postData(
      GqlPuntoLeerCatalogo({ busqueda: { _id: puntoID }, busquedaMenu: {} }),
    ),
};
