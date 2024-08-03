import { useAuthStore } from "@/modulos/main/useAuthStore";

export const usePuntos = () => {
  const authStore = useAuthStore();

  const estado = reactive({
    pedidosAceptados: [],
    pedidosSinAceptar: [],
    pedidosRecibidos: [],
    pedidosFiltrados: [],
    pedidoItemsEstado: "",
  });

  const buscarPedidos = async () => {
    const { buscarPedidos: listaPedidos } = await GqlBuscarPedidos(
      { busqueda: { vendedor: [authStore.negocio._id] } }, // @ts-expect-error
      useGqlToken(authStore.token)
    );
    console.log(listaPedidos);

    const pedidos = listaPedidos.reduce(
      (accumulator: any, pedido: any) => {
        const allAccepted = pedido.items.every((item: any) =>
          item.estado.some((estado: any) => estado.estado === "aceptado")
        );

        const hasReceived = pedido.items.some((item: any) =>
          item.estado.some((estado: any) => estado.estado === "recibido")
        );
        const allConfirmed = pedido.items.some((item: any) =>
          item.estado.some((estado: any) => estado.estado === "confirmado")
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

    // hideLoading();

    const diaDeLaSemana = new Date().getDay();
    const indice = diaDeLaSemana === 0 ? 6 : diaDeLaSemana - 1;

    // estado.panaderia = pedidos.aceptados
    //   .map((pedido: any) => {
    //     return {
    //       ...pedido,
    //       items: pedido.items.filter(
    //         (item: any) => item.oferta.panaderia === true
    //       ),
    //       comprador: {
    //         ...pedido.comprador,
    //         ruta: pedido.comprador.ruta[indice],
    //         orden: pedido.comprador.orden[indice]
    //       }
    //     };
    //   })
    //   .sort((a: any, b: any) => {
    //     if (a.comprador.ruta === b.comprador.ruta) {
    //       return a.comprador.orden - b.comprador.orden;
    //     }
    //     return a.comprador.ruta - b.comprador.ruta;
    //   });
    // // console.log(estado.panaderia);

    // estado.reposteria = pedidos.aceptados
    //   .map((pedido: any) => {
    //     return {
    //       ...pedido,
    //       items: pedido.items.filter(
    //         (item: any) => item.oferta.reposteria === true
    //       ),
    //       comprador: {
    //         ...pedido.comprador,
    //         ruta: pedido.comprador.ruta[indice],
    //         orden: pedido.comprador.orden[indice]
    //       }
    //     };
    //   })
    //   .sort((a: any, b: any) => {
    //     if (a.comprador.ruta === b.comprador.ruta) {
    //       return a.comprador.orden - b.comprador.orden;
    //     }
    //     return a.comprador.ruta - b.comprador.ruta;
    //   });
    // estado.envasados = pedidos.aceptados
    //   .map((pedido: any) => {
    //     return {
    //       ...pedido,
    //       items: pedido.items.filter(
    //         (item: any) => item.oferta.envasados === true
    //       ),
    //       comprador: {
    //         ...pedido.comprador,
    //         ruta: pedido.comprador.ruta[indice],
    //         orden: pedido.comprador.orden[indice]
    //       }
    //     };
    //   })
    //   .sort((a: any, b: any) => {
    //     if (a.comprador.ruta === b.comprador.ruta) {
    //       return a.comprador.orden - b.comprador.orden;
    //     }
    //     return a.comprador.ruta - b.comprador.ruta;
    //   });
    // estado.embotellados = pedidos.aceptados
    //   .map((pedido: any) => {
    //     return {
    //       ...pedido,
    //       items: pedido.items.filter(
    //         (item: any) => item.oferta.embotellados === true
    //       ),
    //       comprador: {
    //         ...pedido.comprador,
    //         ruta: pedido.comprador.ruta[indice],
    //         orden: pedido.comprador.orden[indice]
    //       }
    //     };
    //   })
    //   .sort((a: any, b: any) => {
    //     if (a.comprador.ruta === b.comprador.ruta) {
    //       return a.comprador.orden - b.comprador.orden;
    //     }
    //     return a.comprador.ruta - b.comprador.ruta;
    //   });
    // estado.siinple = pedidos.aceptados
    //   .map((pedido: any) => {
    //     return {
    //       ...pedido,
    //       items: pedido.items.filter(
    //         (item: any) => item.oferta.siinple === true
    //       ),
    //       comprador: {
    //         ...pedido.comprador,
    //         ruta: pedido.comprador.ruta[indice],
    //         orden: pedido.comprador.orden[indice]
    //       }
    //     };
    //   })
    //   .sort((a: any, b: any) => {
    //     if (a.comprador.ruta === b.comprador.ruta) {
    //       return a.comprador.orden - b.comprador.orden;
    //     }
    //     return a.comprador.ruta - b.comprador.ruta;
    //   });
  };

  return {
    estado,
    buscarPedidos,
  };
};
