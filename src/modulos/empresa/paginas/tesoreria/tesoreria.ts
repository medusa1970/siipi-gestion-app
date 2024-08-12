import type { Pedido } from '#gql';
import { useEmpresa } from '~/modulos/empresa/empresa.composable';

/**
 * Permisos requeridos para esta pagina
 */
export const permisosTesoreria = ['ADMINISTRACION'];

/**
 * Composable
 */
export const useTesoreria = () => {
  const { store, authStore, estadoEmpresa, router } = useEmpresa();
  if (!authStore.autorizar(permisosTesoreria)) goTo(router, 'noAutorizado');

  const estado = reactive({
    pedidos: [] as Pedido[],
    infoPedidos: [] as any[],
    row: null,
    filtros: {
      buscar: ''
    },
    showModal: {
      detalles: false
    }
  });

  onBeforeMount(async () => {
    store.infoPedidos = await store.getInfoPedidos();
  });

  // Rows para la tabla
  const rowsTabla = computed(() => {
    return store.infoPedidos ?? [];
  });

  return {
    estado,
    store,
    authStore,
    router,
    rowsTabla
  };
};
