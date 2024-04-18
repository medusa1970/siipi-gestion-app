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

export const fechaMes = (fecha: any) => {
  // console.log(fecha);
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  // return fechaConvertida.toLocaleDateString('es-ES', {
  //   year: 'numeric',
  //   month: '2-digit',
  //   day: '2-digit',
  // });
};
