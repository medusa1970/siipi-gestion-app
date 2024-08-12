import { useEmpresa } from '~/modulos/empresa/empresa.composable';

/**
 * Permisos requeridos para esta pagina
 */
export const permisosEmpleadosDetalles = ['ADMINISTRACION'];

/**
 * Composable para empresa/empleados
 */
export const useEmpleadoDetalle = () => {
  const { store, authStore, estadoEmpresa, router } = useEmpresa();
  if (!authStore.autorizar(permisosEmpleadosDetalles))
    goTo(router, 'noAutorizado');

  const estado = reactive({
    tabActiva: 'permisos'
  });

  return {
    estado,
    store,
    authStore,
    router
  };
};
