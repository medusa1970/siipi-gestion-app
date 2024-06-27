export const reactiveInput = (v = null as string | null) => {
  return reactive({ valor: v, error: '' });
};
