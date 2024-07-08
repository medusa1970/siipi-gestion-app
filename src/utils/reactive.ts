export const reactiveData = (v = null as any, e = null as string) => {
  return { value: v, error: e };
};

export const reactiveInput = (v = null as any) => {
  return reactive(reactiveData(v));
};
