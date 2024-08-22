import { storePedido } from '@/modulos/pedidos/pedidos.store';
import { apiPedido } from '../../API/pedidos.api';
import { useAuthStore } from '~/modulos/main/useAuthStore';
import { useQuasar } from 'quasar';

export const useGlobal = () => {
  const $q = useQuasar();
  const authStore = useAuthStore();
  const pedidoStore = storePedido();
  const estado = reactive({
    tabPuntos: 'areaGlobal',
    stocks: [],
    pedidoPuntos: [
      {
        nombre: '',
        cantidad: '',
        ruta: '',
        orden: ''
      }
    ],
    modal: {
      isShowPedidos: false
    },
    comentario: ''
  });
  // console.log(pedidoStore.pedidosSinAceptar);
  const aceptarTodosLosPedidosSolicitables = async () => {
    const pedidosIDS = pedidoStore.pedidosSinAceptar.map(
      (pedido: any) => pedido._id
    );
    // const ofertasAceptadas = await pedidoService.aceptarOfertasSolicitables(
    //   pedidosIDS
    // );
    const ofertasAceptadas = await apiPedido.pedido_aceptarOfertas(
      pedidosIDS,
      'solicitable',
      authStore.token
    );

    const result = ofertasAceptadas.reduce((acumulador: any, pedido: any) => {
      pedido.items.forEach((item: any) => {
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

    pedidoStore.pedidosSolicitado = result.map((pedido: any) => {
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

    // pedidoStore.pedidosSolicitado = result.map((pedido: any) => {
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
    // console.log(pedidoStore.pedidosSolicitado);
    NotifySucessCenter('Pedidos de solicitud aceptados');
    // buscarPedidos2();
  };

  const aceptarTodosLosPedidosDirectos = async () => {
    const pedidosIDS = pedidoStore.pedidosSinAceptar.map(
      (pedido: any) => pedido._id
    );
    const ofertasAceptadas = await apiPedido.pedido_aceptarOfertas(
      pedidosIDS,
      'directo',
      authStore.token
    );
    // const res = [
    //   {
    //     _id: '66b7d1ac7a34aac0dae428f3',

    //     estado: [{ estado: 'iniciado' }],

    //     comprador: {
    //       _id: '65a1a96453602a2180052e51',

    //       nombre: 'Irala',

    //       ruta: [1, 1, 1, 1, 2],

    //       orden: [10, 10, 10, 10, 10]
    //     },

    //     items: [
    //       {
    //         _id: '66b7d1ac7a34aac0dae428f6',

    //         cantidad: 12,

    //         oferta: {
    //           _id: '6201c1c8df85a46e2f0b94b8',

    //           nombre: 'Cuñape (unidad)',

    //           ingredientes: [
    //             {
    //               tipo: 'SIMPLE',

    //               producto: {
    //                 _id: '661ec1bddf85a46e2f0b90d0',
    //                 nombre: 'Cuñape'
    //               },

    //               cantidad: 1
    //             }
    //           ]
    //         },

    //         estado: [
    //           { estado: 'aceptado', _creado: '2024-08-10T20:46:36.491Z' }
    //         ]
    //       },

    //       {
    //         _id: '66b7d1ac7a34aac0dae428f9',

    //         cantidad: 10,

    //         oferta: {
    //           _id: '6201c1c8df85a46e2f0b94c9',

    //           nombre: 'Empanada de queso (unidad)',

    //           ingredientes: [
    //             {
    //               tipo: 'SIMPLE',

    //               producto: {
    //                 _id: '661ec1bddf85a46e2f0b90e1',

    //                 nombre: 'Empanada de queso'
    //               },

    //               cantidad: 1
    //             }
    //           ]
    //         },

    //         estado: [
    //           { estado: 'confirmado', _creado: '2024-08-10T20:46:36.491Z' }
    //         ]
    //       }
    //     ]
    //   }
    // ];

    const result = ofertasAceptadas.reduce((acumulador: any, pedido: any) => {
      pedido.items.forEach((item: any) => {
        // console.log(item);
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
    // console.log(result);

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
    NotifySucessCenter('Pedidos de directos aceptados');
    // buscarPedidos2();
  };

  const verPedidoPuntos = (row: any) => {
    // console.log(row.entidad);
    estado.modal.isShowPedidos = true;
    estado.pedidoPuntos = row.entidad.map((pedido: any) => {
      const diaDeLaSemana = new Date().getDay();
      const indice = diaDeLaSemana === 0 ? 6 : diaDeLaSemana - 1;
      return {
        ...pedido,
        ruta: pedido.ruta[indice],
        orden: pedido.orden[indice]
      };
    });
    // console.log(estado.pedidoPuntos);

    // ORDEN
    estado.pedidoPuntos.sort((a: any, b: any) => {
      if (a.ruta === b.ruta) {
        return a.orden - b.orden;
      }
      return a.ruta - b.ruta;
    });

    // console.log(estado.pedidoPuntos);
  };

  const ofertaPreparado = async (fila: any) => {
    const ofertasPreparadas = await apiPedido.pedido_prepararOfertas(
      fila.pedidoIDS,
      [fila.oferta._id],
      authStore.token
    );

    if (ofertasPreparadas) NotifySucessCenter('Oferta preparada exitosamente');

    let ofertaP = ofertasPreparadas
      .flatMap(oferta => oferta.items)
      .find(item => item.oferta._id === fila.oferta._id);

    pedidoStore.pedidosSolicitado.forEach(pedido => {
      if (pedido.oferta._id == ofertaP.oferta._id) {
        pedido.estado = ofertaP.estado;
      }
    });
    pedidoStore.pedidosDirecto.forEach(pedido => {
      if (pedido.oferta._id == ofertaP.oferta._id) {
        pedido.estado = ofertaP.estado;
      }
    });
  };

  const ajustarOferta = async (fila: any) => {
    // console.log('first');
    // console.log(fila);
    let diferencia = fila.cantidad - fila.stockEntidad;
    // console.log(diferencia);
    // const res = await pedidoService.pedidosOfertaAjustar(fila.pedidoIDS, fila.oferta._id, )
    $q.dialog({
      title: `<strong>Ajustar ${fila.oferta.nombre}</strong>`,
      message: `Ingrese un comentario por la cual esta ajustando automaticamente esta oferta`,
      cancel: true,
      persistent: true,
      html: true,
      prompt: {
        model: estado.comentario,
        type: 'text',
        clearable: true,
        // native attributes:
        step: 2,
        label: 'Ingrese un comentario',
        dense: true
      }
    }).onOk(async () => {
      const ofertasAjustadas = await apiPedido.pedido_ajustarOfertas(
        fila.pedidoIDS,
        fila.oferta._id,
        estado.comentario,
        diferencia
      );
      // console.log(pedidoStore.pedidosDirecto);
      // console.log(pedidoStore.pedidosSolicitado);

      if (ofertasAjustadas) {
        let item = ofertasAjustadas[0].items[0];
        // SOLICITUD
        ofertasAjustadas.map((pedido: any) => {
          pedidoStore.pedidosSolicitado.forEach(pedidoSolicitud => {
            // Verificar si el ID del pedido coincide
            if (pedidoSolicitud.pedidoIDS.includes(pedido._id)) {
              pedido.items.forEach((item: any) => {
                // Verificar si la oferta en el pedido coincide con la oferta en pedidoStore.pedidosDirecto
                if (item.oferta._id === pedidoSolicitud.oferta._id) {
                  // Actualizar la cantidad en la entidad correspondiente
                  pedidoSolicitud.entidad.forEach((entidad: any) => {
                    if (entidad.nombre === pedido.comprador.nombre) {
                      entidad.cantidad = item.cantidad;
                    }
                  });
                }
              });
              pedidoSolicitud.cantidad = pedidoSolicitud.entidad.reduce(
                (accumulator: any, current: any) =>
                  accumulator + current.cantidad,
                0
              );
            }
          });
        });
        pedidoStore.pedidosSolicitado.forEach(pedido => {
          if (pedido.oferta._id == item.oferta._id) {
            pedido.estado = item.estado;
          }
        });

        // DIRECTOS
        ofertasAjustadas.map((pedido: any) => {
          pedidoStore.pedidosDirecto.forEach(pedidoDirecto => {
            // Verificar si el ID del pedido coincide
            if (pedidoDirecto.pedidoIDS.includes(pedido._id)) {
              pedido.items.forEach((item: any) => {
                // Verificar si la oferta en el pedido coincide con la oferta en pedidoStore.pedidosDirecto
                if (item.oferta._id === pedidoDirecto.oferta._id) {
                  // Actualizar la cantidad en la entidad correspondiente
                  pedidoDirecto.entidad.forEach((entidad: any) => {
                    if (entidad.nombre === pedido.comprador.nombre) {
                      entidad.cantidad = item.cantidad;
                    }
                  });
                }
              });
              pedidoDirecto.cantidad = pedidoDirecto.entidad.reduce(
                (accumulator: any, current: any) =>
                  accumulator + current.cantidad,
                0
              );
            }
          });
        });
        pedidoStore.pedidosDirecto.forEach(pedido => {
          if (pedido.oferta._id == item.oferta._id) {
            pedido.estado = item.estado;
          }
        });

        NotifySucessCenter('Oferta ajustado correctamente');
      }
    });
  };

  onMounted(async () => {
    // const almacen = await stockService.obtenerTodoStock(
    //   useAuth.negocioElegido._id
    // );
    const { almacen } = await api.buscarEntidad_almacen(
      authStore.getNegocio._id
    );

    // console.log(entidadBuscar);
    estado.stocks = almacen.map((stock: any) => {
      const cantidadTotal = stock.lotes.reduce(
        (total: any, lote: any) => total + lote.cantidad,
        0
      );

      return {
        nombreProducto: stock.producto.nombre,
        foto: 'https://i.pinimg.com/564x/8d/1e/29/8d1e29fb76056c385d2d75117268c57d.jpg',
        producto: stock.producto,
        presentaciones: stock.producto.presentaciones,
        lotes: stock.lotes,
        cantidad: cantidadTotal
      };
    });

    pedidoStore.pedidosSolicitado = pedidoStore.pedidosSolicitado.map(
      (pedido: any) => {
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
      }
    );
    pedidoStore.pedidosDirecto = pedidoStore.pedidosDirecto.map(
      (pedido: any) => {
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
      }
    );
  });

  return {
    estado,
    aceptarTodosLosPedidosSolicitables,
    aceptarTodosLosPedidosDirectos,
    verPedidoPuntos,
    ofertaPreparado,
    ajustarOferta
  };
};
