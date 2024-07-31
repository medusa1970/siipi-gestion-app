import { useAuthStore } from '~/modulos/main/useAuthStore';
import { storeEmpresa } from '~/modulos/empresa/empresa.store';

export const useEmpleadoPersona = () => {
  const authStore = useAuthStore();
  const store = storeEmpresa();
  const estado = reactive({});

  return {
    store,
    authStore,
    estado,
  };
};
