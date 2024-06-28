export const ofertaService = {
  /**
   * Busca todas las ofertas
   * @returns Oferta[]
   */
  buscarOfertas: async () => {
    const ofertas = await postDataGql(GqlBuscarOfertas({}));
    return ofertas;
  },
};
