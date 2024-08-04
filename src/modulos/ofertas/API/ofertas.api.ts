import type { BuscarCatalogoDto, BuscarOpciones, Catalogo, Oferta } from "#gql";

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
        nombre: "CATALOGO RAIZ",
      },
      opciones,
      null,
      opciones.loading,
    );
  },
};
