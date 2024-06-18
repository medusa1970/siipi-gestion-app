export interface PersonaProps {
  _id?: string;
  usuario: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  contrasena: string;
}

export const useAuth = {
  /**
   * Efectua un pedido de conexion por token jwt
   * @returns { persona, entidad, permisos, cargos }
   */
  login: async (usuario: string, contrasena: string, entidad?: string) => {
    const response = await postDataGql(
      GqlConectar({
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
  buscarEntidadesDeUsuario: async (token?: any) => {
    const entidades = await postDataGql(
      //@ts-ignore
      GqlEntidadesUsuarioConectado(useGqlToken(token)),
    );
    return entidades;
  },

  /**
   * Registra un nuevo usuario
   * @returns Persona
   */
  registrar: async (datos: PersonaProps) => {
    const { _id, usuario, ...nuevoDato } = datos;
    const [nuevaPersona] = await postDataGql(
      GqlCrearPersonas({
        datos: [nuevoDato],
      }),
    );
    return nuevaPersona;
  },

  /**
   * pedir cambio de contraseña
   * @returns true
   */
  pedirRDC: async (correo: string) => {
    const res = await postDataGql(GqlPedirRDC({ correo }));
    return res;
  },

  /**
   * cambiar la contraseña
   * @returns true
   */
  actuarRDC: async (token: string, contrasena: string) => {
    const res = await postDataGql(
      GqlActuarRDC({
        token,
        contrasena,
      }),
    );
    return res;
  },
};
