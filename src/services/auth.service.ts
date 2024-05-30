import type { PersonaProps } from '../interfaces/product.interface';
import { postDataGql } from './service.config';

export const authService = {
  /**
   * Efectua un pedido de conexion por token jwt
   * @returns { payload, persona, entidad }
   */
  login: async (usuario: string, contrasena: string, entidad?: string) => {
    const payload = await postDataGql(
      GqlConectar({
        datos: {
          usuario,
          contrasena,
          entidad,
        },
      }),
    );
    return payload;
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
   * Busca el cargo de un empleado en una entidad
   * @returns String
   * (nota) cargo ahora es un array de Cargo, por lo momento solo @returnsmos el primero
   */
  buscarEmpleadoCargo: async (entidadID: string, personaID: string) => {
    const [entidad] = await postDataGql(
      GqlBuscarEntidades_empleadoCargos({
        busqueda: {
          _id: [entidadID],
        },
        filtro: {
          empleados: {
            persona: [personaID],
          },
        },
        opciones: { limit: 1, errorSiVacio: true },
      }),
    );
    return entidad.empleados[0]?.cargos[0];
  },

  /**
   * Busca el nombre y el tipo de todas las entidades
   * @returns Entidad[]
   */
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
