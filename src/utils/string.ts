export const sinAcentos = s =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const sinImportarAcentos = s => ' ' + s + ' ' + sinAcentos(s);
