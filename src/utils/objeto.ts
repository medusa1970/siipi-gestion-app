/**
 * extrae el premier valor de un objeto
 * ejemplo: { uno : { dos: 2, tres: 3 }} => { dos: 2, tres: 3 }
 */
export const extraer = function (objeto: { [key: string]: any }) {
  const keys = Object.keys(objeto);
  return objeto[keys[0]];
};
