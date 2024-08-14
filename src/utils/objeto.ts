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

/**
 * isObjectOrArray, isObject, isKey
 */

export function isKey<T extends object>(x: T, k: PropertyKey): k is keyof T {
  return k in x;
}
export function isObjectOrArray(object) {
  return object != null && typeof object === 'object';
}
export function isArray(object) {
  return object != null && typeof object === 'object' && Array.isArray(object);
}
export function isObject(object) {
  return object != null && typeof object === 'object' && !Array.isArray(object);
}
export function isEmptyObject(obj) {
  if (!isObject(obj)) {
    return false;
  }
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true;
}

/**
 * softObjectAssign
 */
export function softObjectAssign(A, B) {
  if (isObject(B) && isObject(A)) {
    for (const i in B) {
      if (i in A) {
        A[i] = softObjectAssign(A[i], B[i]);
      } else {
        A[i] = B[i];
      }
    }
  } else {
    A = B;
  }
  return A;
}
