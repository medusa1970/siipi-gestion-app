import type { PersonaProps } from '~/interfaces/product.interface';
import { postData } from './service.config';

export const authService = {
  login: async (
    usuario: string,
    contrasena: string,
    entidad?: string | null | undefined,
  ) => postData(GqlConectar({ datos: { usuario, contrasena, entidad } })),
  buscarEntidadesDeUsuario: async (
    token: string, //@ts-ignore
  ) => postData(GqlBuscarEntidadesConUsuario(useGqlToken(token))),
  registrar: async (datos: PersonaProps) => {
    const { _id, usuario, ...nuevoDato } = datos;
    return postData(GqlCrearPersona({ datos: nuevoDato }));
  },
  buscarEmpleadoCargo: async (
    entidadID: string | null | undefined,
    personaID: string,
  ) =>
    postData(
      GqlEntidadBuscarEmpleado({
        busqueda: { _id: entidadID },
        busquedaEmpleado: { persona: personaID },
      }),
    ),
  buscarTodasEntidades: async () =>
    postData(GqlBuscarTodasEntidades({ busqueda: {} })),
};
