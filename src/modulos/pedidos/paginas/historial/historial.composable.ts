import { storePedido } from '@/modulos/pedidos/pedidos.store';

export const useHistorial = () => {
  const pedidoStore = storePedido();
  const estado = reactive({
    pedidosFiltrados: [],
    // INPUT DATE
    date: new Date().toLocaleDateString('en-CA').replace(/-/g, '/')
  });

  const filtroHistorial = (date: any) => {
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    estado.pedidosFiltrados = pedidoStore.pedidosRecibidos.filter(
      (pedido: any) => {
        const pedidoDate = new Date(pedido._creado);
        pedidoDate.setHours(0, 0, 0, 0);

        return pedidoDate.getTime() === dateObj.getTime();
      }
    );
  };

  return {
    estado,
    filtroHistorial
  };
};
