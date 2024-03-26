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
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'vue-router';
import { pedidoStore } from '@/stores/pedido.store';
import { menuService } from '~/services/punto/menu.service';
import { ofertaService } from '~/services/marca/ofertas.service';
import { stockService } from '~/services/punto/stock.service';
/**
 * LOGICA
 */
export const usePedido = () => {
  const useAuth = authStore();
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
    },
    isEditCantidad: false,
    pedidosEntidad: [],
    pedidoDetalle: {},
    precioGeneral: 0,
    pedidosAceptados: [],
    pedidosSinAceptar: [],
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
      },
    ],
  });
  const filter = ref('');

  const obtenerCatalogosProductos = async () => {
    const { entidadLeerMenu } = await pedidoService.leerCatalogoConOfertas(
      useAuth.negocioElegido._id,
    ); //@ts-ignore
    // console.log(entidadLeerMenu.hijas);
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

    hideLoading();
  };
  const buscarPedidos2 = async () => {
    showLoading();
    // const {pedidoBuscar} = await pedidoService.pedidoBuscarVendedor(
    //   useAuth.negocioElegido._id,
    //   useGqlToken(useAuth.token),
    // );
    // console.log(pedidoBuscar);
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

        if (allAccepted) {
          accumulator.aceptados.push(pedido);
        } else {
          accumulator.noAceptados.push(pedido);
        }

        return accumulator;
      },
      { aceptados: [], noAceptados: [] },
    );
    console.log(estado.pedidosSinAceptar);
    console.log(estado.pedidosAceptados);
    hideLoading();

    estado.pedidosSinAceptar = pedidos.noAceptados;
    estado.pedidosAceptados = pedidos.aceptados;
  };

  const buscarPedidoID = async (id: string) => {
    const { pedidoBuscar } = await pedidoService.pedidoBuscar(
      undefined,
      undefined,
      id,
      useGqlToken(useAuth.token),
    );
    estado.pedidoDetalle = pedidoBuscar[0]; //@ts-ignore
    estado.precioGeneral = pedidoBuscar[0].items.reduce((total, item) => {
      return total + item.oferta.precio * item.cantidad;
    }, 0);

    const { pedidoLeerEstado } = await pedidoService.pedidoLeerEstado(id);
    estado.pedidoItemsEstado = pedidoLeerEstado;

    // console.log(estado.precioGeneral);
  };

  const formatearFecha = (date: any) => {
    return format(new Date(date), 'dd-MM-yyyy, EEEE, HH:mm:ss', { locale: es });
  };

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
    const { catalogoOfertasRecursivo } = await ofertaService.catalogoRecursivo(
      entidadBuscarMenu[0].catalogo._id,
    );
    estado.ListaOfertasPedido = catalogoOfertasRecursivo;
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
                });
              }
            } else {
              acumulador.push({
                pedidoIDS: [pedido._id],
                estado: pedido.items[0].estado,
                oferta: {
                  _id: item.oferta._id,
                  nombre: item.oferta.nombre,
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
      if (stock) {
        return {
          ...pedido, //@ts-ignore
          stockEntidad: stock.cantidad,
        };
      }
      return null;
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
                });
              }
            } else {
              acumulador.push({
                pedidoIDS: [pedido._id],
                estado: pedido.items[0].estado,
                oferta: {
                  _id: item.oferta._id,
                  nombre: item.oferta.nombre,
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
      if (stock) {
        return {
          ...pedido, //@ts-ignore
          stockEntidad: stock.cantidad,
        };
      }
      return null;
    });
    console.log(storePedido.pedidosDirecto);
    NotifySucessCenter('Pedidos de directos aceptados');
    buscarPedidos2();
  };

  const verPedidoPuntos = (row: any) => {
    console.log('first');
    console.log(row);
    estado.modal.isShowPedidos = true;
    estado.pedidoPuntos = row.entidad;
    console.log(estado.pedidoPuntos);
  };

  const ofertaPreparado = async (fila: any) => {
    console.log('first');
    console.log(fila);
    const { pedidosPrepararOfertas } =
      await pedidoService.pedidosOfertaPreparados(fila.pedidoIDS, [
        fila.oferta._id,
      ]);
    if (pedidosPrepararOfertas)
      NotifySucessCenter('Oferta preparada exitosamente');
    console.log(pedidosPrepararOfertas);
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
    console.log(estado.stocks);
  });

  return {
    useAuth,
    estado,
    obtenerCatalogosProductos,
    buscarPedidos,
    buscarPedidos2,
    buscarPedidoID,
    formatearFecha,
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
  };
};
