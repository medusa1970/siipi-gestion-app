import type {
  BuscarOpciones,
  BuscarTransaccionDto,
  CrearOpciones,
  CrearTransaccionDto
} from '#gql';

export const apiEmpresa = {
  /**
   * crearTransaccionConLimite
   */
  crearTransaccionConLimite: async (
    crearTransaccion: CrearTransaccionDto,
    opciones: CrearOpciones = {},
    token: any = null
  ) => {
    let resultado;
    try {
      await loadingAsync(async () => {
        resultado = await GqlCrearTransaccionConLimite(
          { crearTransaccion, opciones },
          // @ts-expect-error
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

  /**
   * validarTransaccion
   */
  validarTransaccion: async (
    buscarTransaccion: BuscarTransaccionDto,
    opciones: CrearOpciones = {},
    token: any = null
  ) => {
    let resultado;
    try {
      await loadingAsync(async () => {
        resultado = await GqlValidarTransaccion(
          { buscarTransaccion, opciones },
          // @ts-expect-error
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

  /**
   * pedidosPorPagarEntidad
   */
  pedidosPorPagarEntidad: async (
    entidadId: string,
    opciones: BuscarOpciones = {},
    token: any = null
  ) => {
    let resultado;
    try {
      resultado = await GqlPedidosPorPagarEntidad(
        { entidadId, opciones },
        // @ts-expect-error
        useGqlToken(token)
      );
      if (!resultado) {
        throw 'error resultado null';
      }
    } catch (err) {
      throw formatApiError(err);
    }
    return extraer(resultado);
  }
};
