import { useAuthStore } from '~/modulos/main/useAuthStore';

const hacerConsulta = async (
  consulta: Function,
  params: any,
  tipo: 'buscar' | 'modificar' | 'crear' | 'borrar',
  multiple: boolean,
  tokenAlternativo: any = null
) => {
  const token = tokenAlternativo ?? useAuthStore().token;

  if (!params.opciones) {
    params.opciones = {};
  }

  if (
    !multiple &&
    ['buscar', 'modificar', 'borrar'].includes(tipo) &&
    params.busqueda &&
    typeof params.busqueda === 'string'
  ) {
    params.busqueda = { _id: [params.busqueda] };
  }

  if (
    !multiple &&
    ['buscar', 'modificar', 'borrar'].includes(tipo) &&
    params.opciones?.limit === undefined
  ) {
    Object.assign(params.opciones, { limit: 1 });
  }

  if (
    !multiple &&
    ['buscar', 'modificar', 'borrar'].includes(tipo) &&
    params.opciones?.errorSiVacio === undefined
  ) {
    Object.assign(params.opciones, { errorSiVacio: true });
  }

  if (
    !multiple &&
    ['buscar', 'modificar', 'borrar'].includes(tipo) &&
    params.opciones?.errorSiVacio === undefined
  ) {
    Object.assign(params.opciones, { errorSiVacio: true });
  }

  // if (!multiple && tipo === 'crear' && params.datos) {
  //   params.datos = [params.datos];
  // }

  if (
    ['crear', 'modificar'].includes(tipo) &&
    params.opciones?.populate === undefined
  ) {
    Object.assign(params.opciones, { populate: true });
  }
  let resultado;
  try {
    resultado = await consulta(params, useGqlToken(token));
    if (!resultado) {
      throw 'error resultado null';
    }
  } catch (err) {
    throw formatApiError(err);
  }
  return multiple ? extraer(resultado) : extraerUno(resultado);
};

export const buscarUno = async (consulta, params = {}, token = null) => {
  return hacerConsulta(consulta, params, 'buscar', false, token);
};
export const buscarVarios = async (consulta, params = {}, token = null) => {
  return hacerConsulta(consulta, params, 'buscar', true, token);
};
export const modificarUno = async (consulta, params = {}, token = null) => {
  return hacerConsulta(consulta, params, 'modificar', false, token);
};
export const modificarVarios = async (consulta, params = {}, token = null) => {
  return hacerConsulta(consulta, params, 'modificar', true, token);
};
export const crearUno = async (consulta, params = {}, token = null) => {
  return hacerConsulta(consulta, params, 'crear', false, token);
};
export const crearVarios = async (consulta, params = {}, token = null) => {
  return hacerConsulta(consulta, params, 'crear', true, token);
};
export const borrarUno = async (consulta, params = {}, token = null) => {
  return hacerConsulta(consulta, params, 'borrar', false, token);
};
export const borrarVarios = async (consulta, params = {}, token = null) => {
  return hacerConsulta(consulta, params, 'borrar', true, token);
};
