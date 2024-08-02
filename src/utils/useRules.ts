export const useRules = {
  numero(mensaje: string = "Debe ser un numero intero"): Function {
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
  // numero(mensaje: string = 'Debe ser un numero intero'): Function {
  //   const numero = (val: any): String | true => {
  //     if (!val) return true;
  //     const n = Number(val);
  //     if (Number.isNaN(n) || n !== Math.round(n)) {
  //       return mensaje;
  //     } else {
  //       return true;
  //     }
  //   };
  //   return numero;
  // },
  // decimal2(
  //   mensaje: string = 'Debe ser un numero con 2 decimales max.',
  // ): Function {
  //   const decimal2 = (val: any): String | true => {
  //     if (!val) return true;
  //     const n = Number(val);
  //     if (Number.isNaN(n) || n * 100 !== Math.round(n * 100)) {
  //       return mensaje;
  //     } else {
  //       return true;
  //     }
  //   };
  //   return decimal2;
  // },

  decimal(
    mensaje: string = "Debe ser un numero con 2 decimales max"
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

  requerido(mensaje: string = "Campo requerido"): Function {
    const requerido = (val: any): String | true => {
      if (val == null || val === "") {
        return mensaje;
      } else {
        return true;
      }
    };
    return requerido;
  },

  correo(mensaje: string = "Email malformado"): Function {
    const correo = (val: string): String | true => {
      if (!/@/.test(val)) {
        return mensaje;
      } else {
        return true;
      }
    };
    return correo;
  },

  telefono(mensaje: string = "Telefono malformado"): Function {
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
      return "La contraseña debe tener por lo menos una minuscula, una maiuscula y un numero.";
    } else if (val.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    } else {
      return true;
    }
  },
};
