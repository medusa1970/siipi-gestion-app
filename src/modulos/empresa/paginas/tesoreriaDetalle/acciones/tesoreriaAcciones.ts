import { useEmpresa } from '~/modulos/empresa/empresa.composable';

export const useTesoreriaAcciones = () => {
  const { store, authStore, estadoEmpresa, router } = useEmpresa();
  const estado = reactive({});

  return {
    estado,
    store,
    authStore,
    router
  };
};
