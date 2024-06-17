import { NotifyError, NotifySucess } from '@/helpers/message.service';

/**
 * AuthStore: Almacén de estado para la autenticación
 * Contiene información sobre el usuario autenticado, el token y el negocio seleccionado.
 */

interface AuthStoreProps {
  token: string | null;
  user: {
    _id: string;
    nombre: string;
    usuario: string;
    apellido: string;
    correo: string;
    telefono: string;
    cloudinaryUrl?: string | null;
    negocios: {
      _id: string;
      nombre: string;
      tipo: string;
      empleados: {
        persona: string;
        cargos: {
          nombre: string;
        }[];
        permisos: {
          permiso: string;
        }[];
      }[];
    }[];
  } | null;
  negocio: {
    _id: string;
    nombre: string;
    tipo: string;
    cargos: { nombre: string }[];
    permisos: string[];
  } | null;
}

export const useAuthStore = defineStore('auth', {
  /**
   * state
   */
  state: (): AuthStoreProps => {
    return {
      token: null,
      user: null,
      negocio: null,
    };
  },

  /**
   * getters
   */
  getters: {
    getToken: (state) => state.token,
    getUser: (state) => state.user,
    getNegocio: (state) => state.negocio,
    getUserNombreCompleto: (state) =>
      state.user ? `${state.user.nombre} ${state.user.apellido}` : null,
  },

  /**
   * actions
   */
  actions: {
    /**
     * Login
     */
    async login(usuario: string, contrasena: string) {
      useAuth.login(usuario, contrasena).then(async (loginResponse) => {
        const negocios = await useAuth.buscarEntidadesDeUsuario(
          loginResponse.token,
        );
        negocios.push({
          _id: 'cliente',
          nombre: 'Cliente',
          tipo: 'CLIENTE',
          empleados: [],
        });
        this.$patch({
          token: loginResponse.token,
          user: {
            _id: loginResponse.personaId,
            usuario: loginResponse.usuario,
            nombre: loginResponse.nombre,
            apellido: loginResponse.apellido,
            correo: loginResponse.correo,
            telefono: loginResponse.telefono,
            cloudinaryUrl: loginResponse.cloudinaryUrl,
            negocios,
          },
        });
      });
    },

    /**
     * Elegir negocio
     */
    async elegirNegocio(index: number) {
      if (this.user && this.user.negocios[index]) {
        const negocio = this.user.negocios[index];
        this.$patch({
          negocio: {
            _id: negocio._id,
            nombre: negocio.nombre,
            tipo: negocio.tipo,
            cargos: negocio.empleados[0].cargos,
            permisos: negocio.empleados[0].permisos.map((p) => p.permiso),
          },
        });
      }
    },

    /**
     * Logout
     */
    logout() {
      this.$patch({
        token: null,
        user: null,
        negocio: null,
      });
    },

    /**
     * checkPermisos
     */
    checkPermisos(permisosRequeridos: string[]) {
      if (this.negocio) {
        const userPermisos = this.negocio.permisos;
        permisosRequeridos.push('DESAROLLO');
        return (
          permisosRequeridos.length === 0 ||
          userPermisos.find((permiso) => permisosRequeridos.includes(permiso))
        );
      } else {
        // ??
        return true;
      }
    },
  },
  persist: true,
});
