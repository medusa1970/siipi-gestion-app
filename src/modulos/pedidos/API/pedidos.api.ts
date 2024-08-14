import type {
  BuscarOpciones,
  BuscarPedidoDto,
  CrearOpciones,
  CrearPedidoDto,
  Pedido
} from '#gql';

export const apiPedido = {
  /**
   * Pedidos
   */
  pedidoIniciar: async (
    datos: CrearPedidoDto,
    opciones: CrearOpciones = {},
    token: any = null
  ): Promise<Pedido> => {
    let resultado;
    Object.assign(datos, { conFactura: false });
    console.log(datos);
    try {
      await loadingAsync(async () => {
        resultado = await GqlIniciarPedido(
          { datos, opciones },
          //@ts-expect-error
          useGqlToken(token)
        );
      });
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
          { busqueda, itemIds: [], estado: { estado: 'confirmado' } }, //@ts-expect-error
          useGqlToken(token)
        );
      });
      if (!resultado) {
        throw 'error resultado null';
      }
    } catch (err) {
      throw formatApiError(err);
    }
    return extraerUno(resultado);
  },

  pedido_leerMenu: async (entidadID: string, token: any) => {
    try {
      const menu = extraerUno(
        await GqlEntidadLeerMenu(
          {
            busqueda: { _id: [entidadID] },
            busquedaMenu: {},
            opciones: { limit: 1, errorSiVacio: true }
          }, //@ts-ignore
          useGqlToken(token)
        )
      );
      return menu;
    } catch (err) {
      throw formatApiError(err);
    }
  },

  pedido_leerEstadoItems: async (
    b: BuscarPedidoDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    t: any = null
  ) => await buscarUno(GqlLeerEstadoPedido, useGqlToken(t), b, o, o.loading)
};
