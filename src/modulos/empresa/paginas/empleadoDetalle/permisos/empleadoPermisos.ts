import { useEmpresa } from '~/modulos/empresa/empresa.composable';
import { TipoPermiso } from '~/schema/permisos';

export const useEmpleadoPermisos = () => {
  const { store, authStore, estadoEmpresa, router } = useEmpresa();

  // inicializacion del formulario con cada permiso posible
  const initForm = () => {
    return TipoPermiso.map(permiso => {
      const permisoEmpleado = store.empleado.permisos.find(
        p => p.permiso === permiso
      );
      return {
        estado: Boolean(permisoEmpleado),
        permiso: permiso,
        vencimiento: permisoEmpleado?.vencimiento ?? null
      };
    });
  };

  // estado reactivo
  const estado = reactive({
    dataForm: [] as ReturnType<typeof initForm>
  });

  // Inicializaciones
  onBeforeMount(async () => {
    await store.refreshEmpleados();
    estado.dataForm = initForm();
  });

  // submision del formulario
  const formSubmit = async () => {
    const datosPermisos = {
      borrar: { permiso: [] }, // permisos a quitar o modificar
      agregar: [] // permisos a agregar o modificar
    };
    // recorremos los permisos del formulario
    for (const nuevoPermiso of estado.dataForm) {
      // buscamos el permiso correspondiente donde el empleado
      const permisoActual = store.empleado.permisos.find(
        p => p.permiso === nuevoPermiso.permiso
      );
      console.log(permisoActual?.permiso, nuevoPermiso.estado);
      // modificacion o delecion
      if (permisoActual /* TODO : && detect_changes */) {
        datosPermisos.borrar.permiso.push(nuevoPermiso.permiso);
      }
      // modificacion o creacion
      if (nuevoPermiso.estado) {
        datosPermisos.agregar.push({
          permiso: nuevoPermiso.permiso,
          vencimiento: nuevoPermiso.vencimiento
        });
      }
    }

    try {
      const empleado = await api.modificarEntidad_empleados(
        authStore.getNegocio._id,
        {
          empleados: {
            buscar: {
              _id: [store.empleado._id]
            },
            modificar: {
              permisos: {
                borrar: datosPermisos.borrar,
                agregar: datosPermisos.agregar
              }
            }
          }
        },
        {
          loading: true
          // aceptarInexistentes: true,
        }
      );
    } catch (err) {
      errFailback(err);
      return;
    }
    // reinicializamos el formulario
    await store.refreshEmpleados();
    NotifySucessCenter('Permisos cambiados correctamente');
  };

  return {
    estado,
    store,
    authStore,
    router,
    formSubmit
  };
};
