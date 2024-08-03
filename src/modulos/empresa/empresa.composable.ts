import { storeEmpresa } from "./empresa.store";
import { useAuthStore } from "@/modulos/main/useAuthStore";

export const useEmpresa = () => {
  const router = useRouter();
  const store = storeEmpresa();
  const estadoEmpresa = reactive({});
  const authStore = useAuthStore();

  // exports
  return {
    estadoEmpresa,
    store,
    authStore,
    router,
  };
};
