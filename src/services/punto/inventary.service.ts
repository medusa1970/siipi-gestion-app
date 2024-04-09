import { postData } from '@/services/service.config';

export const inventarioService = {
  realizarInventarioFalse: async (
    negocioID: string | null | undefined,
    productoID: any,
    lotes: any,
  ) =>
    postData(
      GqlHacerInventario({
        entidadBusqueda: { _id: negocioID },
        guardar: false,
        datos: {
          producto: productoID,
          lotes: lotes,
          reporte: 'se hizo',
        },
      }),
    ),
  realizarInventarioTrue: async (
    negocioID: string | null | undefined,
    productoID: any,
    lotes: any,
  ) =>
    postData(
      GqlHacerInventario({
        entidadBusqueda: { _id: negocioID },
        guardar: true,
        datos: {
          producto: productoID,
          lotes: lotes,
          reporte: 'se hizo',
        },
      }),
    ),
  inventarioProductosMenu: async (entidadID: string | null | undefined) =>
    postData(
      GqlInventarioProductosMenu({
        busqueda: { _id: entidadID },
        busquedaMenu: {},
      }),
    ),
  productosInventariar: async (entidadID: string | null | undefined) =>
    postData(GqlProductosInventariar({ entidadBusqueda: { _id: entidadID } })),
  filaInventario: async (entidadID: string) =>
    postData(GqlFilaInventario({ entidadBusqueda: { _id: entidadID } })),
};
