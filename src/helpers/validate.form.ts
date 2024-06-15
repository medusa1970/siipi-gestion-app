/**
 * VALIDACION DE INPUTS DEL FORMULARIO
 */

// Define el tipo ValidationRule
type ValidationRule = (val: any) => string | undefined;

// campo required
export function obligatorio(val: any): string | true {
  if (val === null || val === '') {
    return 'Campo requerido';
  }
  return true;
}

// validación de contraseña
export function password(val: any): string | true {
  if (val.length > 0 && !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).*$/.test(val)) {
    return 'La contraseña debe tener por lo menos una minuscula, una maiuscula y un numero.';
  }
  if (val.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres.';
  }
  return true;
}

// validación de numero de telefono
export function phone(val: any): string | true {
  if (!val) return 'Telefono es requerido';
  if (val.length != 8) return 'Debe contener 8 caracteres.';
  return true;
}
export function string(val: any): string | true {
  if (!val) return 'Campo requerido.';
  return true;
}
