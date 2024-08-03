import type {
  ConexionResponse,
  CrearPersonaDto,
  Entidad,
  ModificarPersonaDto,
  Persona,
} from "#gql";

export const apiAuth = {
  /**
   * Efectua un pedido de conexion por token jwt
   * @returns { persona, entidad, permisos, cargos }
   */
  login: async (
    usuario: string,
    contrasena: string,
    entidad?: string
  ): Promise<ConexionResponse> => {
    try {
      return extraer(
        await GqlAuthConectar({
          datos: {
            usuario,
            contrasena,
            entidad,
          },
        })
      );
    } catch (err) {
      throw formatApiError(err);
    }
  },

  /**
   */
  async cambiarEntidad(entidad: string, token: any): Promise<ConexionResponse> {
    try {
      return extraer(
        await GqlAuthCambiarEntidad(
          { datos: { entidad } },
          //@ts-ignore
          useGqlToken(token)
        )
      );
    } catch (err) {
      throw formatApiError(err);
    }
  },

  /**
   * Busca todas las entidades en cuales el usuario conectado tiene algun permiso
   * @returns Entidad[]
   */
  buscarEntidadesDeUsuario: async (token?: any): Promise<Entidad[]> => {
    try {
      return extraer(
        //@ts-ignore
        await GqlAuthEntidadesUsuarioConectado(useGqlToken(token))
      );
    } catch (err) {
      throw formatApiError(err);
    }
  },

  /**
   * Registra un nuevo usuario
   * @returns Persona
   */
  registrar: async (datos: CrearPersonaDto): Promise<Persona> => {
    try {
      const nuevaPersona = extraerUno(
        await GqlAuthCrearPersonas({
          datos: [datos],
        })
      );
      return nuevaPersona;
    } catch (err) {
      throw formatApiError(err);
    }
  },

  /**
   * pedir cambio de contraseña
   * @returns true
   */
  pedirRDC: async (correo: string): Promise<boolean> => {
    try {
      return extraer(await GqlAuthPedirRDC({ correo }));
    } catch (err) {
      throw formatApiError(err);
    }
  },

  /**
   * cambiar la contraseña
   * @returns true
   */
  actuarRDC: async (
    token: string,
    contrasena: string | null = null
  ): Promise<boolean> => {
    try {
      // @ts-ignore contrasena puede ser null pero ts no lo detecta bien
      return extraer(await GqlAuthActuarRDC({ token, contrasena }));
    } catch (err) {
      throw formatApiError(err);
    }
  },

  /**
   * Editar el perfil de un usuario
   */
  editarPerfil: async (id: string, datos: ModificarPersonaDto) => {
    const persona = await api.modificarPersona(id, datos);
    if (persona) {
      // @ts-ignore
      authStore.editarPerfil(datos as Persona);
    }
    return persona;
  },
};
