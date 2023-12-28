import { postData } from './service.config';

export const empleadoService = {
  obtenerTodosEmpleados: async (nombre: string) =>
    postData(
      GqlBuscarEntidadEmpleados({
        busqueda: { nombre },
        busquedaEmpleado: {},
        opciones: { populate: true }
      })
    ),
  buscarPersonas: async () => postData(GqlBuscarPersonas({ busqueda: {} })),
  agregarEmpleado: async (
    _id: string | null | undefined,
    personaID: string,
    personaCargo: string
  ) =>
    postData(
      GqlAgregarEmpleadoEntidad({
        busqueda: { _id },
        datos: { persona: personaID, cargo: personaCargo }
      })
    ),
  borrarEmpleado: async (
    negocioID: string | null | undefined,
    empleadoID: string
  ) =>
    postData(
      GqlBorrarEmpleadoEntidad({
        busqueda: { _id: negocioID },
        busquedaEmpleado: { _id: empleadoID }
      })
    )
};
