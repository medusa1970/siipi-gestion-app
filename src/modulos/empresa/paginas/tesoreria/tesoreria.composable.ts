import { useEmpresa } from '~/modulos/empresa/empresa.composable';

/**
 * Permisos requeridos para esta pagina
 */
export const permisosTesoreria = ['LOGISTICA'];

/**
 * Composable para empresa/tesoreria
 */
export const useTesoreria = () => {
  const { store, authStore, router } = useEmpresa();
  if (!authStore.autorizar(permisosTesoreria)) goTo(router, '/noAutorizado');

  const estado = reactive({});

  return {
    estado,
    store,
    authStore,
    router,
  };
};
