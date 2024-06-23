import { useAuth } from '~/modulos/main/API/useAuth';
import type { Empleado, Entidad, Persona } from '#gql';

/**
 * AuthStore: Almacén de estado para la autenticación
 * Contiene información sobre el usuario autenticado, el token y el negocio seleccionado.
 */

interface NegocioUsuario {
  _id: string;
  nombre: string;
  tipo: string;
  cargos: { nombre: string }[];
  permisos: string[];
}
interface Usuario {
  _id: string;
  nombre: string;
  usuario: string;
  apellido: string;
  correo: string;
  telefono: string;
  cloudinaryUrl?: string | null;
  negocios: NegocioUsuario[] | null;
}

interface AuthStoreProps {
  token: string | null;
  usuario: Usuario | null;
  negocio: NegocioUsuario | null;
}

export const useAuthStore = defineStore('auth', {
  /**
   * state
   */
  state: (): AuthStoreProps => {
    return {
      token: null,
      usuario: null,
      negocio: null,
    };
  },

  /**
   * getters
   */
  getters: {
    getToken: (state) => state.token,
    getUsuario: (state) => state.usuario,
    getUsuarioId: (state) => state.usuario?._id,
    getNegocio: (state) => state.negocio,
    getCargo: (state) => state.negocio?.cargos[0].nombre,
    getUsuarioNombreCompleto: (state) =>
      state.usuario
        ? `${state.usuario.nombre} ${state.usuario.apellido}`
        : null,
  },

  /**
   * actions
   */
  actions: {
    /**
     * Login
     */
    async login(usuario: string, contrasena: string) {
      await useAuth.login(usuario, contrasena).then(async (loginResponse) => {
        const entidades = await useAuth.buscarEntidadesDeUsuario(
          loginResponse.token,
        );
        const negocios = entidades.map((entidad) => {
          console.log(entidad.empleados);
          const empleado = entidad.empleados.find(
            (empleado) => empleado.persona.usuario === loginResponse.usuario,
          ) as Empleado;
          return {
            _id: entidad._id,
            nombre: entidad.nombre,
            tipo: entidad.tipo,
            cargos: empleado.cargos.map((cargo) => {
              return { nombre: cargo.nombre };
            }),
            permisos: empleado.permisos.map((permiso) => {
              return permiso.permiso;
            }),
          } as NegocioUsuario;
        });
        negocios.push({
          _id: 'cliente',
          nombre: 'Cliente',
          tipo: 'CLIENTE',
          cargos: [{ nombre: 'cliente' }],
          permisos: [],
        });
        this.$patch({
          token: loginResponse.token,
          usuario: {
            _id: loginResponse.personaId,
            usuario: loginResponse.usuario,
            nombre: loginResponse.nombre,
            apellido: loginResponse.apellido,
            correo: loginResponse.correo,
            telefono: loginResponse.telefono,
            cloudinaryUrl: loginResponse.cloudinaryUrl,
            negocios: negocios,
          },
        });
      });
    },

    /**
     * Elegir negocio
     */
    async elegirNegocio(index: number): Promise<NegocioUsuario | false> {
      // solo tiene sentido si el usuario y el negocio existen
      if (!this.getUsuario || !this.usuario?.negocios?.[index]) {
        return false;
      }
      const negocio = this.usuario?.negocios?.[index];

      // TODO Pasar al nivel superior
      // cambiamos el token
      try {
        const { token } = await useAuth.cambiarEntidad(negocio._id, this.token);
        this.$patch({
          token,
          negocio,
        });
        return negocio;
      } catch (error) {
        const code = getApiErrorCode(error);
        switch (code) {
          default:
            NotifyError(`Un error ocurrió (${code})`);
        }
        return false;
      }
    },

    /**
     * Logout
     */
    logout() {
      this.$patch({
        token: null,
        usuario: null,
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
        return false;
      }
    },

    /**
     * Editar el perfil
     */
    editarPerfil(persona: Persona, cloudinaryUrl = null) {
      // solo tiene sentido si hay un usuario en el state
      if (this.usuario) {
        this.$patch((state) => {
          const nuevo = {};
          // @ts-expect-error ya averiguamos que existe state.usuario
          Object.assign(state.usuario, {
            nombre: persona.nombre,
            apellido: persona.apellido,
            telefono: persona.telefono,
            correo: persona.correo,
            cloudinaryUrl: persona.imagen?.cloudinaryUrl,
          });
          return state;
        });
      }
    },
  },

  persist: true,
});
