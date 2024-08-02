import { useEmpresa } from '~/modulos/empresa/empresa.composable';

export const useEmpleadoPersona = () => {
  const { store, authStore, router } = useEmpresa();
  const estado = reactive({});

  return {
    estado,
    store,
    authStore,
    router,
  };
};
