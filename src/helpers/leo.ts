/**
 * extrae el premier valor de un objeto
 */
export function extraer(objeto: { [key: string]: any }) {
  const keys = Object.keys(objeto);
  return objeto[keys[0]];
}

export function ultimo(array: Array<any>) {
  return array[array.length - 1];
}
export function primero(array: Array<any>) {
  return array[0];
}

// inverstigar:
// query GetUser($userId: ID!, $fetchName: Boolean!) {
//   user(id: $userId) {
//     id
//     name @include(if: $fetchName)
//     email @include(if:!$fetchName)
//   }
// }
