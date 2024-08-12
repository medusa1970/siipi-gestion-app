import { useEmpresa } from '~/modulos/empresa/empresa.composable';

/**
 * Permisos requeridos para esta pagina
 */
export const permisosTesoreriaDetalle = ['ADMINISTRACION'];

/**
 * Composable
 */
export const useTesoreriaDetalle = () => {
  const { store, authStore, router } = useEmpresa();
  if (!authStore.autorizar(permisosTesoreriaDetalle))
    goTo(router, 'noAutorizado');

  const estado = reactive({
    tab: 'debido',
    infoPedidos: []
  });

  onBeforeMount(async () => {
    store.useEntidad();
    store.getInfoPedidos();
  });

  return {
    estado,
    store,
    authStore,
    router
  };
};
