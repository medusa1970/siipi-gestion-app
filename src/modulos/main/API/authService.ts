import type { ConexionResponse, CrearPersonaDto, Entidad, Persona } from '#gql';

export interface PersonaProps {
  _id?: string;
  usuario: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  contrasena: string;
}

export const authService = {
  /**
   * Efectua un pedido de conexion por token jwt
   * @returns { persona, entidad, permisos, cargos }
   */
  login: async (
    usuario: string,
    contrasena: string,
    entidad?: string,
  ): Promise<ConexionResponse> => {
    console.log({ usuario, contrasena, entidad });
    const response = await postDataGql(
      GqlAuthConectar({
        datos: {
          usuario,
          contrasena,
          entidad,
        },
      }),
      false,
    );
    return response;
  },

  /**
   * Busca todas las entidades en cuales el usuario conectado tiene algun permiso
   * @returns Entidad[]
   */
  buscarEntidadesDeUsuario: async (token?: any): Promise<Entidad[]> => {
    const entidades = await postDataGql(
      //@ts-ignore
      GqlAuthEntidadesUsuarioConectado(useGqlToken(token)),
      false,
    );
    return entidades;
  },

  /**
   * Registra un nuevo usuario
   * @returns Persona
   */
  registrar: async (datos: CrearPersonaDto): Promise<Persona> => {
    const { _id, usuario, ...nuevoDato } = datos;
    console.log(nuevoDato);
    const [nuevaPersona] = await postDataGql(
      GqlAuthCrearPersonas({
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
    const res = await postDataGql(GqlAuthPedirRDC({ correo }));
    return res;
  },

  /**
   * cambiar la contraseña
   * @returns true
   */
  actuarRDC: async (token: string, contrasena: string): Promise<boolean> => {
    const res = await postDataGql(
      GqlAuthActuarRDC({
        token,
        contrasena,
      }),
    );
    return res;
  },
};
