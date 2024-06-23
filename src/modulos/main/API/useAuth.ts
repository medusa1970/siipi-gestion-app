import type { ConexionResponse, CrearPersonaDto, Entidad, Persona } from '#gql';

export const useAuth = {
  /**
   * Efectua un pedido de conexion por token jwt
   * @returns { persona, entidad, permisos, cargos }
   */
  login: async (
    usuario: string,
    contrasena: string,
    entidad?: string,
  ): Promise<ConexionResponse> => {
    return extraer(
      await GqlAuthConectar({
        datos: {
          usuario,
          contrasena,
          entidad,
        },
      }),
    );
  },

  /**
   * Efectua un pedido de conexion por token jwt
   * @returns { persona, entidad, permisos, cargos }
   */
  async cambiarEntidad(entidad: string, token: any): Promise<ConexionResponse> {
    return extraer(
      await GqlAuthCambiarEntidad(
        { datos: { entidad } },
        //@ts-ignore
        useGqlToken(token),
      ),
    );
  },

  /**
   * Busca todas las entidades en cuales el usuario conectado tiene algun permiso
   * @returns Entidad[]
   */
  buscarEntidadesDeUsuario: async (token?: any): Promise<Entidad[]> => {
    return extraer(
      //@ts-ignore
      await GqlAuthEntidadesUsuarioConectado(useGqlToken(token)),
    );
  },

  /**
   * Registra un nuevo usuario
   * @returns Persona
   */
  registrar: async (datos: CrearPersonaDto): Promise<Persona> => {
    const { _id, usuario, ...nuevoDato } = datos;
    const [nuevaPersona] = extraer(
      await GqlAuthCrearPersonas({
        datos: [nuevoDato],
      }),
    );
    return nuevaPersona;
  },

  /**
   * pedir cambio de contraseña
   * @returns true
   */
  pedirRDC: async (correo: string): Promise<boolean> => {
    return extraer(await GqlAuthPedirRDC({ correo }));
  },

  /**
   * cambiar la contraseña
   * @returns true
   */
  actuarRDC: async (token: string, contrasena: string): Promise<boolean> => {
    return extraer(await GqlAuthActuarRDC({ token, contrasena }));
  },
};
