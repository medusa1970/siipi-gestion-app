import type { ModificarPersonaDto } from '#gql';
import { personaService } from '../API/personaService';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';

export const useUsuarioService = () => {
  const authStore = useAuthStore();

  /**
   * Editar el perfil de un usuario
   */
  const editarPerfil = async (id: string, datos: ModificarPersonaDto) => {
    const persona = await personaService.modificarPersona(id, datos);
    if (persona) {
      authStore.editarPerfil(datos);
    }
    return persona;
  };

  return { editarPerfil };
};
