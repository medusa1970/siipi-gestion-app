export const reactiveInput = (v = null as string | null) => {
  return reactive({ value: v, error: '' });
};
