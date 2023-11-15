/**
 * VALIDACION DE INPUTS DEL FORMULARIO
 */

export function password(val: any) {
  if (!val) return 'Password is required.';
  if (val.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
  if (/\s/.test(val)) return 'No debe contener espacios en blanco';
}
export function phone(val: any) {
  if (!val) return 'Phone is required';
  if (val.length != 8) return 'Debe contener 8 caracteres.';
}
export function string(val: any) {
  if (!val) return 'Campo requerido.';
  // if (val.length > 50) return "Demasiado laaargo.";
}
