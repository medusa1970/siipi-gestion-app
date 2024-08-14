import { useEmpresa } from '~/modulos/empresa/empresa.composable';

export const useTesoreriaDebido = () => {
  const { store, authStore, estadoEmpresa, router } = useEmpresa();
  const estado = reactive({
    filtros: {
      buscar: ''
    },
    pedidosSemanaActual: [],
    pedidosSemanasAnteriores: null,
    semana: {
      inicio: new Date().setDate(new Date().getDate() - new Date().getDay()),
      fin: new Date().setDate(new Date().getDate() - new Date().getDay() + 7)
    }
  });

  const rows1 = computed(() => {
    if (!store.infoPedidos || !store.entidad) return [];
    const filtrado = store.infoPedidos.filter(
      // solo los de esta entidad que ya se han recibido
      p => p.entidad._id === store.entidad._id
      // TODO && [['recibido'].includes(p.estado)] o algo asi
    );
    return filtrado.length > 0 ? filtrado[0].semanaActual : [];
  });

  const rows2 = computed(() => {
    if (!store.infoPedidos || !store.entidad) return [];
    const filtrado = store.infoPedidos.filter(
      p => p.entidad._id === store.entidad._id
    );
    return filtrado.length > 0 ? filtrado[0].semanasAnteriores : [];
  });

  const printSemana1 = () => {
    // ...
  };

  return {
    estado,
    store,
    authStore,
    router,
    rows1,
    rows2,
    printSemana1
  };
};
