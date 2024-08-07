/**
 * extrae el premier valor de un objeto
 * ejemplo: { uno : { dos: 2, tres: 3 }} => { dos: 2, tres: 3 }
 */
export const extraer = function (objeto: { [key: string]: any }) {
  const keys = Object.keys(objeto);
  return objeto[keys[0]];
};
export const extraerUno = function (objeto: { [key: string]: any }) {
  const res = extraer(objeto);
  return Array.isArray(res) ? res[0] : res;
};
export const clone = function (objeto: any) {
  return JSON.parse(JSON.stringify(objeto)) as typeof objeto;
};
