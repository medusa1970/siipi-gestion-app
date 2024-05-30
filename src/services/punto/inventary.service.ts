import { postDataGql } from '../../services/service.config';

export const inventarioService = {
  /**
   * Realiza un inventario
   * @returns Inventario
   */
  realizarInventario: async (
    negocioID: string,
    productoID: any,
    lotes: any,
    guardar: boolean,
    mensaje: string = 'se hizo',
  ) => {
    const [entidad] = await postDataGql(
      GqlHacerInventario({
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
  },

  /**
   * Busca todos los productos de las ofertas del catalogo de un menu (recursivo)
   * @returns Producto[]
   */
  inventarioProductosMenu: async (entidadID: string) => {
    const productos = await postDataGql(
      GqlProductosMenu({
        busqueda: { _id: [entidadID] },
        busquedaMenu: {},
      }),
    );
    return productos;
  },

  /**
   * Fila de inventario
   * @returns Productos[]
   */
  filaInventario: async (entidadID: string) => {
    const productos = await postDataGql(
      GqlFilaInventario({
        busqueda: { _id: [entidadID] },
      }),
    );
    return productos;
  },

  /**
   * Recupera un problema
   * @returns Productos[]
   */
  buscarProblema: async (entidadID: string, problemaID: string) => {
    const [entidad] = await postDataGql(
      GqlBuscarEntidades_problemas({
        busqueda: { _id: [entidadID] },
        filtro: { problemas: { _id: [problemaID] } },
        opciones: { limit: 1, errorSiVacio: true },
      }),
    );
    return entidad.problemas[0];
  },

  /**
   * Recupera todos los problemas no resueltos
   * @returns Productos[]
   */
  buscarProblemasNoResueltos: async (entidadID: string) => {
    const [entidad] = await postDataGql(
      GqlBuscarEntidades_problemas({
        busqueda: { _id: [entidadID] },
        filtro: { problemas: { resuelto: false } },
        opciones: { limit: 1, errorSiVacio: true },
      }),
    );
    return entidad.problemas;
  },

  /**
   * Resuelve un problema
   * @returns Productos[]
   */
  resolverProblema: async (
    entidadID: string,
    problemaID: string,
    datos: object,
  ) => {
    const [entidad] = await postDataGql(
      GqlModificarEntidades_problemas({
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
      // @ts-expect-error estructura en backend
      (problema) => problema._id.toString() === problemaID,
    );
  },
};
