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
    let filtered = store.infoPedidos;
    if (!filtered) return [];
    if (estado.filtros.buscar != null) {
      const regex = new RegExp(`${estado.filtros.buscar}`, 'i');
      filtered = filtered.filter(infoPedido => {
        return regex.test(sinImportarAcentos(infoPedido.entidad.nombre));
      });
    }
    return filtered;
  });

  return {
    estado,
    store,
    authStore,
    router,
    rowsTabla
  };
};
