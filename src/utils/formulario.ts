export const validarInputs = function (...refs: any[]) {
  let esValido = true;
  for (const ref of refs) {
    if (!ref.value?.validate()) esValido = false;
  }
  return esValido;
};

export const resetErrores = function (...errs: any[]) {
  for (const err of errs) {
    err.value = null;
  }
};

// flag must be a ref
export const trigger = function (flag: any) {
  flag.value = !Boolean(flag.value);
};
