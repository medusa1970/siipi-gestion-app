export const formateadorFecha = (fecha: any) => {
  // console.log(fecha);
  const fechaConvertida = new Date(fecha);

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
  return fechaConvertida.toLocaleString(
    'es-ES', //@ts-ignore
    opcionesFechaHora,
  );
  // console.log(fechaHoraFormateada);
  // return fechaHoraFormateada;
};
