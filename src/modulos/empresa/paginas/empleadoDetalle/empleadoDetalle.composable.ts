import { useEmpresa } from '~/modulos/empresa/empresa.composable';

export const useEmpleadoDetalle = () => {
  const { store } = useEmpresa();
  const estado = reactive({
    tab: 'persona',
  });

  return {
    estado,
    store,
  };
};
