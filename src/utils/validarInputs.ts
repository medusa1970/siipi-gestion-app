export default function (...refs: any[]) {
  let esValido = true;
  for (const ref of refs) {
    if (!ref.value?.validate()) esValido = false;
  }
  return esValido;
}
