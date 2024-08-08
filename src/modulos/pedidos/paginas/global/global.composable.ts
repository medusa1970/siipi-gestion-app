import { storePedido } from '@/modulos/pedidos/pedidos.store';

export const usePedidoGlobal = () => {
  const pedidoStore = storePedido();
  const estado = reactive({
    tabPuntos: 'areaGlobal'
  });

  return {
    estado,
    pedidoStore
  };
};
