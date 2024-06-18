export const useEntidad = {
  /**
   * Busca el nombre y el tipo de todas las entidades
   * @returns Entidad[]
   */
  buscarTodasEntidades: async () => {
    const entidades = await postDataGql(GqlBuscarEntidades_tipo({}));
    return entidades;
  },
};
