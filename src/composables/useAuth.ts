import { NotifySucess } from '~/helpers/message.service';
import type { PersonaProps } from '../interfaces/product.interface';
import { postDataGql } from '../services/service.config';

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
   * Busca el nombre y el tipo de todas las entidades
   * @returns Entidad[]
   */
  // TODO No pertenece aqui
  buscarTodasEntidades: async () => {
    const entidades = await postDataGql(GqlBuscarEntidades_tipo({}));
    return entidades;
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
