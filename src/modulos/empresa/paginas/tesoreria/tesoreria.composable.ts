import { useEmpresa } from '~/modulos/empresa/empresa.composable';

export const useTesoreria = () => {
  const { store } = useEmpresa();
  const estado = reactive({});

  // Inicializaciones
  onMounted(async () => {});

  return {
    estado,
    store,
  };
};
