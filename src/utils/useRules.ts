export const useRules = {
  numero(mensaje: string = 'Debe ser un numero'): Function {
    const numero = (val: any): String | true => {
      if (val != null && !/^(\d{1,3}(,\d{3})*(\.\d+)?)?$/.test(val)) {
        return mensaje;
      } else {
        return true;
      }
    };
    return numero;
  },

  requerido(mensaje: string = 'Campo requerido'): Function {
    const requerido = (val: any): String | true => {
      if (val == null || val === '') {
        return mensaje;
      } else {
        return true;
      }
    };
    return requerido;
  },

  correo(mensaje: string = 'Email malformado'): Function {
    const correo = (val: string): String | true => {
      if (!/@/.test(val)) {
        return mensaje;
      } else {
        return true;
      }
    };
    return correo;
  },

  telefono(mensaje: string = 'Telefono malformado'): Function {
    const telefono = (val: string): String | true => {
      if (val.length !== 8) {
        return mensaje;
      } else {
        return true;
      }
    };
    return telefono;
  },

  password(val: string): string | true {
    if (
      val.length > 0 &&
      !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).*$/.test(val)
    ) {
      return 'La contraseña debe tener por lo menos una minuscula, una maiuscula y un numero.';
    } else if (val.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    } else {
      return true;
    }
  }
};
