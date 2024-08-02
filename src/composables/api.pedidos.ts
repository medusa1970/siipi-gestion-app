import type {
  BuscarOpciones,
  BuscarPedidoDto,
  CrearOpciones,
  CrearPedidoDto,
  Pedido,
} from "#gql";

export const apiPedido = {
  /**
   * Pedidos
   */
  pedidoIniciar: async (
    d: CrearPedidoDto,
    o: CrearOpciones & { loading?: boolean } = {},
    t: any = null
  ): Promise<Pedido> =>
    await crearUno(GqlCrearPedido, useGqlToken(t), d, o, o.loading),

  pedidoConfirmarItems: async (busqueda: BuscarPedidoDto, token: any) => {
    let resultado;
    try {
      await loadingAsync(async () => {
        resultado = await GqlCambiarEstadoItems(
          { busqueda, itemIds: [], estado: { estado: "confirmado" } }, //@ts-expect-error
          useGqlToken(token)
        );
      });
      if (!resultado) {
        throw "error resultado null";
      }
    } catch (err) {
      throw formatApiError(err);
    }
    return extraerUno(resultado);
  },

  pedidos_buscar: async (
    b: BuscarPedidoDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    f: BuscarPedidoDto = {},
    t: any = null
  ): Promise<Pedido[]> =>
    <Pedido[]>(
      await buscarVarios(GqlBuscarPedidos, useGqlToken(t), b, o, f, o.loading)
    ),

  pedido_leerEstado: async (
    b: BuscarPedidoDto,
    o: BuscarOpciones & { loading?: boolean } = {},

    t: any = null
  ): Promise<Pedido[]> =>
    <Pedido[]>await buscarUno(GqlBuscarPedidos, t, b, o, o.loading),
};
