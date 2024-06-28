import { authService } from '~/modulos/main/API/authService';
import type { Empleado, Persona, CrearPersonaDto } from '#gql';

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

// export interface Persona {
//   _id?: string; // ? porque no esta requerido ?
//   usuario: string;
//   nombre: string;
//   apellido: string;
//   telefono: string;
//   correo: string;
//   contrasena: string;
// }

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
      authService.login(usuario, contrasena).then(async (loginResponse) => {
        const entidades = await authService.buscarEntidadesDeUsuario(
          loginResponse.token,
        );
        const negocios = entidades.map((entidad) => {
          console.log(entidad.empleados);
          const empleado = entidad.empleados?.find(
            (empleado) => empleado.persona.usuario === loginResponse.usuario,
          ) as Empleado;
          return {
            _id: entidad._id,
            nombre: entidad.nombre,
            tipo: entidad.tipo,
            cargos: empleado.cargos?.map((cargo) => {
              return { nombre: cargo.nombre };
            }),
            permisos: empleado.permisos?.map((permiso) => {
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
    async elegirNegocio(index: number) {
      if (this.usuario && this.usuario.negocios?.[index]) {
        this.$patch({ negocio: this.usuario.negocios[index] });
        return this.usuario.negocios[index];
      } else {
        return null;
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
          //  ya averiguamos que existe state.usuario
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

    /**
     * Register
     */
    // async register(persona: CrearPersonaDto) {
    //   const nuevaPersona = await authService.registrar(persona);
    //   if (nuevaPersona)
    //     NotifySucess(`${nuevaPersona.nombre} se ha registrado correctamente`);
    // },
  },

  persist: true,
});
