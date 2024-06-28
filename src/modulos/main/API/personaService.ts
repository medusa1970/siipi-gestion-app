import type { ModificarPersonaDto, Persona } from '#gql';

<<<<<<< HEAD:src/modulos/main/API/usuarioApiService.ts

export const usuarioApiService = {
=======
export const personaService = {
>>>>>>> will-productos:src/modulos/main/API/personaService.ts
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
