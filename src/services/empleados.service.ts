import { postDataGql } from './service.config';

export const empleadoService = {
  /**
   * Busca todos los empleados de una entidad
   * @returns Empleado[]
   */
  obtenerTodosEmpleados: async (entidadID: string) => {
    const [entidad] = await postDataGql(
      GqlBuscarEntidades_empleados({
        busqueda: { _id: [entidadID] },
        opciones: { limit: 1, errorSiVacio: true, populate: true },
      }),
    );
    return entidad.empleados;
  },

  /**
   * Agrega un empleado a una entidad
   * @returns Empleado (lo agregado)
   */
  agregarEmpleado: async (
    _id: string,
    personaID: string,
    personaCargo: string,
    permisos: string[] = [],
  ) => {
    const empleado = {
      persona: personaID,
      cargos: [
        {
          nombre: personaCargo,
        },
      ],
      permisos: permisos.map((permiso) => {
        return {
          permiso,
        };
      }),
    };
    const [entidad] = await postDataGql(
      GqlModificarEntidades_empleados({
        busqueda: { _id: [_id] },
        datos: {
          empleados: {
            agregar: [empleado],
          },
        },
        opciones: { populate: true, limit: 1, errorSiVacio: true },
      }),
    );
    return entidad.empleados[entidad.empleados.length - 1];
  },

  /**
   * Borra un empleado de una entidad
   * @returns Empleado (copia del borrado)
   */
  borrarEmpleado: async (negocioID: string, empleadoID: string) => {
    const res = await postDataGql(
      GqlModificarEntidades_empleados({
        busqueda: { _id: [negocioID] },
        datos: {
          empleados: {
            borrar: {
              _id: [empleadoID],
            },
          },
        },
        opciones: { limit: 1, errorSiVacio: true },
      }),
    );
    return res;
  },

  /**
   * Busca todas la personas
   * @returns Persona[]
   */
  buscarPersonas: async () => {
    const personas = await postDataGql(GqlBuscarPersonas({}));
    return personas;
  },

  /**
   * Busca una persona
   * @returns Persona[]
   */
  buscarPersona: async (personaID: string) => {
    const [persona] = await postDataGql(
      GqlBuscarPersonas({
        busqueda: { _id: [personaID] },
        opciones: { limit: 1, errorSiVacio: true },
      }),
    );
    return persona;
  },

  /**
   * Modifica una persona
   * @returns Persona (la modificada)
   */
  modificarPersona: async (
    personaID: string,
    datos: {
      nombre: string;
      apellido: string;
      correo: string;
      imagen: { mimetype: string; data: string };
    },
  ) => {
    const personas = await postDataGql(
      GqlModificarPersonas({
        busqueda: { _id: [personaID] },
        datos,
        opciones: { limit: 1, errorSiVacio: true },
      }),
    );
    return personas[0];
  },
};
