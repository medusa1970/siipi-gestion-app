import { useEmpresa } from '~/modulos/empresa/empresa.composable';

export const useTesoreriaDebido = () => {
  const { store, authStore, estadoEmpresa, router } = useEmpresa();
  const estado = reactive({
    filtros: {
      buscar: ''
    },
    pedidosSemanaActual: [],
    pedidosSemanasAnteriores: null
  });

  const rows1 = computed(() => {
    if (!store.infoPedidos || !store.entidad) return [];
    const filtrado = store.infoPedidos.filter(
      p => p.entidad._id === store.entidad._id
    );
    return filtrado.length > 0 ? filtrado[0].semanaActual : [];
  });

  const footer1 = computed(() => {
    if (!store.infoPedidos || !store.entidad) return [];
    const filtrado = store.infoPedidos.filter(
      p => p.entidad._id === store.entidad._id
    );
    return filtrado.length > 0
      ? [
          null,
          null,
          'TOTAL',
          filtrado[0].semanaActual.reduce((total, pedido) => total + 1000, 0)
        ]
      : [];
  });

  const rows2 = computed(() => {
    if (!store.infoPedidos || !store.entidad) return [];
    const filtrado = store.infoPedidos.filter(
      p => p.entidad._id === store.entidad._id
    );
    return filtrado.length > 0 ? filtrado[0].semanasAnteriores : [];
  });

  const footer2 = computed(() => {
    if (!store.infoPedidos || !store.entidad) return [];
    const filtrado = store.infoPedidos.filter(
      p => p.entidad._id === store.entidad._id
    );
    return filtrado.length > 0
      ? [
          null,
          null,
          'TOTAL',
          filtrado[0].semanasAnteriores.reduce(
            (total, pedido) => total + 1000,
            0
          )
        ]
      : [];
  });

  return {
    estado,
    store,
    authStore,
    router,
    rows1,
    rows2,
    footer1,
    footer2
  };
};
