/**
 * Operadores de comparacion
 */
export const OperadorComparacion = ['=', '<', '<=', '>', '>='] as const;
export type OperadorComparacion = (typeof OperadorComparacion)[number];

/**
 * Sensibilidad de la operacion
 */

export const Sensibilidad = ['Y', 'M', 'D', 'H', 'm', 's', 'ms'] as const;
export type Sensibilidad = (typeof Sensibilidad)[number];

/**
 * modifica la fecha y pone a 0 todo lo que esta por debajo de la sensibilidad
 * si final esta a false, pone todo al final del periodo en vez de poner a 0
 */

export const aplicarMascara = (
  date: Date | string,
  sensibilidad: Sensibilidad,
  final: boolean = false,
) => {
  date = new Date(date);
  if (['Y', 'M', 'D', 'h', 'm', 's'].includes(sensibilidad)) {
    date.setSeconds(date.getSeconds(), final ? 999 : 0);
  }
  if (['Y', 'M', 'D', 'h', 'm'].includes(sensibilidad)) {
    date.setSeconds(final ? 59 : 0);
  }
  if (['Y', 'M', 'D', 'h'].includes(sensibilidad)) {
    date.setMinutes(final ? 59 : 0);
  }
  if (['Y', 'M', 'D'].includes(sensibilidad)) {
    date.setHours(final ? 23 : 0);
  }
  if (['Y', 'M'].includes(sensibilidad)) {
    // TODO Caso año bisextil
    const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    date.setDate(final ? months[date.getMonth()] : 1);
  }
  if (['Y'].includes(sensibilidad)) {
    date.setMonth(final ? 11 : 0);
  }
  return date;
};

/**
 * Compara dos fechas
 */

export function compararFechas(
  fecha1: Date | string,
  fecha2: Date | string,
  operador: OperadorComparacion,
  sensibilidad: Sensibilidad = 'ms',
): boolean {
  const f1 = aplicarMascara(fecha1, sensibilidad);
  const f2 = aplicarMascara(fecha2, sensibilidad);
  switch (operador) {
    case '=':
      return f1 <= f2 && f1 >= f2; // TODO equalidad
    case '<':
      return f1 < f2;
    case '<=':
      return f1 <= f2;
    case '>':
      return f1 > f2;
    case '>=':
      return f1 >= f2;
  }
}

export const factor = (sensibilidad) => {
  switch (sensibilidad) {
    case 'Y':
      return 365 * 24 * 60 * 60 * 1000;
    case 'D':
      return 24 * 60 * 60 * 1000;
    case 'H':
      return 60 * 60 * 1000;
    case 'm':
      return 60 * 1000;
    case 's':
      return 1000;
    case 'ms':
      return 1;
  }
};

export function diferenciaFechas(
  fecha1: Date | string,
  fecha2: Date | string = new Date(),
  sensibilidad: Sensibilidad = 'D',
): Number {
  return (
    (new Date(fecha2).getTime() - new Date(fecha1).getTime()) /
    factor(sensibilidad)
  );
}
