export const ofertaService = {
  /**
   * Busca todas las ofertas
   * @returns Oferta[]
   */
  buscarOfertas: async () => {
    const ofertas = await postDataGql(GqlBuscarOfertas({}));
    return ofertas;
  },
  /**
   * retorna el arbol de los catalogos a partir de la raiz
   * @returns Catalogo (con sus hijas populadas)
   */
  buscarCatalogos: async () => {
    const arbol = await postDataGql(
      GqlCatalogoArbol({
        busqueda: { nombre: ['CATALOGO RAIZ'] },
      }),
    );
    return arbol;
  },
};
