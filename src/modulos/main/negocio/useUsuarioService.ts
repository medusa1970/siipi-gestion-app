import type { ModificarPersonaDto } from '#gql';
import { usuarioApiService } from '../API/usuarioApiService';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';

export const useUsuarioService = () => {
  const authStore = useAuthStore();

  /**
   * Editar el perfil de un usuario
   */
  const editarPerfil = async (id: string, datos: ModificarPersonaDto) => {
    const persona = await usuarioApiService.modificarPersona(id, datos);
    if (persona) {
      authStore.editarPerfil(datos);
    }
    return persona;
  };

  return { editarPerfil };
};
