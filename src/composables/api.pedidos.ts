import type {
  BuscarOpciones,
  BuscarPedidoDto,
  CrearItemEstadoDto,
  CrearOpciones,
  CrearPedidoDto,
  Pedido,
} from '#gql';

export const apiPedido = {
  /**
   * Pedidos
   */
  pedidoIniciar: async (
    d: CrearPedidoDto,
    o: CrearOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Pedido> =>
    await crearUno(GqlCrearPedido, useGqlToken(t), d, o, o.loading),

  pedidoConfirmarItems: async (
    busqueda: BuscarPedidoDto,
    opciones: BuscarOpciones,
    estado: CrearItemEstadoDto,
    itemIds: string | string[],
    token: any,
  ) => {
    opciones.populate = true;
    let resultado;
    try {
      await loadingAsync(async () => {
        resultado = await GqlCambiarEstadoItems(
          { busqueda, itemIds, estado, opciones },
          token,
        );
      });
      if (!resultado) {
        throw 'error resultado null';
      }
    } catch (err) {
      throw formatApiError(err);
    }
    return extraer(resultado);
  },
};
