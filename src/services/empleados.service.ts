import { postData } from './service.config';

export const empleadoService = {
  obtenerTodosEmpleados: async (nombre: string) =>
    postData(
      GqlBuscarEntidadEmpleados({
        busqueda: { nombre },
        busquedaEmpleado: {},
        opciones: { populate: true },
      }),
    ),
  buscarPersonas: async () => postData(GqlBuscarPersonas({ busqueda: {} })),
  agregarEmpleado: async (
    _id: string | null | undefined,
    personaID: string,
    personaCargo: string,
  ) =>
    postData(
      GqlAgregarEmpleadoEntidad({
        busqueda: { _id },
        datos: { persona: personaID, cargo: personaCargo },
      }),
    ),
  borrarEmpleado: async (
    negocioID: string | null | undefined,
    empleadoID: string,
  ) =>
    postData(
      GqlBorrarEmpleadoEntidad({
        busqueda: { _id: negocioID },
        busquedaEmpleado: { _id: empleadoID },
      }),
    ),
  agregarRolEmpleado: async (
    negocioID: string | null | undefined,
    empleadoID: string,
    rol: string,
  ) =>
    postData(
      GqlEntidadAsignarRoles({
        entidadBusqueda: { _id: negocioID },
        datos: [{ persona: empleadoID, rol }],
      }),
    ),
  eliminarRolEmpleado: async (
    negocioID: string | null | undefined,
    empleadoID: string,
    rol: string,
  ) =>
    postData(
      GqlEntidadAsignarRoles({
        entidadBusqueda: { _id: negocioID },
        datos: [{ persona: empleadoID, rol, revocar: true }],
      }),
    ),
};
