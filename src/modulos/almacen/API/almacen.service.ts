import type {
  CrearEntidadDto,
  CrearOpciones,
  Entidad,
  Inventario,
  Problema,
  Producto,
  Stock,
} from '#gql';

export const almacenService = {
  // retorna el almacen de una entidad
  stockEntidad: async (entidadID: string): Promise<Stock[]> =>
    ((await buscarUno(GqlStockBuscarEntidad, entidadID, true)) as Entidad)
      .almacen,

  /**
   * Realizar un inventario
   */
  realizarInventario: async (
    negocioID: string,
    productoID: any,
    lotes: any,
    guardar: boolean,
    mensaje: string = 'se hizo',
  ): Promise<Inventario> => {
    try {
      const entidad = extraerUno(
        await GqlHacerInventario({
          busqueda: { _id: [negocioID] },
          guardar,
          datos: {
            producto: productoID,
            lotes: lotes,
            reporte: mensaje,
          },
        }),
      );
      return entidad.inventarios[0];
    } catch (err) {
      throw formatApiError(err);
    }
  },

  /**
   * Busca todos los productos de las ofertas del catalogo de un menu (recursivo)
   */
  inventarioProductosMenu: async (entidadID: string): Promise<Producto> => {
    try {
      const producto = extraerUno(
        await GqlProductosMenu({
          busqueda: { _id: [entidadID] },
          busquedaMenu: {},
        }),
      );
      return producto;
    } catch (err) {
      throw formatApiError(err);
    }
  },

  /**
   * Fila de inventario
   */
  filaInventario: async (entidadID: string): Promise<Producto[]> => {
    try {
      const productos = extraer(
        await GqlFilaInventario({
          busqueda: { _id: [entidadID] },
        }),
      );
      return productos;
    } catch (err) {
      throw formatApiError(err);
    }
  },

  /**
   * Recupera un problema
   */
  buscarProblema: async (
    entidadID: string,
    problemaID: string,
  ): Promise<Problema> => {
    try {
      const entidad = extraerUno(
        await GqlBuscarEntidades_problemas({
          busqueda: { _id: [entidadID] },
          filtro: { problemas: { _id: [problemaID] } },
          opciones: { limit: 1, errorSiVacio: true },
        }),
      );
      return entidad.problemas[0];
    } catch (err) {
      throw formatApiError(err);
    }
  },

  /**
   * Recupera todos los problemas no resueltos
   */
  buscarProblemasNoResueltos: async (
    entidadID: string,
  ): Promise<Problema[]> => {
    try {
      const entidad = extraerUno(
        await GqlBuscarEntidades_problemas({
          busqueda: { _id: [entidadID] },
          filtro: { problemas: { resuelto: false } },
          opciones: { limit: 1, errorSiVacio: true },
        }),
      );
      return entidad.problemas;
    } catch (err) {
      throw formatApiError(err);
    }
  },

  /**
   * Resuelve un problema
   */
  resolverProblema: async (
    entidadID: string,
    problemaID: string,
    datos: object,
  ): Promise<Problema> => {
    try {
      const entidad = extraerUno(
        await GqlModificarEntidades_problemas({
          busqueda: {
            _id: [entidadID],
          },
          datos: {
            problemas: {
              buscar: { _id: [problemaID] },
              modificar: datos,
            },
          },
          opciones: { limit: 1, errorSiVacio: true },
        }),
      );
      return entidad.problemas.find(
        (problema) => problema._id.toString() === problemaID,
      );
    } catch (err) {
      throw formatApiError(err);
    }
  },
};
