import { useEmpresa } from '~/modulos/empresa/empresa.composable';

export const useEmpleadoCargo = () => {
  const { store, authStore, router } = useEmpresa();
  const estado = reactive({});

  return {
    estado,
    store,
    authStore,
    router,
  };
};