import { storeEmpresa } from './empresa.store';
import { useAuthStore } from '@/modulos/main/useAuthStore';

export const useEmpresa = () => {
  const router = useRouter();
  const store = storeEmpresa();
  const estado = reactive({});
  const authStore = useAuthStore();

  // exports
  return {
    estado,
    store,
    authStore,
    router,
  };
};
