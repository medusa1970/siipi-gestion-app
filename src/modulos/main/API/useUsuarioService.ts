import type { ModificarPersonaDto, Persona } from '#gql';
import { usuarioApiService } from './usuarioApiService';
import { useAuthStore } from '~/modulos/main/useAuthStore';

export const useUsuarioService = () => {
  const authStore = useAuthStore();

  /**
   * Editar el perfil de un usuario
   */
  const editarPerfil = async (id: string, datos: ModificarPersonaDto) => {
    const persona = await usuarioApiService.modificarPersona(id, datos);
    if (persona) {
      // @ts-ignore
      authStore.editarPerfil(datos as Persona);
    }
    return persona;
  };

  return { editarPerfil };
};
