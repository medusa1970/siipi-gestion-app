export const ultimo = (array: Array<any>) => {
  return array[array.length - 1];
};

export const primero = (array: Array<any>) => {
  return array[0];
};

export function quitarDuplicados(
  coleccion: Array<any>,
  compare: Function = null,
) {
  if (compare !== null) {
    return coleccion.filter((objeto, index) => {
      for (let i = 0; i < index; i++) {
        if (compare(coleccion[i], objeto) && i < index) {
          return false;
        }
      }
      return true;
    });
  } else {
    return coleccion.filter((v, i) => coleccion.indexOf(v) === i);
  }
}

export function buscarDuplicados(array: Array<any>) {
  return quitarDuplicados(array.filter((v, i) => array.indexOf(v) !== i));
}

export default { primero, ultimo, buscarDuplicados, quitarDuplicados };
