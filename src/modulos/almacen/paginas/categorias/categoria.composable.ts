export const useCategoria = () => {
  const estado = ref();

  const buscarCategorias = async () => {
    console.log('first');
  };

  return {
    estado,
    buscarCategorias
  };
};
