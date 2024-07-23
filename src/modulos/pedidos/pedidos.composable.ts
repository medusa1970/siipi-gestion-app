import { storePedido } from './pedidos.store';
import localforage from 'localforage';
import type {} from '#gql';

export const usePedidos = () => {
  const store = storePedido();
  const estado = reactive({});

  const ofertaAbreviacion = (nombre: string): string => {
    return nombre.substring(0, 15) + '...';
  };

  // exports
  return {
    estado,
    store,
    ofertaAbreviacion,
  };
};
