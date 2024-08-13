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

  pedidos_buscar: async (
    b: BuscarPedidoDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    f: BuscarPedidoDto = {},
    t: any = null
  ): Promise<Pedido[]> =>
    <Pedido[]>(
      await buscarVarios(GqlBuscarPedidos, useGqlToken(t), b, o, f, o.loading)
    ),

  pedido_buscarUno: async (
    b: BuscarPedidoDto,
    o: BuscarOpciones & { loading?: boolean } = {},

    t: any = null
  ): Promise<Pedido[]> =>
    <Pedido[]>await buscarUno(GqlBuscarPedidos, t, b, o, o.loading),

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
  ) => await buscarUno(GqlLeerEstadoPedido, useGqlToken(t), b, o, o.loading),

  pedido_aceptarOfertas: async (
    pedidosIDS: string[],
    tipo: string,
    token: any
  ) => {
    try {
      console.log(pedidosIDS, tipo);
      const pedidos = extraer(
        await GqlCambiarEstadoItemsPorOfertas_aceptar(
          {
            busqueda: { _id: pedidosIDS },
            estado: {
              estado: 'aceptado'
            },
            tipo,
            opciones: {}
          }, //@ts-ignore
          useGqlToken(token)
        )
      );
      console.log(pedidos);
      return pedidos;
    } catch (err) {
      throw formatApiError(err);
    }
  },

  pedido_prepararOfertas: async (
    pedidosIDS: string[],
    ofertaIds: string[],
    token: any
  ) => {
    try {
      console.log(pedidosIDS, ofertaIds);
      const pedidos = extraer(
        await GqlCambiarEstadoItemsPorOfertas_preparar(
          {
            busqueda: { _id: pedidosIDS },
            ofertaIds,
            estado: {
              estado: 'preparado'
            },
            opciones: { populate: true }
          }, //@ts-ignore
          useGqlToken(token)
        )
      );
      console.log(pedidos);
      return pedidos;
    } catch (err) {
      throw formatApiError(err);
    }
  },

  pedido_ajustarOfertas: async (
    pedidoIds: string[],
    ofertaId: string,
    comentario: string,
    diferenciaTotal: number,
    token?: any
  ) => {
    try {
      // console.log(pedidosIDS, ofertaIds);
      const pedidos = extraer(
        await GqlAjustarItemsPorOferta(
          {
            busqueda: { _id: pedidoIds },
            ofertaId,
            estado: {
              estado: 'ajustado',
              valor: [diferenciaTotal],
              comentario
            }
          }, //@ts-ignore
          useGqlToken(token)
        )
      );
      console.log(pedidos);
      return pedidos;
    } catch (err) {
      throw formatApiError(err);
    }
  },

  pedido_recibirOfertas: async (pedidoID: string, token?: any) => {
    try {
      console.log(pedidoID, token);
      const pedidos = extraer(
        await GqlCambiarEstadoItems(
          {
            busqueda: { _id: [pedidoID] },
            opciones: { limit: 1, errorSiVacio: true },
            estado: {
              estado: 'recibido'
            }
          }, //@ts-ignore
          useGqlToken(token)
        )
      );
      console.log(pedidos);
      return pedidos;
    } catch (err) {
      throw formatApiError(err);
    }
  }
};
