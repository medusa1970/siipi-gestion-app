import { postData } from '@/services/service.config';

export const inventarioService = {
  realizarInventario: async (
    negocioID: string | null | undefined,
    productoID: any,
    lotes: any,
    guardar: boolean,
  ) =>
    postData(
      GqlHacerInventario({
        entidadBusqueda: { _id: negocioID },
        guardar: guardar,
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
};
