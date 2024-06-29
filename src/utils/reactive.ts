export const reactiveData = (v = null, e = null) => {
  return { value: v, error: '' };
};

export const reactiveInput = (v = null as string | null) => {
  return reactive(reactiveData());
};
