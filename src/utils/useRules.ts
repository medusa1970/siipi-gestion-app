/**
 * VALIDACION DE INPUTS DEL FORMULARIO
 */

export const useRules = {
  // campo required
  requerido(val: any): string | true {
    if (val === null || val === '') {
      return 'Campo requerido';
    }
    return true;
  },

  // campo required
  req(msj: string = 'Campo requerido') {
    return (val: any) => {
      if (val === null || val === '') {
        return msj;
      }
      return true;
    };
  },

  // email
  email(msj: string = 'Debe ser un email') {
    return (val: any) => {
      if (!/@/.test(val)) {
        return msj;
      }
      return true;
    };
  },

  // validación de contraseña
  password(val: any): string | true {
    if (
      val.length > 0 &&
      !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).*$/.test(val)
    ) {
      return 'La contraseña debe tener por lo menos una minuscula, una maiuscula y un numero.';
    }
    if (val.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }
    return true;
  },

  // validación de numero de telefono
  phone(val: any): string | true {
    if (!val) return 'Telefono es requerido';
    if (val.length != 8) return 'Debe contener 8 caracteres.';
    return true;
  },
};
