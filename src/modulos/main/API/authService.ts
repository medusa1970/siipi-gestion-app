import type { ConexionResponse, CrearPersonaDto, Entidad, Persona } from '#gql';

<<<<<<< HEAD:src/modulos/main/API/useAuth.ts
export const useAuth = {
=======
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
>>>>>>> will-productos:src/modulos/main/API/authService.ts
  /**
   * Efectua un pedido de conexion por token jwt
   * @returns { persona, entidad, permisos, cargos }
   */
  login: async (
    usuario: string,
    contrasena: string,
    entidad?: string,
  ): Promise<ConexionResponse> => {
    try {
      return extraer(
        await GqlAuthConectar({
          datos: {
            usuario,
            contrasena,
            entidad,
          },
        }),
      );
    } catch (e) {
      throw getApiErrorCode(e);
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
          useGqlToken(token),
        ),
      );
    } catch (e) {
      throw getApiErrorCode(e);
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
        await GqlAuthEntidadesUsuarioConectado(useGqlToken(token)),
      );
    } catch (e) {
      throw getApiErrorCode(e);
    }
  },

  /**
   * Registra un nuevo usuario
   * @returns Persona
   */
  registrar: async (datos: CrearPersonaDto): Promise<Persona> => {
<<<<<<< HEAD:src/modulos/main/API/useAuth.ts
    try {
      const [nuevaPersona] = extraer(
        await GqlAuthCrearPersonas({
          datos: [datos],
        }),
      );
      console.log(datos);
      console.log(nuevaPersona);
      return nuevaPersona;
    } catch (e) {
      throw getApiErrorCode(e);
    }
=======
    const { _id, usuario, ...nuevoDato } = datos;
    console.log(nuevoDato);
    const [nuevaPersona] = await postDataGql(
      GqlAuthCrearPersonas({
        datos: [nuevoDato],
      }),
    );
    return nuevaPersona;
>>>>>>> will-productos:src/modulos/main/API/authService.ts
  },

  /**
   * pedir cambio de contraseña
   * @returns true
   */
  pedirRDC: async (correo: string): Promise<boolean> => {
    try {
      return extraer(await GqlAuthPedirRDC({ correo }));
    } catch (e) {
      throw getApiErrorCode(e);
    }
  },

  /**
   * cambiar la contraseña
   * @returns true
   */
  actuarRDC: async (
    token: string,
    contrasena: string | null = null,
  ): Promise<boolean> => {
    try {
      // @ts-ignore contrasena puede ser null pero ts no lo detecta bien
      return extraer(await GqlAuthActuarRDC({ token, contrasena }));
    } catch (e) {
      throw getApiErrorCode(e);
    }
  },
};
