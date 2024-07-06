import type {
  BuscarCatalogoDto,
  CrearCatalogoDto,
  ModificarCatalogoDto,
} from '#gql';

export const catalogoService = {
  /**
   * Busca un catalogo por su ID
   * @returns Catalogo
   */
  buscarCatalogoID: async (busqueda: BuscarCatalogoDto): Promise<any> => {
    const catalogoArbol = extraer(
      await GqlCatalogoArbol({
        busqueda,
      }),
    );
    return catalogoArbol;
  },
  /**
   * Crear un catalogo
   * @returns Catalogo
   */
  crearCatalogo: async (datos: CrearCatalogoDto) => {
    const catalogoCreado = extraerUno(
      await GqlCrearCatalogos({
        datos,
        opciones: { populate: true },
      }),
    );

    return catalogoCreado;
  },
  /**
   * Modificar un catalogo
   * @returns Catalogo
   */
  modificarCatalogo: async (
    busqueda: BuscarCatalogoDto,
    datos: ModificarCatalogoDto,
  ) => {
    const catalogoModificado = extraerUno(
      await GqlModificarCatalogos({
        busqueda,
        datos,
      }),
    );
    return catalogoModificado;
  },
  /**
   * borrar un catalogo
   * @returns Catalogo
   */
  borrarCatalogo: async (busqueda: BuscarCatalogoDto) => {
    const catalogoBorrado = extraerUno(
      await GqlBorrarCatalogos({
        busqueda,
      }),
    );
    return catalogoBorrado;
  },
};
