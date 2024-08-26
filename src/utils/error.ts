export const errFailback = err => {
  NotifyError('Se produjó un error inesperado.');
  console.log(
    'El error inesperado: ',
    err.mensaje ?? err.gqErrors?.[0].message ?? '(no gql, ver abajo)'
  );
  console.log(err);
};

export const formatApiError = err => {
  return Object.assign(err.gqlErrors?.[0], { isApiError: true });
};

export const isApiError = (err, tipo = null, clave = null) => {
  return (
    err.isApiError &&
    (err.tipo === null || err.tipo === tipo) &&
    (clave === null || err.detalle?.clave === clave)
  );
};
export const isApiInternalError = (err, clave = null) =>
  isApiError(err, 'INTERNAL_ERROR', clave);
export const isApiNotFound = (err, clave = null) =>
  isApiError(err, 'NOT_FOUND', clave);
export const isApiBadRequest = (err, clave = null) =>
  isApiError(err, 'BAD_REQUEST', clave);
export const isApiBadData = (err, clave = null) =>
  isApiError(err, 'BAD_DATA', clave);
export const isApiNoAutorixado = (err, clave = null) =>
  isApiError(err, 'NO_AUTORIZADO', clave);
export const isApiServIndisponible = (err, clave = null) =>
  isApiError(err, 'SERVICIO_INDISPONIBLE', clave);
export const isApiExpirado = (err, clave = null) =>
  isApiError(err, 'EXPIRADO', clave);
