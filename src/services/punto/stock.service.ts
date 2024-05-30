import { postDataGql } from '../../services/service.config';

export const stockService = {
  /**
   * Busca el almacen de una entidad
   * @returns Stock[]
   */
  obtenerTodoStock: async (negocioID: string) => {
    const [entidad] = await postDataGql(
      GqlBuscarEntidades_almacen({
        busqueda: { _id: [negocioID] },
        opciones: { limit: 1, errorSiVacio: true },
      }),
    );
    return entidad.almacen;
  },

  /**
   * modifica la cantidad limite de un producto en el almacen
   * @returns Stock
   */
  modificarCantidad: async (
    negocioID: string,
    productoID: string,
    cantidadLimite: number,
  ) => {
    const [entidad] = await postDataGql(
      GqlModificarEntidades_stock({
        busqueda: { _id: [negocioID] },
        datos: {
          almacen: {
            buscar: {
              producto: [productoID],
            },
            modificar: {
              cantidadLimite,
            },
          },
        },
        opciones: { limit: 1, errorSiVacio: true },
      }),
    );
    return entidad.almacen.find(
      // @ts-expect-error estructura en backend
      (stock) => stock.producto._id.toString() === productoID,
    );
  },
};
