import { postData } from '@/services/service.config';

export const inventarioService = {
  realizarInventario: async (
    negocioID: string | null | undefined,
    producto: any,
    lotes: any,
    guardar: boolean
  ) =>
    postData(
      GqlHacerInventario({
        entidadBusqueda: { _id: negocioID },
        guardar: guardar,
        datos: {
          producto: producto,
          lotes: lotes,
          reporte: 'se hizo'
        }
      })
    )
};
