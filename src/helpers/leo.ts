/**
 * extrae el premier valor de un objeto
 */
export function extraer(objeto) {
  return objeto[Object.keys(objeto).shift()];
}

export function ultimo(array) {
  return array[array.length - 1];
}
export function primero(array) {
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
