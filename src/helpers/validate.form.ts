/**
 * VALIDACION DE INPUTS DEL FORMULARIO
 */
// Define el tipo ValidationRule
type ValidationRule = (val: any) => string | undefined;

export function password(val: any): string | true {
  if (!val) return 'Contraseña es requerida.';
  if (val.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
  if (/\s/.test(val)) return 'No debe contener espacios en blanco';
  return true;
}
export function phone(val: any): string | true {
  if (!val) return 'Telefono es requerido';
  if (val.length != 8) return 'Debe contener 8 caracteres.';
  return true;
}
export function string(val: any): string | true {
  if (!val) return 'Campo requerido.';
  return true;
}
