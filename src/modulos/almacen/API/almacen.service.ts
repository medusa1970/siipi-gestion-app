import type { CrearEntidadDto, CrearOpciones, Entidad } from '#gql';

export const almacenService = {
  crearEntidad: async (
    datos: CrearEntidadDto,
    opciones: CrearOpciones = null,
  ): Promise<Entidad> => {
    try {
      return extraerUno(
        await GqlAlmacenCrearEntidades({ datos: [datos], opciones }),
      );
    } catch (err) {
      throw formatApiError(err);
    }
  },
};
