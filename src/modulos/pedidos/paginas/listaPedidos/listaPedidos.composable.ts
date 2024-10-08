import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

import { useAuthStore } from '@/modulos/main/useAuthStore';

/**
 * LOGICA
 */
export const useListaPedidos = () => {
  const authStore = useAuthStore();
  const $q = useQuasar();
  const router = useRouter();
  // const storePedido = pedidoStore();
  const estado = reactive({
    catalogosOfertas: [],
    modal: {
      isAddOferta: false,
      isAjustarItem: false,
      isShowPassword: false,
      isBuscarPorCategoria: false,
      isShowPedidos: false,
      isShowEntidad: false
    },
    isEditCantidad: false,
    pedidosEntidad: [],
    pedidoDetalle: {},
    precioGeneral: 0,
    pedidosAceptados: [],
    pedidosSinAceptar: [],
    pedidosRecibidos: [],
    pedidosFiltrados: [],
    pedidoItemsEstado: '',
    itemPedido: {
      id: '',
      cantidad: 0,
      comentario: ''
    },
    ListaOfertasPedido: [] as any[],
    itemsEstadoAjustado: [] as any[],
    passwordChofer: '',
    pedidoID: '',
    catalogoSeleccionado: [],
    catalogoSeleccionado2: [],
    searchResults: [],
    filter: '',
    PedidosIDS: [],
    stocks: [],
    pedidoPuntos: [
      {
        nombre: '',
        cantidad: '',
        ruta: '',
        orden: ''
      }
    ],
    comentario: '',
    entidadesSinPedidos: [],
    panaderia: [],
    reposteria: [],
    siinple: [],
    envasados: [],
    embotellados: [],
    panaderiaTable: []
  });
  const filter = ref('');

  // const obtenerCatalogosProductos = async () => {
  //   const catalogoArbol = await pedidoService.leerCatalogoConOfertas(
  //     useAuth.negocioElegido._id
  //   );
  //   estado.catalogosOfertas = catalogoArbol.hijas;
  //   estado.catalogoSeleccionado = catalogoArbol.hijas[0];
  //   estado.searchResults = catalogoArbol.hijas[0].hijas;

  //   estado.catalogoSeleccionado2 = catalogoArbol.hijas[0];
  // };

  const buscarPedidos2 = async () => {
    const { buscarPedidos: listaPedidos } = await GqlBuscarPedidos({
      busqueda: { vendedor: [authStore.negocio._id] }
    });
    // console.log(listaPedidos);

    const pedidos = listaPedidos.reduce(
      (accumulator: any, pedido: any) => {
        const allAccepted = pedido.items.every((item: any) =>
          item.estado.some((estado: any) => estado.estado === 'aceptado')
        );

        const hasReceived = pedido.items.some((item: any) =>
          item.estado.some((estado: any) => estado.estado === 'recibido')
        );
        const allConfirmed = pedido.items.some((item: any) =>
          item.estado.some((estado: any) => estado.estado === 'confirmado')
        );

        if (allAccepted && !hasReceived) {
          accumulator.aceptados.push(pedido);
        } else if (allConfirmed && !allAccepted) {
          accumulator.noAceptados.push(pedido);
        }
        if (hasReceived) {
          accumulator.recibidos.push(pedido);
        }

        return accumulator;
      },
      { aceptados: [], noAceptados: [], recibidos: [] }
    );

    estado.pedidosSinAceptar = pedidos.noAceptados;
    estado.pedidosAceptados = pedidos.aceptados;
    estado.pedidosRecibidos = pedidos.recibidos;

    const diaDeLaSemana = new Date().getDay();
    const indice = diaDeLaSemana === 0 ? 6 : diaDeLaSemana - 1;

    estado.panaderia = pedidos.aceptados
      .map((pedido: any) => {
        return {
          ...pedido,
          items: pedido.items.filter(
            (item: any) => item.oferta.panaderia === true
          ),
          comprador: {
            ...pedido.comprador,
            ruta: pedido.comprador.ruta[indice],
            orden: pedido.comprador.orden[indice]
          }
        };
      })
      .sort((a: any, b: any) => {
        if (a.comprador.ruta === b.comprador.ruta) {
          return a.comprador.orden - b.comprador.orden;
        }
        return a.comprador.ruta - b.comprador.ruta;
      });
    // console.log(estado.panaderia);

    estado.reposteria = pedidos.aceptados
      .map((pedido: any) => {
        return {
          ...pedido,
          items: pedido.items.filter(
            (item: any) => item.oferta.reposteria === true
          ),
          comprador: {
            ...pedido.comprador,
            ruta: pedido.comprador.ruta[indice],
            orden: pedido.comprador.orden[indice]
          }
        };
      })
      .sort((a: any, b: any) => {
        if (a.comprador.ruta === b.comprador.ruta) {
          return a.comprador.orden - b.comprador.orden;
        }
        return a.comprador.ruta - b.comprador.ruta;
      });
    estado.envasados = pedidos.aceptados
      .map((pedido: any) => {
        return {
          ...pedido,
          items: pedido.items.filter(
            (item: any) => item.oferta.envasados === true
          ),
          comprador: {
            ...pedido.comprador,
            ruta: pedido.comprador.ruta[indice],
            orden: pedido.comprador.orden[indice]
          }
        };
      })
      .sort((a: any, b: any) => {
        if (a.comprador.ruta === b.comprador.ruta) {
          return a.comprador.orden - b.comprador.orden;
        }
        return a.comprador.ruta - b.comprador.ruta;
      });
    estado.embotellados = pedidos.aceptados
      .map((pedido: any) => {
        return {
          ...pedido,
          items: pedido.items.filter(
            (item: any) => item.oferta.embotellados === true
          ),
          comprador: {
            ...pedido.comprador,
            ruta: pedido.comprador.ruta[indice],
            orden: pedido.comprador.orden[indice]
          }
        };
      })
      .sort((a: any, b: any) => {
        if (a.comprador.ruta === b.comprador.ruta) {
          return a.comprador.orden - b.comprador.orden;
        }
        return a.comprador.ruta - b.comprador.ruta;
      });
    estado.siinple = pedidos.aceptados
      .map((pedido: any) => {
        return {
          ...pedido,
          items: pedido.items.filter(
            (item: any) => item.oferta.siinple === true
          ),
          comprador: {
            ...pedido.comprador,
            ruta: pedido.comprador.ruta[indice],
            orden: pedido.comprador.orden[indice]
          }
        };
      })
      .sort((a: any, b: any) => {
        if (a.comprador.ruta === b.comprador.ruta) {
          return a.comprador.orden - b.comprador.orden;
        }
        return a.comprador.ruta - b.comprador.ruta;
      });
  };

  const buscarPedidoID = async (pedidoID: string) => {
    let pedido;
    try {
      pedido = await buscarUno(GqlBuscarPedidos, {
        busqueda: pedidoID
      });
    } catch (err) {
      errFailback(err);
    }

    estado.pedidoDetalle = pedido;
    estado.precioGeneral = pedido.items.reduce((total, item) => {
      //@ts-ignore
      return total + item.oferta.precio * item.cantidad;
    }, 0);

    //@ts-ignore
    estado.pedidoItemsEstado = //@ts-ignore
      pedido.items[0].estado?.[pedido.items[0].estado?.length - 1]; //@ts-ignore
    //@ts-ignore
    const itemsConEstadoAjustado = pedido.items.filter((item: any) => {
      const estadosAjustados = item.estado.filter(
        (estado: any) => estado.estado === 'ajustado'
      );
      return estadosAjustados.length > 0; // Solo retener items con al menos un estado "ajustado"
    });

    // Obtener la información de nombre, estado ajustado, comentario y valor (último estado ajustado)
    estado.itemsEstadoAjustado = itemsConEstadoAjustado.map((item: any) => {
      const estadosAjustados = item.estado.filter(
        (estado: any) => estado.estado === 'ajustado'
      );
      const ultimoEstadoAjustado =
        estadosAjustados[estadosAjustados.length - 1];
      return {
        nombre: item.oferta.nombre,
        estadoAjustado: ultimoEstadoAjustado.estado,
        comentario: ultimoEstadoAjustado.comentario,
        valor: ultimoEstadoAjustado.valor
      };
    });
  };

  const obtenerOfertas = (area: any) => {
    // console.log(area);
    estado.panaderiaTable = [];
    area.forEach((venta: any) => {
      venta.items.forEach((item: any) => {
        const existeOferta = estado.panaderiaTable.some(
          (oferta: any) => oferta._id === item.oferta._id
        );

        if (!existeOferta) {
          //@ts-ignore
          estado.panaderiaTable.push(item.oferta);
        }
      });
    });
    // console.log(estado.panaderiaTable);
  };

  function obtenerCantidad(items: any, ofertaId: any) {
    const item = items.find((item: any) => item.oferta._id === ofertaId);
    return item ? item.cantidad : 0;
  }

  //   // Obtener la información de nombre, estado ajustado, comentario y valor (último estado ajustado)
  //   estado.itemsEstadoAjustado = itemsConEstadoAjustado.map((item: any) => {
  //     const estadosAjustados = item.estado.filter(
  //       (estado: any) => estado.estado === 'ajustado'
  //     );
  //     const ultimoEstadoAjustado =
  //       estadosAjustados[estadosAjustados.length - 1];
  //     return {
  //       nombre: item.oferta.nombre,
  //       estadoAjustado: ultimoEstadoAjustado.estado,
  //       comentario: ultimoEstadoAjustado.comentario,
  //       valor: ultimoEstadoAjustado.valor
  //     };
  //   });

  //   // Mostrar la información
  // };

  // const aceptarTodoPedido = async (pedidoID: string) => {
  //   const pedidoAceptado = await pedidoService.pedidoAceptarItems(pedidoID);
  //   const pedidoPreparado = await pedidoService.pedidoPrepararItems(pedidoID);
  //   if (pedidoAceptado && pedidoPreparado)
  //     NotifySucessCenter('Pedido aceptado y en preparacion');
  //   else NotifyError('Error al aceptar pedido');
  //   buscarPedidos2();
  // };

  // const ajustarItem = async (row: any) => {
  //   // console.log(row);
  //   estado.modal.isAjustarItem = true;
  //   estado.itemPedido.id = row._id;
  //   estado.itemPedido.cantidad = row.cantidad;
  // };
  // const ajustarItemGuardar = async () => {
  //   const pedido = await pedidoService.pedidoAjustarItem(
  //     //@ts-ignore
  //     estado.pedidoDetalle._id,
  //     estado.itemPedido.id,
  //     estado.itemPedido.cantidad,
  //     estado.itemPedido.comentario
  //   );
  //   // console.log(pedido);
  //   if (pedido) {
  //     NotifySucessCenter('Cantidad ajustada'); //@ts-ignore
  //     buscarPedidoID(estado.pedidoDetalle._id);
  //   } else NotifyError('Error al ajustar cantidad');
  //   estado.modal.isAjustarItem = false;
  // };

  // const abrirModalRecibirPedido = (pedidoID: string) => {
  //   estado.modal.isShowPassword = true;
  //   estado.pedidoID = pedidoID;
  // };

  // const recibirPedido = async () => {
  //   // INPUT PASSWORD CHOFER
  //   const password = 'choferSiipi123';

  //   if (estado.passwordChofer == password) {
  //     const pedidoRecibido = await pedidoService.pedidoRecibirItems(
  //       estado.pedidoID
  //     );
  //     // console.log(pedidoRecibido);
  //     if (pedidoRecibido) {
  //       NotifySucessCenter('Pedido recibido');
  //       estado.modal.isShowPassword = false;
  //       estado.passwordChofer = '';
  //       router.push('/punto/pedidos/listaPedidos');
  //     } else NotifyError('Error al recibir pedido');
  //   } else {
  //     NotifyError('Contraseña incorrecta');
  //     estado.modal.isShowPassword = false;
  //     estado.passwordChofer = '';
  //   }
  // };

  // const obtenerListaOfertas = async () => {
  //   const menus = await menuService.listarMenus(useAuth.negocioElegido._id);
  //   // console.log(menus);

  //   const ofertas = await ofertaService.catalogoRecursivo(
  //     menus[0].catalogo._id
  //   );
  //   estado.ListaOfertasPedido = ofertas;
  //   // console.log(estado.ListaOfertasPedido);
  //   // ofertaService.catalogoRecursivo()
  // };

  // const obtenerItemsEstado = async (pedidoID: string) => {
  //   const items = await pedidoService.pedidoItemsEstado(pedidoID);
  //   const itemsConEstadoAjustado = items.filter((item: any) => {
  //     const estadosAjustados = item.estado.filter(
  //       (estado: any) => estado.estado === 'ajustado'
  //     );
  //     return estadosAjustados.length > 0; // Solo retener items con al menos un estado "ajustado"
  //   });
  //   // console.log(itemsConEstadoAjustado);

  //   // Obtener la información de nombre, estado ajustado, comentario y valor (último estado ajustado)
  //   estado.itemsEstadoAjustado = itemsConEstadoAjustado.map((item: any) => {
  //     const estadosAjustados = item.estado.filter(
  //       (estado: any) => estado.estado === 'ajustado'
  //     );
  //     const ultimoEstadoAjustado =
  //       estadosAjustados[estadosAjustados.length - 1];
  //     return {
  //       nombre: item.oferta.nombre,
  //       estadoAjustado: ultimoEstadoAjustado.estado,
  //       comentario: ultimoEstadoAjustado.comentario,
  //       valor: ultimoEstadoAjustado.valor
  //     };
  //   });

  //   // Mostrar la información
  //   // console.log(estado.itemsEstadoAjustado);
  // };

  // let filteredCatalogos = computed(() => {
  //   if (!filter.value) {
  //     return estado.catalogoSeleccionado2;
  //   }
  //   console.log(filter.value);
  //   console.log(estado.catalogoSeleccionado);
  //   const res = {
  //     ...estado.catalogoSeleccionado, //@ts-ignore
  //     hijas: estado.catalogoSeleccionado.hijas
  //       .map((hija: any) => ({
  //         ...hija,
  //         ofertas: hija.ofertas.filter((oferta: any) =>
  //           oferta.nombre.toLowerCase().includes(filter.value.toLowerCase()),
  //         ),
  //       }))
  //       .filter((hija: any) => hija.ofertas.length > 0),
  //   };
  //   console.log(res);

  //   return res;
  // });
  // const searchCatalog = (searchTerm: string) => {
  //   const catalogo = estado.catalogoSeleccionado; //@ts-ignore
  //   if (!catalogo.hijas) {
  //     //@ts-ignore
  //     return catalogo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  //       ? [catalogo]
  //       : [];
  //   }
  //   //@ts-ignore
  //   const results = catalogo.hijas.filter((hija: any) => {
  //     return (
  //       hija.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       hija.ofertas.some((oferta: any) =>
  //         oferta.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  //       )
  //     );
  //   });

  //   return results
  //     .map((hija: any) => {
  //       const filteredOfertas = hija.ofertas.filter((oferta: any) =>
  //         oferta.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  //       );
  //       return { ...hija, ofertas: filteredOfertas };
  //     })
  //     .filter(
  //       (hija: any) =>
  //         hija.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         hija.ofertas.length > 0
  //     );
  // };

  // const aceptarTodosLosPedidosSolicitables = async () => {
  //   // console.log('first');
  //   const pedidosIDS = estado.pedidosSinAceptar.map(
  //     (pedido: any) => pedido._id
  //   );
  //   const ofertasAceptadas = await pedidoService.aceptarOfertasSolicitables(
  //     pedidosIDS
  //   );
  //   // console.log(ofertasAceptadas);

  //   // const res = ofertasAceptadas.map(item => ({
  //   //   comprador: item.comprador,
  //   //   cantidadOferta: item.items.reduce((total, current) => total + current.cantidad, 0)
  //   //  }));
  //   //  console.log(res)

  //   const result = ofertasAceptadas.reduce((acumulador: any, pedido: any) => {
  //     pedido.items.forEach((item: any) => {
  //       // console.log(item);
  //       if (item.estado.some((estado: any) => estado.estado === 'aceptado')) {
  //         const itemExistente = acumulador.find(
  //           (itemAcumulador: any) =>
  //             itemAcumulador.oferta._id === item.oferta._id
  //         );

  //         if (itemExistente) {
  //           itemExistente.cantidad += item.cantidad;
  //           itemExistente.pedidoIDS.push(pedido._id);
  //           const compradorExistente = itemExistente.entidad.find(
  //             (entidad: any) => entidad.nombre === pedido.comprador.nombre
  //           );
  //           if (compradorExistente) {
  //             compradorExistente.cantidad += item.cantidad;
  //           } else {
  //             itemExistente.entidad.push({
  //               nombre: pedido.comprador.nombre,
  //               cantidad: item.cantidad,
  //               ruta: pedido.comprador.ruta,
  //               orden: pedido.comprador.orden
  //             });
  //           }
  //         } else {
  //           acumulador.push({
  //             pedidoIDS: [pedido._id],
  //             estado: pedido.items[0].estado,
  //             oferta: {
  //               _id: item.oferta._id,
  //               nombre: item.oferta.nombre,
  //               cantidad: item.oferta.ingredientes[0].cantidad
  //             },
  //             producto: {
  //               _id: item.oferta.ingredientes[0].producto._id,
  //               nombre: item.oferta.ingredientes[0].producto.nombre
  //             },
  //             cantidad: item.cantidad,
  //             entidad: [
  //               {
  //                 nombre: pedido.comprador.nombre,
  //                 cantidad: item.cantidad,
  //                 ruta: pedido.comprador.ruta,
  //                 orden: pedido.comprador.orden
  //               }
  //             ]
  //           });
  //         }
  //       }
  //     });
  //     return acumulador;
  //   }, []);

  //   // console.log(result);
  //   storePedido.pedidosSolicitado = result.map((pedido: any) => {
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
  //   });
  //   // console.log(storePedido.pedidosSolicitado);
  //   NotifySucessCenter('Pedidos de solicitud aceptados');
  //   buscarPedidos2();
  // };

  // // REVISAR
  // const aceptarTodosLosPedidosDirectos = async () => {
  //   const pedidosIDS = estado.pedidosSinAceptar.map(
  //     (pedido: any) => pedido._id
  //   );
  //   // console.log(pedidosIDS);
  //   const ofertasAceptadas = await pedidoService.aceptarOfertasDirectas(
  //     pedidosIDS
  //   );
  //   // console.log(ofertasAceptadas);

  //   const result = ofertasAceptadas.reduce((acumulador: any, pedido: any) => {
  //     pedido.items.forEach((item: any) => {
  //       // console.log(item);
  //       if (item.estado.some((estado: any) => estado.estado === 'aceptado')) {
  //         const itemExistente = acumulador.find(
  //           (itemAcumulador: any) =>
  //             itemAcumulador.oferta._id === item.oferta._id
  //         );

  //         if (itemExistente) {
  //           itemExistente.cantidad += item.cantidad;
  //           itemExistente.pedidoIDS.push(pedido._id);
  //           const compradorExistente = itemExistente.entidad.find(
  //             (entidad: any) => entidad.nombre === pedido.comprador.nombre
  //           );
  //           if (compradorExistente) {
  //             compradorExistente.cantidad += item.cantidad;
  //           } else {
  //             itemExistente.entidad.push({
  //               nombre: pedido.comprador.nombre,
  //               cantidad: item.cantidad,
  //               ruta: pedido.comprador.ruta,
  //               orden: pedido.comprador.orden
  //             });
  //           }
  //         } else {
  //           acumulador.push({
  //             pedidoIDS: [pedido._id],
  //             estado: pedido.items[0].estado,
  //             oferta: {
  //               _id: item.oferta._id,
  //               nombre: item.oferta.nombre,
  //               cantidad: item.oferta.ingredientes[0].cantidad
  //             },
  //             producto: {
  //               _id: item.oferta.ingredientes[0].producto._id,
  //               nombre: item.oferta.ingredientes[0].producto.nombre
  //             },
  //             cantidad: item.cantidad,
  //             entidad: [
  //               {
  //                 nombre: pedido.comprador.nombre,
  //                 cantidad: item.cantidad,
  //                 ruta: pedido.comprador.ruta,
  //                 orden: pedido.comprador.orden
  //               }
  //             ]
  //           });
  //         }
  //       }
  //     });
  //     return acumulador;
  //   }, []);

  //   // console.log(result);
  //   storePedido.pedidosDirecto = result.map((pedido: any) => {
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
  //   });
  //   // console.log(storePedido.pedidosDirecto);
  //   NotifySucessCenter('Pedidos de directos aceptados');
  //   buscarPedidos2();
  // };

  // const verPedidoPuntos = (row: any) => {
  //   // console.log(row.entidad);
  //   estado.modal.isShowPedidos = true;
  //   estado.pedidoPuntos = row.entidad.map((pedido: any) => {
  //     const diaDeLaSemana = new Date().getDay();
  //     const indice = diaDeLaSemana === 0 ? 6 : diaDeLaSemana - 1;
  //     return {
  //       ...pedido,
  //       ruta: pedido.ruta[indice],
  //       orden: pedido.orden[indice]
  //     };
  //   });
  //   // console.log(estado.pedidoPuntos);

  //   // ORDEN
  //   estado.pedidoPuntos.sort((a: any, b: any) => {
  //     if (a.ruta === b.ruta) {
  //       return a.orden - b.orden;
  //     }
  //     return a.ruta - b.ruta;
  //   });

  //   // console.log(estado.pedidoPuntos);
  // };

  // const ofertaPreparado = async (fila: any) => {
  //   // console.log('first');
  //   // console.log(fila);
  //   const ofertasPreparadas = await pedidoService.pedidosOfertaPreparados(
  //     fila.pedidoIDS,
  //     [fila.oferta._id]
  //   );
  //   // console.log(ofertasPreparadas);

  //   // const test = pedidosPrepararOfertas[0].items[0].estado.some(
  //   //   (estado: any) => estado.estado === 'preparado',
  //   // );
  //   // console.log(test);

  //   if (ofertasPreparadas) NotifySucessCenter('Oferta preparada exitosamente');
  //   // console.log(ofertasPreparadas);
  //   let item = ofertasPreparadas[0].items[0];

  //   storePedido.pedidosSolicitado.forEach(pedido => {
  //     if (pedido.oferta._id == item.oferta._id) {
  //       pedido.estado = item.estado;
  //     }
  //   });
  //   storePedido.pedidosDirecto.forEach(pedido => {
  //     if (pedido.oferta._id == item.oferta._id) {
  //       pedido.estado = item.estado;
  //     }
  //   });
  // };

  // const ajustarOferta = async (fila: any) => {
  //   // console.log('first');
  //   // console.log(fila);
  //   let diferencia = fila.cantidad - fila.stockEntidad;
  //   // console.log(diferencia);
  //   // const res = await pedidoService.pedidosOfertaAjustar(fila.pedidoIDS, fila.oferta._id, )
  //   $q.dialog({
  //     title: `<strong>Ajustar ${fila.oferta.nombre}</strong>`,
  //     message: `Ingrese un comentario por la cual esta ajustando automaticamente esta oferta`,
  //     cancel: true,
  //     persistent: true,
  //     html: true,
  //     prompt: {
  //       model: estado.comentario,
  //       type: 'text',
  //       clearable: true,
  //       // native attributes:
  //       step: 2,
  //       label: 'Ingrese un comentario',
  //       dense: true
  //     }
  //   }).onOk(async () => {
  //     const ofertasAjustadas = await pedidoService.pedidosOfertaAjustar(
  //       fila.pedidoIDS,
  //       fila.oferta._id,
  //       estado.comentario,
  //       diferencia
  //     );
  //     // console.log(ofertasAjustadas);
  //     // console.log(storePedido.pedidosDirecto);
  //     // console.log(storePedido.pedidosSolicitado);

  //     if (ofertasAjustadas) {
  //       let item = ofertasAjustadas[0].items[0];
  //       // SOLICITUD
  //       ofertasAjustadas.map((pedido: any) => {
  //         storePedido.pedidosSolicitado.forEach(pedidoSolicitud => {
  //           // Verificar si el ID del pedido coincide
  //           if (pedidoSolicitud.pedidoIDS.includes(pedido._id)) {
  //             pedido.items.forEach((item: any) => {
  //               // Verificar si la oferta en el pedido coincide con la oferta en storePedido.pedidosDirecto
  //               if (item.oferta._id === pedidoSolicitud.oferta._id) {
  //                 // Actualizar la cantidad en la entidad correspondiente
  //                 pedidoSolicitud.entidad.forEach((entidad: any) => {
  //                   if (entidad.nombre === pedido.comprador.nombre) {
  //                     entidad.cantidad = item.cantidad;
  //                   }
  //                 });
  //               }
  //             });
  //             pedidoSolicitud.cantidad = pedidoSolicitud.entidad.reduce(
  //               (accumulator: any, current: any) =>
  //                 accumulator + current.cantidad,
  //               0
  //             );
  //           }
  //         });
  //       });
  //       storePedido.pedidosSolicitado.forEach(pedido => {
  //         if (pedido.oferta._id == item.oferta._id) {
  //           pedido.estado = item.estado;
  //         }
  //       });

  //       // DIRECTOS
  //       ofertasAjustadas.map((pedido: any) => {
  //         storePedido.pedidosDirecto.forEach(pedidoDirecto => {
  //           // Verificar si el ID del pedido coincide
  //           if (pedidoDirecto.pedidoIDS.includes(pedido._id)) {
  //             pedido.items.forEach((item: any) => {
  //               // Verificar si la oferta en el pedido coincide con la oferta en storePedido.pedidosDirecto
  //               if (item.oferta._id === pedidoDirecto.oferta._id) {
  //                 // Actualizar la cantidad en la entidad correspondiente
  //                 pedidoDirecto.entidad.forEach((entidad: any) => {
  //                   if (entidad.nombre === pedido.comprador.nombre) {
  //                     entidad.cantidad = item.cantidad;
  //                   }
  //                 });
  //               }
  //             });
  //             pedidoDirecto.cantidad = pedidoDirecto.entidad.reduce(
  //               (accumulator: any, current: any) =>
  //                 accumulator + current.cantidad,
  //               0
  //             );
  //           }
  //         });
  //       });
  //       storePedido.pedidosDirecto.forEach(pedido => {
  //         if (pedido.oferta._id == item.oferta._id) {
  //           pedido.estado = item.estado;
  //         }
  //       });

  //       NotifySucessCenter('Oferta ajustado correctamente');
  //     }
  //   });
  // };

  // const handlePedidoGlobal = () => {
  //   storePedido.pedidosSolicitado = storePedido.pedidosSolicitado.map(
  //     (pedido: any) => {
  //       const stock = estado.stocks.find(
  //         //@ts-ignore
  //         (stock: any) => stock.producto._id === pedido.producto._id
  //       );
  //       // console.log(stock);

  //       return {
  //         ...pedido, //@ts-ignore
  //         stockEntidad: stock ? stock.cantidad : 0
  //       };
  //     }
  //   );
  //   storePedido.pedidosDirecto = storePedido.pedidosDirecto.map(
  //     (pedido: any) => {
  //       const stock = estado.stocks.find(
  //         //@ts-ignore
  //         (stock: any) => stock.producto._id === pedido.producto._id
  //       );
  //       // console.log(stock);

  //       return {
  //         ...pedido, //@ts-ignore
  //         stockEntidad: stock ? stock.cantidad : 0
  //       };
  //     }
  //   );
  //   // console.log(storePedido.pedidosSolicitado);
  //   // console.log(storePedido.pedidosDirecto);
  // };

  // const mostrarEntidadSinPedidos = async () => {
  //   estado.modal.isShowEntidad = true;
  //   const listaEntidades = await authService.buscarTodasEntidades();

  //   estado.entidadesSinPedidos = listaEntidades.filter((entidad: any) => {
  //     if (entidad.tipo !== 'PUNTO') return false;
  //     return !estado.pedidosSinAceptar.some(
  //       (pedido: any) => pedido.comprador._id === entidad._id
  //     );
  //   });
  // };
  // const filtroHistorial = (date: any) => {
  //   const dateObj = new Date(date);
  //   dateObj.setHours(0, 0, 0, 0);

  //   estado.pedidosFiltrados = estado.pedidosRecibidos.filter((pedido: any) => {
  //     const pedidoDate = new Date(pedido._creado);
  //     pedidoDate.setHours(0, 0, 0, 0);

  //     return pedidoDate.getTime() === dateObj.getTime();
  //   });
  //   // console.log(estado.pedidosFiltrados);

  //   // console.log(pedidosFiltrados);
  //   // console.log(pedidosFiltrados.length);
  // };

  // const filtroPedidosGlobal = () => {
  //   // console.log('first');
  //   // console.log(storePedido.pedidosSolicitado);
  // };

  onMounted(async () => {
    // const almacen = await stockService.obtenerTodoStock(
    //   useAuth.negocioElegido._id
    // );
    // console.log(entidadBuscar);
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
    // storePedido.pedidosSolicitado = storePedido.pedidosSolicitado.map(
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
    // storePedido.pedidosDirecto = storePedido.pedidosDirecto.map(
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
    authStore,
    estado,

    buscarPedidos2,
    obtenerOfertas,

    filter,
    buscarPedidoID
  };
};
