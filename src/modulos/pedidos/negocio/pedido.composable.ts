export const usePedidos = () => {
  const estado = reactive({
    tab: 'pGlobal' as string,
  });
  return { estado };
};
