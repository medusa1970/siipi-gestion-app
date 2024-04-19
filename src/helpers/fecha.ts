export const formateadorFecha = (fecha: any) => {
  const opcionesFechaHora = {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  return new Date(fecha).toLocaleString(
    'es-ES', //@ts-ignore
    opcionesFechaHora,
  );
};

export const fechaMes = (fecha: any) =>
  new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

export const fechaDiaMes = (fecha: any) =>
  new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });
