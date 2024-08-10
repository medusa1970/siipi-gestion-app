import { storePedido } from '@/modulos/pedidos/pedidos.store';
import { apiPedido } from '../../API/pedidos.api';
import { useAuthStore } from '~/modulos/main/useAuthStore';

export const useGlobal = () => {
  const authStore = useAuthStore();
  const pedidoStore = storePedido();
  const estado = reactive({
    tabPuntos: 'areaGlobal'
  });
  console.log(pedidoStore.pedidosSinAceptar);
  const aceptarTodosLosPedidosSolicitables = async () => {
    // console.log('first');
    const pedidosIDS = pedidoStore.pedidosSinAceptar.map(
      (pedido: any) => pedido._id
    );
    console.log(pedidosIDS);
    // const ofertasAceptadas = await pedidoService.aceptarOfertasSolicitables(
    //   pedidosIDS
    // );
    const ofertasAceptadas = await apiPedido.pedido_aceptarOfertas(
      pedidosIDS,
      'solicitable',
      authStore.token
    );
    console.log(ofertasAceptadas);

    const result = ofertasAceptadas.reduce((acumulador: any, pedido: any) => {
      pedido.items.forEach((item: any) => {
        console.log(item);
        if (item.estado.some((estado: any) => estado.estado === 'aceptado')) {
          const itemExistente = acumulador.find(
            (itemAcumulador: any) =>
              itemAcumulador.oferta._id === item.oferta._id
          );

          if (itemExistente) {
            itemExistente.cantidad += item.cantidad;
            itemExistente.pedidoIDS.push(pedido._id);
            const compradorExistente = itemExistente.entidad.find(
              (entidad: any) => entidad.nombre === pedido.comprador.nombre
            );
            if (compradorExistente) {
              compradorExistente.cantidad += item.cantidad;
            } else {
              itemExistente.entidad.push({
                nombre: pedido.comprador.nombre,
                cantidad: item.cantidad,
                ruta: pedido.comprador.ruta,
                orden: pedido.comprador.orden
              });
            }
          } else {
            acumulador.push({
              pedidoIDS: [pedido._id],
              estado: pedido.items[0].estado,
              oferta: {
                _id: item.oferta._id,
                nombre: item.oferta.nombre,
                cantidad: item.oferta.ingredientes[0].cantidad
              },
              producto: {
                _id: item.oferta.ingredientes[0].producto._id,
                nombre: item.oferta.ingredientes[0].producto.nombre
              },
              cantidad: item.cantidad,
              entidad: [
                {
                  nombre: pedido.comprador.nombre,
                  cantidad: item.cantidad,
                  ruta: pedido.comprador.ruta,
                  orden: pedido.comprador.orden
                }
              ]
            });
          }
        }
      });
      return acumulador;
    }, []);
    console.log(result);

    // console.log(result); descomentar
    // storePedido.pedidosSolicitado = result.map((pedido: any) => {
    //   const stock = estado.stocks.find(
    //     //@ts-ignore
    //     (stock: any) => stock.producto._id === pedido.producto._id
    //   );
    //   // console.log(stock);
    //   return {
    //     ...pedido, //@ts-ignore
    //     stockEntidad: stock ? stock.cantidad : 0, //@ts-ignore
    //     presentacionBasica: stock ? stock.producto.presentacionBasica : ''
    //   };
    // });
    // console.log(storePedido.pedidosSolicitado);
    NotifySucessCenter('Pedidos de solicitud aceptados');
    // buscarPedidos2();
  };

  const aceptarTodosLosPedidosDirectos = async () => {
    const pedidosIDS = pedidoStore.pedidosSinAceptar.map(
      (pedido: any) => pedido._id
    );
    // console.log(pedidosIDS);
    const ofertasAceptadas = await apiPedido.pedido_aceptarOfertas(
      pedidosIDS,
      'directo',
      authStore.token
    );
    console.log(ofertasAceptadas);

    const result = ofertasAceptadas.reduce((acumulador: any, pedido: any) => {
      pedido.items.forEach((item: any) => {
        console.log(item);
        if (item.estado.some((estado: any) => estado.estado === 'aceptado')) {
          const itemExistente = acumulador.find(
            (itemAcumulador: any) =>
              itemAcumulador.oferta._id === item.oferta._id
          );
          console.log(itemExistente);

          if (itemExistente) {
            itemExistente.cantidad += item.cantidad;
            itemExistente.pedidoIDS.push(pedido._id);
            const compradorExistente = itemExistente.entidad.find(
              (entidad: any) => entidad.nombre === pedido.comprador.nombre
            );
            if (compradorExistente) {
              compradorExistente.cantidad += item.cantidad;
            } else {
              itemExistente.entidad.push({
                nombre: pedido.comprador.nombre,
                cantidad: item.cantidad,
                ruta: pedido.comprador.ruta,
                orden: pedido.comprador.orden
              });
            }
          } else {
            acumulador.push({
              pedidoIDS: [pedido._id],
              estado: pedido.items[0].estado,
              oferta: {
                _id: item.oferta._id,
                nombre: item.oferta.nombre,
                cantidad: item.oferta.ingredientes[0].cantidad
              },
              producto: {
                _id: item.oferta.ingredientes[0].producto._id,
                nombre: item.oferta.ingredientes[0].producto.nombre
              },
              cantidad: item.cantidad,
              entidad: [
                {
                  nombre: pedido.comprador.nombre,
                  cantidad: item.cantidad,
                  ruta: pedido.comprador.ruta,
                  orden: pedido.comprador.orden
                }
              ]
            });
          }
        }
      });
      return acumulador;
    }, []);
    console.log(result);

    // console.log(result);
    // storePedido.pedidosDirecto = result.map((pedido: any) => {
    //   const stock = estado.stocks.find(
    //     //@ts-ignore
    //     (stock: any) => stock.producto._id === pedido.producto._id,
    //   );
    //   // console.log(stock);

    //   return {
    //     ...pedido, //@ts-ignore
    //     stockEntidad: stock ? stock.cantidad : 0, //@ts-ignore
    //     presentacionBasica: stock ? stock.producto.presentacionBasica : '',
    //   };
    // });
    // console.log(storePedido.pedidosDirecto);
    NotifySucessCenter('Pedidos de directos aceptados');
    // buscarPedidos2();
  };

  return {
    estado,
    aceptarTodosLosPedidosSolicitables,
    aceptarTodosLosPedidosDirectos
  };
};
