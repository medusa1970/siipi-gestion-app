import { apiAuth } from "~/modulos/main/API/auth.api";
import type { ConexionResponse, Empleado, Entidad, Persona } from "#gql";
import localforage from "localforage";

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
  recienDesconectado: boolean;
  cookie: {
    rdcToken: string;
    registrado: Persona | null;
  };
}

export const useAuthStore = defineStore("auth", {
  /**
   * state
   */
  state: (): AuthStoreProps => {
    return {
      token: null,
      usuario: null,
      negocio: null,
      recienDesconectado: false,
      cookie: { rdcToken: "", registrado: null },
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
    getCookie: (state) => state.cookie,
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
     * RD
     */
    getRecienDesconectado(): boolean {
      const estado = this.recienDesconectado;
      this.recienDesconectado = false;
      return estado;
    },

    /**
     * Login
     */
    async login(usuario: string, contrasena: string) {
      let entidades: Entidad[];
      let loginResponse: ConexionResponse;

      try {
        loginResponse = await apiAuth.login(usuario, contrasena);
        entidades = await apiAuth.buscarEntidadesDeUsuario(loginResponse.token);
      } catch (err) {
        throw err;
      }

      // negocios del usuario filtrando los empleados de las entidad
      const negocios = entidades.map((entidad) => {
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

      // agregamos el negocio 'cliente'
      negocios.push({
        _id: "665ff01b7aa0f5756c88656e",
        nombre: "Cliente",
        tipo: "CLIENTELA",
        cargos: [],
        permisos: [],
      });

      // patcheamos el store
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

      // TODO VACIAR INDEXDB
      console.log("cleared everything");
      localStorage.clear();
      localforage.clear();
    },

    /**
     * Elegir negocio
     */
    async elegirNegocio(index: number) {
      if (!this.getUsuario || !this.usuario?.negocios?.[index]) {
        throw "ERR_USUARIO_REQ";
      }
      try {
        const negocio = this.usuario.negocios[index];
        const { token } = await apiAuth.cambiarEntidad(negocio._id, this.token);
        this.$patch({
          token,
          negocio,
        });
      } catch (err) {
        throw err;
      }
    },

    /**
     * Logout
     */
    logout() {
      console.log("cleared everything");
      localStorage.clear();
      localforage.clear();
      this.$patch({
        token: null,
        usuario: null,
        negocio: null,
        recienDesconectado: true,
      });
    },

    /**
     * autorizar
     */
    autorizar(permisosRequeridos: string[] = null) {
      // pagina abierta sin restriccion si null
      if (permisosRequeridos === null) return true;

      // sino se requiere una entidad
      if (!this.negocio) return false;

      const userPermisos = this.negocio.permisos;
      const requerido = [...permisosRequeridos, "DESAROLLO"];
      let autorizado = false;
      for (const permiso of userPermisos) {
        if (permiso === "BLOQUEADO") return false;
        if (requerido.includes(permiso)) autorizado = true;
      }
      return autorizado;
    },

    /**
     * Editar el perfil
     */
    editarPerfil(persona: Persona, cloudinaryUrl = null) {
      this.$patch((state) => {
        if (!state.usuario) {
          throw "ERR_USUARIO_REQ";
        }
        Object.assign(state.usuario, {
          nombre: persona.nombre,
          apellido: persona.apellido,
          telefono: persona.telefono,
          correo: persona.correo,
          cloudinaryUrl: persona.imagen?.cloudinaryUrl,
        });
      });
    },
  },

  persist: true,
});
