import type {
  BuscarOpciones,
  BuscarPedidoDto,
  CrearOpciones,
  CrearPedidoDto, //@ts-expect-error
  Pedido
} from '#gql';

export const apiPedido = {
  /**
   * Pedidos
   */
  pedidoIniciar: async (
    datos: CrearPedidoDto,
<<<<<<< HEAD
    opciones: CrearOpciones & { loading?: boolean } = {},
    token: any = null,
  ): Promise<Pedido> => {
    delete opciones.loading;
    let resultado;
    try {
      if (opciones.loading) {
        await loadingAsync(async () => {
          resultado = await GqlIniciarPedido(
            { datos, opciones },
            //@ts-expect-error
            useGqlToken(token),
          );
        });
      } else {
        resultado = await GqlIniciarPedido(
          { datos, opciones },
          //@ts-expect-error
          useGqlToken(token),
        );
      }
      if (!resultado) {
        throw "error resultado null";
      }
=======
    opciones: CrearOpciones = {},
    token: any = null
  ): Promise<Pedido> => {
    let resultado;
    try {
      await loadingAsync(async () => {
        resultado = await GqlIniciarPedido(
          { datos, opciones },
          //@ts-expect-error
          useGqlToken(token)
        );
      });
>>>>>>> dev-will2
    } catch (err) {
      throw formatApiError(err);
    }
    return extraerUno(resultado);
  },

  pedidoConfirmarItems: async (busqueda: BuscarPedidoDto, token: any) => {
    let resultado;
    try {
      await loadingAsync(async () => {
        resultado = await GqlCambiarEstadoItems(
          { busqueda, itemIds: [], estado: { estado: "confirmado" } }, //@ts-expect-error
          useGqlToken(token),
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
    t: any = null,
  ): Promise<Pedido[]> =>
    <Pedido[]>(
      await buscarVarios(GqlBuscarPedidos, useGqlToken(t), b, o, f, o.loading)
    ),

  pedido_buscarUno: async (
    b: BuscarPedidoDto,
    o: BuscarOpciones & { loading?: boolean } = {},

    t: any = null,
  ): Promise<Pedido[]> =>
    <Pedido[]>await buscarUno(GqlBuscarPedidos, t, b, o, o.loading),

  // pedido_leerMenu: async (
  //   b: BuscarPedidoDto,

  //   o: BuscarOpciones & { loading?: boolean } = {},

  //   t: any = null
  // ) => await buscarUno(GqlEntidadLeerMenu, useGqlToken(t), b, o, o.loading),

  pedido_leerMenu: async (entidadID: string, token: any) => {
    try {
      const menu = extraerUno(
        await GqlEntidadLeerMenu(
          {
            busqueda: { _id: [entidadID] },
            busquedaMenu: {},
            opciones: { limit: 1, errorSiVacio: true },
          }, //@ts-ignore
          useGqlToken(token),
        ),
      );
      return menu;
    } catch (err) {
      throw formatApiError(err);
    }
  },
<<<<<<< HEAD
=======

  // pedido buscar
  // colocar siempre el filtro
  pedido_buscar: async (
    b: BuscarPedidoDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    t: any = null
  ): Promise<Pedido[]> =>
    <Pedido[]>(
      await buscarVarios(GqlBuscarPedidos, useGqlToken(t), b, o, {}, o.loading)
    ),
  pedido_leerEstadoItems: async (
    b: BuscarPedidoDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    t: any = null
  ) => await buscarUno(GqlLeerEstadoPedido, useGqlToken(t), b, o, o.loading)

  //   GqlLeerEstadoPedido(
  //     {
  //       busqueda: { _id: [pedidoID] },
  //       opciones: { limit: 1, errorSiVacio: true },
  //     },
  //     token,
  //   ),
  // );
>>>>>>> dev-will2
};
