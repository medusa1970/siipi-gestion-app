import { storeEmpresa } from './empresa.store';

export const useEmpresa = () => {
  const store = storeEmpresa();
  const estado = reactive({});

  // exports
  return {
    estado,
    store,
  };
};
