import type { EditarPerfil } from '../negocio/usuario.interface';

export const usuarioApiService = {
  /**
   * Busca una persona
   * @returns Persona[]
   */
  buscarPersona: async (personaID: string) => {
    const [persona] = await postDataGql(
      GqlBuscarPersonas({
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
  modificarPersona: async (personaID: string, datos: EditarPerfil) => {
    const personas = await postDataGql(
      GqlModificarPersonas({
        busqueda: { _id: [personaID] },
        datos,
        opciones: { limit: 1, errorSiVacio: true },
      }),
    );
    return personas[0];
  },
};
