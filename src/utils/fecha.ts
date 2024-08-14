export const locale = {
  /* starting with Sunday */
  days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
  daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
  months:
    'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
      '_'
    ),
  monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
  firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
  format24h: true,
  pluralDay: 'dias'
};

export const formateadorFecha = (fecha: any) => {
  const opcionesFechaHora = {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  return new Date(fecha).toLocaleString(
    'es-ES', //@ts-ignore
    opcionesFechaHora
  );
};

export const fechaMes = (fecha: any) =>
  new Date(fecha).toLocaleDateString('es-ES', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
export const fechaHora = (fecha: any) =>
  new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

export const fechaDiaMes = (fecha: any) =>
  new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short'
  });

export const plazo24hrs = (fecha: any) => {
  let fechaPedido = new Date(fecha);
  let fechaActual = new Date();

  //10min
  //@ts-ignore
  // const diferencia = (fechaActual - fechaPedido) / 1000 / 60;
  // return diferencia <= 10;

  //24hrs
  //@ts-ignore
  const diferencia = (fechaActual - fechaPedido) / 1000 / 60 / 60;
  return diferencia <= 24;
};
