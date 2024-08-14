export const validacion = {
  fecha(mensaje: string = 'No es una fecha válida'): Function {
    const fecha = (val: string): String | true => {
      if (val === null) {
        return true;
      }
      const [day, month, year] = val.split('/');
      console.log(`${month}/${day}/${year}`);
      if (val !== null && isNaN(Date.parse(`${month}/${day}/${year}`))) {
        return mensaje;
      } else {
        return true;
      }
    };
    return fecha;
  },

  before(mensaje: Date): Function {
    const before = (val: any): Boolean => {
      return true;
    };
    return before;
  },
  after(mensaje: Date): Function {
    const after = (val: any): Boolean => {
      return true;
    };
    return after;
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

  requeridoCheck(mensaje: any): Function {
    const requeridoCheck = (val: string): String | true => {
      console.log({ val });
      if (val == 'true') {
        return true;
      } else {
        if (typeof mensaje !== 'string') {
          mensaje = 'Check requerido';
        }
        return mensaje;
      }
    };
    return requeridoCheck;
  },

  numero(mensaje: string = 'Debe ser un numero intero'): Function {
    const numero = (val: any): String | true => {
      if (!val) return true;
      if (!/^(\d{1,3}(,?\d{3})*)?$/.test(val)) {
        return mensaje;
      } else {
        return true;
      }
    };
    return numero;
  },

  decimal(
    mensaje: string = 'Debe ser un numero con 2 decimales max'
  ): Function {
    const decimal = (val: any): String | true => {
      if (val != null && !/^(\d{1,3}(,?\d{3})*(\.\d{1,2})?)?$/.test(val)) {
        return mensaje;
      } else {
        return true;
      }
    };
    return decimal;
  },

  maxLength(n: number, mensaje: string = 'max ' + n + ' caracteres'): Function {
    const maxLength = (val: any): String | true => {
      return val.length <= n ? true : mensaje;
    };
    return maxLength;
  },

  minLength(n: number, mensaje: string = 'min ' + n + ' caracteres'): Function {
    const minLength = (val: any): String | true => {
      return val.length >= n ? true : mensaje;
    };
    return minLength;
  }
};
