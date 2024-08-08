import type {
  BuscarCategoriaDto,
  BuscarOpciones,
  Categoria,
  Entidad,
  Inventario,
  Problema,
  Producto,
  Stock,
} from "#gql";

export const apiAlmacen = {
  /**
   * Arbol de categoria
   */
  buscarArbolCategorias: async (
    b: BuscarCategoriaDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Categoria> => {
    o.limit = 0;
    return <Categoria>(
      await buscarUno(GqlCategoriaArbol, t, b, o, null, o.loading)
    );
  },

  /**
   * Arbol de categoria RAIZ
   */
  buscarArbolCategoriasRaiz: async (
    opciones: BuscarOpciones & { loading?: boolean } = {},
    token: any = null,
  ): Promise<Categoria> => {
    opciones.limit = 0;
    return <Categoria>await buscarUno(
      GqlCategoriaArbol,
      token,
      {
        nombre: "CATEGORIA RAIZ",
      },
      opciones,
      null,
      opciones.loading,
    );
  },

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
    mensaje: string = "se hizo",
  ): Promise<Inventario> => {
    try {
      const inventario = extraerUno(
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
      return inventario;
    } catch (err) {
      throw formatApiError(err);
    }
  },

  /**
   * Busca todos los productos de las ofertas del categoria de un menu (recursivo)
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
};
