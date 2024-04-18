import { ref, reactive, onMounted, watch, computed } from 'vue';
import {
  NotifyError,
  NotifySucess,
  NotifySucessCenter,
  hideLoading,
  showLoading,
} from '~/helpers/message.service';
import { useQuasar } from 'quasar';
import { pedidoService } from '@/services/punto/pedido.service';
import { authStore } from '@/stores/auth.store';
// import { format } from 'date-fns';
// import { es } from 'date-fns/locale';
import { useRouter } from 'vue-router';
import { pedidoStore } from '@/stores/pedido.store';
import { menuService } from '~/services/punto/menu.service';
import { ofertaService } from '~/services/marca/ofertas.service';
import { stockService } from '~/services/punto/stock.service';
import { authService } from '~/services/auth.service';
/**
 * LOGICA
 */
export const usePedido = () => {
  const useAuth = authStore();
  const $q = useQuasar();
  const router = useRouter();
  const storePedido = pedidoStore();
  const estado = reactive({
    catalogosOfertas: [],
    modal: {
      isAddOferta: false,
      isAjustarItem: false,
      isShowPassword: false,
      isBuscarPorCategoria: false,
      isShowPedidos: false,
      isShowEntidad: false,
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
      comentario: '',
    },
    ListaOfertasPedido: [] as any[],
    itemsEstadoAjustado: [] as any[],
    passwordChofer: '',
    pedidoID: '',
    catalogoSeleccionado: [],
    catalogoSeleccionado2: [],
    filter: '',
    PedidosIDS: [],
    stocks: [],
    pedidoPuntos: [
      {
        nombre: '',
        cantidad: '',
        ruta: '',
        orden: '',
      },
    ],
    comentario: '',
    entidadesSinPedidos: [],
  });
  const filter = ref('');

  const obtenerCatalogosProductos = async () => {
    const { entidadLeerMenu } = await pedidoService.leerCatalogoConOfertas(
      useAuth.negocioElegido._id,
    ); //@ts-ignore
    console.log(entidadLeerMenu.hijas);
    estado.catalogosOfertas = entidadLeerMenu.hijas;
    estado.catalogoSeleccionado = entidadLeerMenu.hijas[0];
    estado.catalogoSeleccionado2 = entidadLeerMenu.hijas[0];
  };

  const buscarPedidos = async () => {
    showLoading();
    const { pedidoBuscar } = await pedidoService.pedidoBuscar(
      useAuth.negocioElegido._id,
      undefined,
      undefined,
      useGqlToken(useAuth.token),
    );
    console.log(pedidoBuscar);
    //@ts-ignore
    estado.pedidosEntidad = await Promise.all(
      pedidoBuscar.map((pedido) =>
        pedidoService
          .pedidoLeerEstado(pedido._id)
          .then((res) => ({ ...pedido, estadoItems: res.pedidoLeerEstado })),
      ),
    );
    console.log(estado.pedidosEntidad);
    const pedidos = estado.pedidosEntidad.reduce(
      (accumulator: any, pedido: any) => {
        const hasReceived = pedido.items.some((item: any) =>
          item.estado.some((estado: any) => estado.estado === 'recibido'),
        );

        if (hasReceived) {
          accumulator.recibidos.push(pedido);
        } else {
          accumulator.noRecibidos.push(pedido);
        }

        return accumulator;
      },
      { recibidos: [], noRecibidos: [] },
    );
    hideLoading();
    console.log(pedidos.noRecibidos);
    console.log(pedidos.recibidos);
    estado.pedidosRecibidos = pedidos.recibidos;
    estado.pedidosEntidad = pedidos.noRecibidos;

    hideLoading();
  };
  const buscarPedidos2 = async () => {
    console.log('first');
    console.log(useAuth.negocioElegido._id);
    showLoading();
    const { pedidoBuscar } = await pedidoService.pedidoBuscar(
      undefined,
      useAuth.negocioElegido._id,
      undefined,
      useGqlToken(useAuth.token),
    );
    console.log(pedidoBuscar);

    const pedidos = pedidoBuscar.reduce(
      (accumulator: any, pedido: any) => {
        const allAccepted = pedido.items.every((item: any) =>
          item.estado.some((estado: any) => estado.estado === 'aceptado'),
        );

        const hasReceived = pedido.items.some((item: any) =>
          item.estado.some((estado: any) => estado.estado === 'recibido'),
        );
        const allConfirmed = pedido.items.some((item: any) =>
          item.estado.some((estado: any) => estado.estado === 'confirmado'),
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
      { aceptados: [], noAceptados: [], recibidos: [] },
    );
    hideLoading();
    console.log(pedidos.noAceptados);
    console.log(pedidos.aceptados);
    console.log(pedidos.recibidos);

    estado.pedidosSinAceptar = pedidos.noAceptados;
    estado.pedidosAceptados = pedidos.aceptados;
    estado.pedidosRecibidos = pedidos.recibidos;
    console.log(estado.pedidosRecibidos);
  };

  const buscarPedidoID = async (id: string) => {
    const { pedidoBuscar } = await pedidoService.pedidoBuscar(
      undefined,
      undefined,
      id,
      useGqlToken(useAuth.token),
    );
    console.log(pedidoBuscar);
    estado.pedidoDetalle = pedidoBuscar[0]; //@ts-ignore
    estado.precioGeneral = pedidoBuscar[0].items.reduce((total, item) => {
      //@ts-ignore
      return total + item.oferta.precio * item.cantidad;
    }, 0);
    console.log(estado.precioGeneral);

    const { pedidoLeerEstado } = await pedidoService.pedidoLeerEstado(id);
    estado.pedidoItemsEstado = pedidoLeerEstado;

    // console.log(estado.precioGeneral);
  };

  // const formatearFecha = (date: any) => {
  //   return format(new Date(date), 'dd-MM-yyyy, EEEE, HH:mm:ss', { locale: es });
  // };

  const aceptarTodoPedido = async (pedidoID: string) => {
    const { pedidoAceptarItems } = await pedidoService.pedidoAceptarItems(
      pedidoID,
    );
    const { pedidoPrepararItems } = await pedidoService.pedidoPrepararItems(
      pedidoID,
    );
    if (pedidoAceptarItems && pedidoPrepararItems)
      NotifySucessCenter('Pedido aceptado y en preparacion');
    else NotifyError('Error al aceptar pedido');
    buscarPedidos2();
  };

  const ajustarItem = async (row: any) => {
    console.log(row);
    estado.modal.isAjustarItem = true;
    estado.itemPedido.id = row._id;
    estado.itemPedido.cantidad = row.cantidad;
  };
  const ajustarItemGuardar = async () => {
    const { pedidoAjustarItem } = await pedidoService.pedidoAjustarItem(
      //@ts-ignore
      estado.pedidoDetalle._id,
      estado.itemPedido.id,
      estado.itemPedido.cantidad,
      estado.itemPedido.comentario,
    );
    if (pedidoAjustarItem) {
      NotifySucessCenter('Cantidad ajustada'); //@ts-ignore
      buscarPedidoID(estado.pedidoDetalle._id);
    } else NotifyError('Error al ajustar cantidad');
    estado.modal.isAjustarItem = false;
  };

  const abrirModalRecibirPedido = (pedidoID: string) => {
    estado.modal.isShowPassword = true;
    estado.pedidoID = pedidoID;
  };

  const recibirPedido = async () => {
    // INPUT PASSWORD CHOFER
    const password = 'choferSiipi123';

    if (estado.passwordChofer == password) {
      const { pedidoRecibirItems } = await pedidoService.pedidoRecibirItems(
        estado.pedidoID,
      );
      console.log(pedidoRecibirItems);
      if (pedidoRecibirItems) {
        NotifySucessCenter('Pedido recibido');
        estado.modal.isShowPassword = false;
        estado.passwordChofer = '';
        router.push('/punto/pedidos/listaPedidos');
      } else NotifyError('Error al recibir pedido');
    } else {
      NotifyError('Contraseña incorrecta');
      estado.modal.isShowPassword = false;
      estado.passwordChofer = '';
    }
  };

  const obtenerListaOfertas = async () => {
    const { entidadBuscarMenu } = await menuService.listarMenus(
      useAuth.negocioElegido._id,
    );
    console.log(entidadBuscarMenu);
    const { catalogoOfertasRecursivo } = await ofertaService.catalogoRecursivo(
      entidadBuscarMenu[0].catalogo._id,
    );
    estado.ListaOfertasPedido = catalogoOfertasRecursivo;
    console.log(estado.ListaOfertasPedido);
    // ofertaService.catalogoRecursivo()
  };

  const obtenerItemsEstado = async (pedidoID: string) => {
    const { pedidoBuscar } = await pedidoService.pedidoItemsEstado(pedidoID);
    console.log(pedidoBuscar[0]);
    // Filtrar items que tienen un estado ajustado
    const itemsConEstadoAjustado = pedidoBuscar[0].items.filter((item: any) => {
      const estadosAjustados = item.estado.filter(
        (estado: any) => estado.estado === 'ajustado',
      );
      return estadosAjustados.length > 0; // Solo retener items con al menos un estado "ajustado"
    });
    console.log(itemsConEstadoAjustado);

    // Obtener la información de nombre, estado ajustado, comentario y valor (último estado ajustado)
    estado.itemsEstadoAjustado = itemsConEstadoAjustado.map((item: any) => {
      const estadosAjustados = item.estado.filter(
        (estado: any) => estado.estado === 'ajustado',
      );
      const ultimoEstadoAjustado =
        estadosAjustados[estadosAjustados.length - 1];
      return {
        nombre: item.oferta.nombre,
        estadoAjustado: ultimoEstadoAjustado.estado,
        comentario: ultimoEstadoAjustado.comentario,
        valor: ultimoEstadoAjustado.valor,
      };
    });

    // Mostrar la información
    console.log(estado.itemsEstadoAjustado);
  };

  let filteredCatalogos = computed(() => {
    if (!filter.value) {
      return estado.catalogoSeleccionado2;
    }
    console.log(estado.catalogoSeleccionado);
    const res = {
      ...estado.catalogoSeleccionado, //@ts-ignore
      hijas: estado.catalogoSeleccionado.hijas
        .map((hija: any) => ({
          ...hija,
          ofertas: hija.ofertas.filter((oferta: any) =>
            oferta.nombre.toLowerCase().includes(filter.value.toLowerCase()),
          ),
        }))
        .filter((hija: any) => hija.ofertas.length > 0),
    };
    console.log(res);

    return res;
  });

  const aceptarTodosLosPedidosSolicitables = async () => {
    console.log('first');
    const pedidosIDS = estado.pedidosSinAceptar.map(
      (pedido: any) => pedido._id,
    );
    const { pedidosAceptarOfertasSolicitables } =
      await pedidoService.pedidosAceptarOfertasSolicitables(pedidosIDS);
    console.log(pedidosAceptarOfertasSolicitables);

    // const res = pedidosAceptarOfertasSolicitables.map(item => ({
    //   comprador: item.comprador,
    //   cantidadOferta: item.items.reduce((total, current) => total + current.cantidad, 0)
    //  }));
    //  console.log(res)

    const result = pedidosAceptarOfertasSolicitables.reduce(
      (acumulador: any, pedido: any) => {
        pedido.items.forEach((item: any) => {
          console.log(item);
          if (item.estado.some((estado: any) => estado.estado === 'aceptado')) {
            const itemExistente = acumulador.find(
              (itemAcumulador: any) =>
                itemAcumulador.oferta._id === item.oferta._id,
            );

            if (itemExistente) {
              itemExistente.cantidad += item.cantidad;
              itemExistente.pedidoIDS.push(pedido._id);
              const compradorExistente = itemExistente.entidad.find(
                (entidad: any) => entidad.nombre === pedido.comprador.nombre,
              );
              if (compradorExistente) {
                compradorExistente.cantidad += item.cantidad;
              } else {
                itemExistente.entidad.push({
                  nombre: pedido.comprador.nombre,
                  cantidad: item.cantidad,
                  ruta: pedido.comprador.ruta,
                  orden: pedido.comprador.orden,
                });
              }
            } else {
              acumulador.push({
                pedidoIDS: [pedido._id],
                estado: pedido.items[0].estado,
                oferta: {
                  _id: item.oferta._id,
                  nombre: item.oferta.nombre,
                  cantidad: item.oferta.ingredientes[0].cantidad,
                },
                producto: {
                  _id: item.oferta.ingredientes[0].producto._id,
                  nombre: item.oferta.ingredientes[0].producto.nombre,
                },
                cantidad: item.cantidad,
                entidad: [
                  {
                    nombre: pedido.comprador.nombre,
                    cantidad: item.cantidad,
                    ruta: pedido.comprador.ruta,
                    orden: pedido.comprador.orden,
                  },
                ],
              });
            }
          }
        });
        return acumulador;
      },
      [],
    );

    console.log(result);
    storePedido.pedidosSolicitado = result.map((pedido: any) => {
      const stock = estado.stocks.find(
        //@ts-ignore
        (stock: any) => stock.producto._id === pedido.producto._id,
      );
      console.log(stock);
      return {
        ...pedido, //@ts-ignore
        stockEntidad: stock ? stock.cantidad : 0, //@ts-ignore
        presentacionBasica: stock ? stock.producto.presentacionBasica : '',
      };
    });
    console.log(storePedido.pedidosSolicitado);
    NotifySucessCenter('Pedidos de solicitud aceptados');
    buscarPedidos2();
  };

  const aceptarTodosLosPedidosDirectos = async () => {
    const pedidosIDS = estado.pedidosSinAceptar.map(
      (pedido: any) => pedido._id,
    );
    console.log(pedidosIDS);
    const { pedidosAceptarOfertasDirectas } =
      await pedidoService.pedidosAceptarOfertasDirectas(pedidosIDS);
    console.log(pedidosAceptarOfertasDirectas);

    const result = pedidosAceptarOfertasDirectas.reduce(
      (acumulador: any, pedido: any) => {
        pedido.items.forEach((item: any) => {
          if (item.estado.some((estado: any) => estado.estado === 'aceptado')) {
            const itemExistente = acumulador.find(
              (itemAcumulador: any) =>
                itemAcumulador.oferta._id === item.oferta._id,
            );

            if (itemExistente) {
              itemExistente.cantidad += item.cantidad;
              itemExistente.pedidoIDS.push(pedido._id);
              const compradorExistente = itemExistente.entidad.find(
                (entidad: any) => entidad.nombre === pedido.comprador.nombre,
              );
              if (compradorExistente) {
                compradorExistente.cantidad += item.cantidad;
              } else {
                itemExistente.entidad.push({
                  nombre: pedido.comprador.nombre,
                  cantidad: item.cantidad,
                  ruta: pedido.comprador.ruta,
                  orden: pedido.comprador.orden,
                });
              }
            } else {
              acumulador.push({
                pedidoIDS: [pedido._id],
                estado: pedido.items[0].estado,
                oferta: {
                  _id: item.oferta._id,
                  nombre: item.oferta.nombre,
                  cantidad: item.oferta.ingredientes[0].cantidad,
                },
                producto: {
                  _id: item.oferta.ingredientes[0].producto._id,
                  nombre: item.oferta.ingredientes[0].producto.nombre,
                },
                cantidad: item.cantidad,
                entidad: [
                  {
                    nombre: pedido.comprador.nombre,
                    cantidad: item.cantidad,
                    ruta: pedido.comprador.ruta,
                    orden: pedido.comprador.orden,
                  },
                ],
              });
            }
          }
        });
        return acumulador;
      },
      [],
    );

    console.log(result);
    storePedido.pedidosDirecto = result.map((pedido: any) => {
      const stock = estado.stocks.find(
        //@ts-ignore
        (stock: any) => stock.producto._id === pedido.producto._id,
      );
      console.log(stock);

      return {
        ...pedido, //@ts-ignore
        stockEntidad: stock ? stock.cantidad : 0, //@ts-ignore
        presentacionBasica: stock ? stock.producto.presentacionBasica : '',
      };
    });
    console.log(storePedido.pedidosDirecto);
    NotifySucessCenter('Pedidos de directos aceptados');
    buscarPedidos2();
  };

  const verPedidoPuntos = (row: any) => {
    console.log(row.entidad);
    estado.modal.isShowPedidos = true;
    estado.pedidoPuntos = row.entidad.map((pedido: any) => {
      const diaDeLaSemana = new Date().getDay();
      const indice = diaDeLaSemana === 0 ? 6 : diaDeLaSemana - 1;
      return {
        ...pedido,
        ruta: pedido.ruta[indice],
        orden: pedido.orden[indice],
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
    console.log('first');
    console.log(fila);
    const { pedidosPrepararOfertas } =
      await pedidoService.pedidosOfertaPreparados(fila.pedidoIDS, [
        fila.oferta._id,
      ]);
    console.log(pedidosPrepararOfertas);

    // const test = pedidosPrepararOfertas[0].items[0].estado.some(
    //   (estado: any) => estado.estado === 'preparado',
    // );
    // console.log(test);

    if (pedidosPrepararOfertas)
      NotifySucessCenter('Oferta preparada exitosamente');
    console.log(pedidosPrepararOfertas);
    let item = pedidosPrepararOfertas[0].items[0];

    storePedido.pedidosSolicitado.forEach((pedido) => {
      if (pedido.oferta._id == item.oferta._id) {
        pedido.estado = item.estado;
      }
    });
    storePedido.pedidosDirecto.forEach((pedido) => {
      if (pedido.oferta._id == item.oferta._id) {
        pedido.estado = item.estado;
      }
    });
  };

  const ajustarOferta = async (fila: any) => {
    console.log('first');
    console.log(fila);
    let diferencia = fila.cantidad - fila.stockEntidad;
    console.log(diferencia);
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
        dense: true,
      },
    }).onOk(async () => {
      const { pedidosAjustarOferta } = await pedidoService.pedidosOfertaAjustar(
        fila.pedidoIDS,
        fila.oferta._id,
        estado.comentario,
        diferencia,
      );
      console.log(pedidosAjustarOferta);
      console.log(storePedido.pedidosDirecto);
      console.log(storePedido.pedidosSolicitado);

      if (pedidosAjustarOferta) {
        let item = pedidosAjustarOferta[0].items[0];
        // SOLICITUD
        pedidosAjustarOferta.map((pedido: any) => {
          storePedido.pedidosSolicitado.forEach((pedidoSolicitud) => {
            // Verificar si el ID del pedido coincide
            if (pedidoSolicitud.pedidoIDS.includes(pedido._id)) {
              pedido.items.forEach((item: any) => {
                // Verificar si la oferta en el pedido coincide con la oferta en storePedido.pedidosDirecto
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
                0,
              );
            }
          });
        });
        storePedido.pedidosSolicitado.forEach((pedido) => {
          if (pedido.oferta._id == item.oferta._id) {
            pedido.estado = item.estado;
          }
        });

        // DIRECTOS
        pedidosAjustarOferta.map((pedido: any) => {
          storePedido.pedidosDirecto.forEach((pedidoDirecto) => {
            // Verificar si el ID del pedido coincide
            if (pedidoDirecto.pedidoIDS.includes(pedido._id)) {
              pedido.items.forEach((item: any) => {
                // Verificar si la oferta en el pedido coincide con la oferta en storePedido.pedidosDirecto
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
                0,
              );
            }
          });
        });
        storePedido.pedidosDirecto.forEach((pedido) => {
          if (pedido.oferta._id == item.oferta._id) {
            pedido.estado = item.estado;
          }
        });

        NotifySucessCenter('Oferta ajustado correctamente');
      }
    });
  };

  const handlePedidoGlobal = () => {
    storePedido.pedidosSolicitado = storePedido.pedidosSolicitado.map(
      (pedido: any) => {
        const stock = estado.stocks.find(
          //@ts-ignore
          (stock: any) => stock.producto._id === pedido.producto._id,
        );
        console.log(stock);

        return {
          ...pedido, //@ts-ignore
          stockEntidad: stock ? stock.cantidad : 0,
        };
      },
    );
    storePedido.pedidosDirecto = storePedido.pedidosDirecto.map(
      (pedido: any) => {
        const stock = estado.stocks.find(
          //@ts-ignore
          (stock: any) => stock.producto._id === pedido.producto._id,
        );
        console.log(stock);

        return {
          ...pedido, //@ts-ignore
          stockEntidad: stock ? stock.cantidad : 0,
        };
      },
    );
    console.log(storePedido.pedidosSolicitado);
    console.log(storePedido.pedidosDirecto);
  };

  const mostrarEntidadSinPedidos = async () => {
    estado.modal.isShowEntidad = true;
    const { entidadBuscar } = await authService.buscarTodasEntidades();

    estado.entidadesSinPedidos = entidadBuscar.filter((entidad: any) => {
      if (entidad.tipo !== 'PUNTO') return false;
      return !estado.pedidosSinAceptar.some(
        (pedido: any) => pedido.comprador._id === entidad._id,
      );
    });
  };
  const filtroHistorial = (date: any) => {
    console.log('first');
    // console.log(date);
    // console.log(estado.pedidosRecibidos);
    // console.log(estado.pedidosRecibidos.length);

    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    estado.pedidosFiltrados = estado.pedidosRecibidos.filter((pedido: any) => {
      const pedidoDate = new Date(pedido._creado);
      pedidoDate.setHours(0, 0, 0, 0);

      return pedidoDate.getTime() === dateObj.getTime();
    });
    // console.log(estado.pedidosFiltrados);

    // console.log(pedidosFiltrados);
    // console.log(pedidosFiltrados.length);
  };

  onMounted(async () => {
    const { entidadBuscar } = await stockService.obtenerTodoStock(
      useAuth.negocioElegido._id,
    );

    // console.log(entidadBuscar);
    estado.stocks = entidadBuscar[0].almacen.map((stock: any) => {
      const cantidadTotal = stock.lotes.reduce(
        (total: any, lote: any) => total + lote.cantidad,
        0,
      );

      return {
        nombreProducto: stock.producto.nombre,
        foto: 'https://i.pinimg.com/564x/8d/1e/29/8d1e29fb76056c385d2d75117268c57d.jpg',
        producto: stock.producto,
        presentaciones: stock.producto.presentaciones,
        lotes: stock.lotes,
        cantidad: cantidadTotal,
      };
    });
    // console.log(estado.stocks);

    storePedido.pedidosSolicitado = storePedido.pedidosSolicitado.map(
      (pedido: any) => {
        const stock = estado.stocks.find(
          //@ts-ignore
          (stock: any) => stock.producto._id === pedido.producto._id,
        );
        // console.log(stock);

        return {
          ...pedido, //@ts-ignore
          stockEntidad: stock ? stock.cantidad : 0, //@ts-ignore
          presentacionBasica: stock ? stock.producto.presentacionBasica : '',
        };
      },
    );
    storePedido.pedidosDirecto = storePedido.pedidosDirecto.map(
      (pedido: any) => {
        const stock = estado.stocks.find(
          //@ts-ignore
          (stock: any) => stock.producto._id === pedido.producto._id,
        );
        // console.log(stock);

        return {
          ...pedido, //@ts-ignore
          stockEntidad: stock ? stock.cantidad : 0, //@ts-ignore
          presentacionBasica: stock ? stock.producto.presentacionBasica : '',
        };
      },
    );
  });

  return {
    useAuth,
    estado,
    obtenerCatalogosProductos,
    buscarPedidos,
    buscarPedidos2,
    buscarPedidoID,
    aceptarTodoPedido,
    ajustarItem,
    ajustarItemGuardar,
    recibirPedido,
    obtenerListaOfertas,
    obtenerItemsEstado,
    abrirModalRecibirPedido,
    filter,
    filteredCatalogos,
    aceptarTodosLosPedidosSolicitables,
    storePedido,
    aceptarTodosLosPedidosDirectos,
    verPedidoPuntos,
    ofertaPreparado,
    ajustarOferta,
    handlePedidoGlobal,
    mostrarEntidadSinPedidos,
    filtroHistorial,
  };
};
