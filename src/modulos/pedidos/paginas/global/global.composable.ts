import { storePedido } from '@/modulos/pedidos/pedidos.store';
import { apiPedido } from '../../API/pedidos.api';
import { useAuthStore } from '~/modulos/main/useAuthStore';

export const useGlobal = () => {
  const authStore = useAuthStore();
  const pedidoStore = storePedido();
  const estado = reactive({
    tabPuntos: 'areaGlobal',
    stocks: []
  });
  // console.log(pedidoStore.pedidosSinAceptar);
  const aceptarTodosLosPedidosSolicitables = async () => {
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
    console.log(pedidosIDS);
    // const ofertasAceptadas = await apiPedido.pedido_aceptarOfertas(
    //   pedidosIDS,
    //   'directo',
    //   authStore.token
    // );
    // console.log(ofertasAceptadas);
    const res = [
      {
        _id: '66b7d1ac7a34aac0dae428f3',

        estado: [{ estado: 'iniciado' }],

        comprador: {
          _id: '65a1a96453602a2180052e51',

          nombre: 'Irala',

          ruta: [1, 1, 1, 1, 2],

          orden: [10, 10, 10, 10, 10]
        },

        items: [
          {
            _id: '66b7d1ac7a34aac0dae428f6',

            cantidad: 12,

            oferta: {
              _id: '6201c1c8df85a46e2f0b94b8',

              nombre: 'Cuñape (unidad)',

              ingredientes: [
                {
                  tipo: 'SIMPLE',

                  producto: {
                    _id: '661ec1bddf85a46e2f0b90d0',
                    nombre: 'Cuñape'
                  },

                  cantidad: 1
                }
              ]
            },

            estado: [
              { estado: 'aceptado', _creado: '2024-08-10T20:46:36.491Z' }
            ]
          },

          {
            _id: '66b7d1ac7a34aac0dae428f9',

            cantidad: 10,

            oferta: {
              _id: '6201c1c8df85a46e2f0b94c9',

              nombre: 'Empanada de queso (unidad)',

              ingredientes: [
                {
                  tipo: 'SIMPLE',

                  producto: {
                    _id: '661ec1bddf85a46e2f0b90e1',

                    nombre: 'Empanada de queso'
                  },

                  cantidad: 1
                }
              ]
            },

            estado: [
              { estado: 'confirmado', _creado: '2024-08-10T20:46:36.491Z' }
            ]
          }
        ]
      }
    ];

    const result = res.reduce((acumulador: any, pedido: any) => {
      pedido.items.forEach((item: any) => {
        console.log(item);
        if (item.estado.some((estado: any) => estado.estado === 'aceptado')) {
          console.log('first');
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
    pedidoStore.pedidosDirecto = result.map((pedido: any) => {
      const stock = estado.stocks.find(
        //@ts-ignore
        (stock: any) => stock.producto._id === pedido.producto._id
      );
      // console.log(stock);

      return {
        ...pedido, //@ts-ignore
        stockEntidad: stock ? stock.cantidad : 0, //@ts-ignore
        presentacionBasica: stock ? stock.producto.presentacionBasica : ''
      };
    });
    console.log(pedidoStore.pedidosDirecto);
    NotifySucessCenter('Pedidos de directos aceptados');
    // buscarPedidos2();
  };

  onMounted(async () => {
    // const almacen = await stockService.obtenerTodoStock(
    //   useAuth.negocioElegido._id
    // );
    // // console.log(entidadBuscar);
    // estado.stocks = almacen.map((stock: any) => {
    //   const cantidadTotal = stock.lotes.reduce(
    //     (total: any, lote: any) => total + lote.cantidad,
    //     0
    //   );
    //   return {
    //     nombreProducto: stock.producto.nombre,
    //     foto: 'https://i.pinimg.com/564x/8d/1e/29/8d1e29fb76056c385d2d75117268c57d.jpg',
    //     producto: stock.producto,
    //     presentaciones: stock.producto.presentaciones,
    //     lotes: stock.lotes,
    //     cantidad: cantidadTotal
    //   };
    // });
    // // console.log(estado.stocks);
    // pedidoStore.pedidosSolicitado = pedidoStore.pedidosSolicitado.map(
    //   (pedido: any) => {
    //     const stock = estado.stocks.find(
    //       //@ts-ignore
    //       (stock: any) => stock.producto._id === pedido.producto._id
    //     );
    //     // console.log(stock);
    //     return {
    //       ...pedido, //@ts-ignore
    //       stockEntidad: stock ? stock.cantidad : 0, //@ts-ignore
    //       presentacionBasica: stock ? stock.producto.presentacionBasica : ''
    //     };
    //   }
    // );
    // pedidoStore.pedidosDirecto = pedidoStore.pedidosDirecto.map(
    //   (pedido: any) => {
    //     const stock = estado.stocks.find(
    //       //@ts-ignore
    //       (stock: any) => stock.producto._id === pedido.producto._id
    //     );
    //     // console.log(stock);
    //     return {
    //       ...pedido, //@ts-ignore
    //       stockEntidad: stock ? stock.cantidad : 0, //@ts-ignore
    //       presentacionBasica: stock ? stock.producto.presentacionBasica : ''
    //     };
    //   }
    // );
  });

  return {
    estado,
    aceptarTodosLosPedidosSolicitables,
    aceptarTodosLosPedidosDirectos
  };
};
