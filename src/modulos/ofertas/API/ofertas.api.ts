import type { BuscarCatalogoDto, BuscarOpciones, Catalogo, Oferta } from '#gql';

export const apiOfertas = {
  /**
   * Arbol de catalogo
   */
  buscarArbolCatalogos: async (
    b: BuscarCatalogoDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Catalogo> => {
    o.limit = 0;
    return <Catalogo>(
      await buscarUno(GqlCatalogoArbol, t, b, o, null, o.loading)
    );
  },

  /**
   * Arbol de catalogo RAIZ
   */
  buscarArbolCatalogosRaiz: async (
    opciones: BuscarOpciones & { loading?: boolean } = {},
    token: any = null,
  ): Promise<Catalogo> => {
    opciones.limit = 0;
    return <Catalogo>await buscarUno(
      GqlCatalogoArbol,
      token,
      {
        nombre: 'CATALOGO RAIZ',
      },
      opciones,
      null,
      opciones.loading,
    );
  },

  /**
   * Borrar un producto con motivo
   */
  borrarOfertaConMotivo: async (
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
        return null;
      }
      // creamos la accion
      const accion = extraerUno(
        await GqlCrearAcciones(
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
