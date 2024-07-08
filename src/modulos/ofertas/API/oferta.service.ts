import type {
  BuscarOfertaDto,
  CrearOfertaDto,
  ModificarOfertaDto,
  Oferta,
} from '#gql';

export const ofertaService = {
  /**
   * Busca todas las ofertas
   * @returns Oferta[]
   */
  buscarOfertas: async () => extraer(await GqlBuscarOfertas({})),
  /**
   * retorna el arbol de los catalogos a partir de la raiz
   * @returns Catalogo (con sus hijas populadas)
   */
  buscarCatalogos: async () =>
    extraer(
      await GqlCatalogoArbol({
        busqueda: { nombre: ['CATALOGO RAIZ'] },
      }),
    ),
  /**
   * Crea una oferta
   * @returns Oferta
   */
  crearOferta: async (datos: CrearOfertaDto) =>
    extraerUno(
      await GqlCrearOfertas({
        datos,
        opciones: { populate: true },
      }),
    ),
  /**
   * Modifica una oferta con datos basicos
   * @returns Oferta
   */
  modificarOfertaBasica: async (
    busqueda: BuscarOfertaDto,
    datos: ModificarOfertaDto,
  ) =>
    extraerUno(
      await GqlModificarOfertaBasica({
        busqueda,
        datos,
        opciones: { populate: true },
      }),
    ),
  /**
   * Modifica una oferta con datos basicos
   * @returns Oferta
   */
  modificarOfertaIngredienteSimple: async (
    busqueda: BuscarOfertaDto,
    datos: ModificarOfertaDto,
  ) =>
    extraerUno(
      await GqlModificarOfertaIngredientes({
        busqueda,
        datos,
        opciones: { populate: true },
      }),
    ),
  /**
   * Modifica una oferta con sus precios
   * @returns Oferta
   */
  modificarOfertaPrecios: async (
    busqueda: BuscarOfertaDto,
    datos: ModificarOfertaDto,
  ) =>
    extraerUno(
      await GqlModificarOfertaPrecios({
        busqueda,
        datos,
        opciones: { populate: true },
      }),
    ),
  /**
   * Borrar un producto
   */
  borrarOferta: async (
    ofertaID: string,
    comentario: string = 'test comentario borrar',
    token: any,
  ): Promise<Oferta | null> => {
    try {
      // borramos el producto
      const oferta = extraerUno(
        await GqlBorrarOfertas({
          busqueda: { _id: [ofertaID] },
        }),
      );

      // en caso de que no se borró nada
      if (!oferta) {
        console.log('no se elimino el oferta', ofertaID);
        return null;
      }
      // creamos la accion
      const accion = extraerUno(
        await GqlCrearAccion(
          {
            datos: {
              // persona: va con el token
              comentario: comentario,
              oferta: oferta._id,
              accion: 'borrado',
            },
            opciones: {
              aceptarInexistentes: true,
            },
          },
          token,
        ),
      );
      // retornamos el oferta
      return oferta;
    } catch (err) {
      throw formatApiError(err);
    }
  },
};
