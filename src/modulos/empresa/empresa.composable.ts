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
        store.entidad = await buscarUno(GqlBuscarEntidades_basico, {
          busqueda: id
        });
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
