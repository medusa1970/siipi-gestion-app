import type { ModificarPersonaDto, Persona } from '#gql';


export const usuarioApiService = {
  /**
   * Busca una persona
   * @returns Persona[]
   */
  buscarPersona: async (
    personaID: string,
    loading = false,
  ): Promise<Persona> => {
    const [persona] = extraer(
      await GqlUsuarioBuscarPersonas({
        busqueda: { _id: [personaID] },
        opciones: { limit: 1, errorSiVacio: true },
      }),
    );
    return persona;
  },

  /**
   * Modifica una persona
   * @returns Persona (la modificada)
   */
  modificarPersona: async (personaID: string, datos: ModificarPersonaDto) => {
    const personas = extraer(
      await GqlUsuarioModificarPersonas({
        busqueda: { _id: [personaID] },
        datos,
        opciones: { limit: 1, errorSiVacio: true },
      }),
    );
    return personas[0];
  },
};
