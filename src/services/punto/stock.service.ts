import { postData } from '@/services/service.config';

export const stockService = {
  obtenerTodoStock: async (negocioID: string | null | undefined) =>
    postData(
      GqlBuscarStocks({
        busqueda: { _id: negocioID }
      })
    ),
  modificarCantidad: async (
    negocioID: string | null | undefined,
    productoID: string,
    cantidadLimite: number
  ) =>
    postData(
      GqlModificarCantidadLimite({
        entidadBusqueda: { _id: negocioID },
        productoBusqueda: { _id: productoID },
        datos: { cantidadLimite }
      })
    )
};
