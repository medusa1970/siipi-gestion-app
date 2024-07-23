const buscar = async (
  consulta: Function,
  token: any,
  multiple: boolean,
  busqueda: any,
  opciones: any,
  filtro: any,
  loading = false,
) => {
  delete opciones.loading;
  if (!multiple) {
    busqueda = typeof busqueda === 'string' ? { _id: [busqueda] } : busqueda;
    if (opciones.limit === undefined) opciones.limit = 1;
    if (opciones.errorSiVacio === undefined) opciones.errorSiVacio = true;
  }
  let resultado;
  try {
    if (loading) {
      await loadingAsync(async () => {
        resultado = await consulta({ busqueda, opciones, filtro }, token);
      });
    } else {
      resultado = await consulta({ busqueda, opciones, filtro }, token);
    }
    if (!resultado) {
      throw 'error resultado null';
    }
  } catch (err) {
    throw formatApiError(err);
  }
  return multiple ? extraer(resultado) : extraerUno(resultado);
};

export const buscarUno = async (
  c,
  t = null,
  b = {},
  o = {},
  f = null,
  l = false,
) => {
  return buscar(c, t, false, b, o, f, l);
};

export const buscarVarios = async (
  c,
  t = null,
  b = {},
  o = {},
  f = null,
  l = false,
) => {
  return buscar(c, t, true, b, o, f, l);
};

const crear = async (
  consulta: Function,
  token: any,
  multiple: boolean,
  datos: any,
  opciones: any,
  loading = false,
) => {
  delete opciones.loading;
  if (opciones.populate === undefined) opciones.populate = true;
  let resultado;
  try {
    if (loading) {
      await loadingAsync(async () => {
        resultado = await consulta({ datos: [datos], opciones }, token);
      });
    } else {
      resultado = await consulta({ datos: [datos], opciones }, token);
    }
    if (!resultado) {
      throw 'error resultado null';
    }
  } catch (err) {
    throw formatApiError(err);
  }
  return multiple ? extraer(resultado) : extraerUno(resultado);
};

export const crearUno = async (c, t, d, o = {}, l = false) =>
  crear(c, t, false, d, o, l);

export const crearVarios = async (c, t, d, o = {}, l = false) =>
  crear(c, t, true, d, o, l);

const modificar = async (
  consulta: Function,
  token: any,
  multiple: boolean,
  busqueda: any,
  datos: any,
  opciones: any,
  loading = false,
) => {
  delete opciones.loading;
  if (!multiple) {
    busqueda = typeof busqueda === 'string' ? { _id: [busqueda] } : busqueda;
    if (opciones.limit === undefined) opciones.limit = 1;
    if (opciones.errorSiVacio === undefined) opciones.errorSiVacio = true;
  }
  if (opciones.populate === undefined) opciones.populate = true;
  let resultado;
  try {
    if (loading) {
      await loadingAsync(async () => {
        resultado = await consulta({ busqueda, datos, opciones }, token);
      });
    } else {
      resultado = await consulta({ busqueda, datos, opciones }, token);
    }
    if (!resultado) {
      throw 'error resultado null';
    }
  } catch (err) {
    throw formatApiError(err);
  }
  return multiple ? extraer(resultado) : extraerUno(resultado);
};

export const modificarUno = async (c, t, b, d, o = {}, l = false) =>
  modificar(c, t, false, b, d, o, l);

export const modificarVarios = async (c, t, b, d, o = {}, l = false) =>
  modificar(c, t, true, b, d, o, l);

const borrar = async (
  consulta: Function,
  token = null,
  multiple: boolean,
  busqueda: any,
  opciones: any,
  loading = false,
) => {
  console.log(opciones);
  console.log(busqueda);
  delete opciones.loading;
  if (!multiple) {
    busqueda = typeof busqueda === 'string' ? { _id: [busqueda] } : busqueda;
    if (opciones.limit === undefined) opciones.limit = 1;
    if (opciones.errorSiVacio === undefined) opciones.errorSiVacio = true;
  }
  let resultado;
  try {
    if (loading) {
      await loadingAsync(async () => {
        resultado = await consulta({ busqueda, opciones }, token);
      });
    } else {
      resultado = await consulta({ busqueda, opciones }, token);
    }
    if (!resultado) {
      throw 'error resultado null';
    }
  } catch (err) {
    throw formatApiError(err);
  }
  return multiple ? extraer(resultado) : extraerUno(resultado);
};

export const borrarUno = async (c, t, b, o = {}, l = false) =>
  borrar(c, t, false, b, o, l);

export const borrarVarios = async (c, t, b, o = {}, l = false) =>
  borrar(c, t, true, b, o, l);
