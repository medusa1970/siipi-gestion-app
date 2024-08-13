import type { Entidad } from '#gql';
import { storeEmpresa } from './empresa.store';
import { useAuthStore } from '@/modulos/main/useAuthStore';

export const useEmpresa = () => {
  const router = useRouter();
  const store = storeEmpresa();
  const estadoEmpresa = reactive({});
  const authStore = useAuthStore();

  const useEntidad2 = async (id): Promise<Entidad> => {
    if (!store.entidad || store.entidad._id !== id) {
      try {
        store.entidad = await api.buscarEntidad_basico(id);
      } catch (err) {
        errFailback(err);
      }
    }
    return store.entidad;
  };

  // exports
  return {
    estadoEmpresa,
    store,
    authStore,
    router,
    useEntidad2
  };
};
