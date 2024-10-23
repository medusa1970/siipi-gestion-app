import type { Catalogo, Oferta } from '#gql';
import { useOfertas } from '~/modulos/ofertas/ofertas.composable';
import Decimal from 'decimal.js';

/**
 * Permisos requeridos para esta pagina
 */
export const permisosOfertas = ['ADQUISICION', 'LOGISTICA', 'ALMACEN'];

/**
 * Composable
 */
export const formPedido = () => {
  const { authStore, router, ofertaIncompleta } = useOfertas();
  if (!authStore.autorizar(permisosOfertas)) goTo(router, 'noAutorizado');

  const estado = reactive({
    comprador: null,
    vendedor: null,
    validar: false,
    formData: {},
    catalogo: null as Catalogo,
    total: 10,
    filtros: {
      catalogo: null,
      buscar: null,
      seleccionados: false
    }
  });
  const reiniciarForm = () => {
    for (const cat of catRows.value) {
      for (const subCat of cat.hijas ?? []) {
        for (const oferta of subCat.ofertas ?? []) {
          Object.assign(estado.formData, {
            [oferta._id]: {
              cantidad: 0,
              precio: 0
            }
          });
        }
      }
    }
  };
  const contador = computed(() => {
    const res = {};
    for (const cat of catRows.value ?? []) {
      for (const subCat of cat.hijas ?? []) {
        Object.assign(res, { [subCat._id]: [0, 0] });
        for (const oferta of subCat.ofertas ?? []) {
          res[subCat._id][0]++;
          if (estado.formData[oferta._id]?.cantidad) res[subCat._id][1]++;
        }
      }
    }
    return res;
  });
  const items = computed(() => {
    const items = [];
    for (const ofertaId in estado.formData) {
      if (estado.formData[ofertaId].cantidad != 0) {
        items.push({
          ofertaId: ofertaId,
          cantidad: estado.formData[ofertaId].cantidad
        });
      }
    }
    return items;
  });
  const precioTotal = computed(() => {
    let precio = new Decimal(0);
    for (const ofertaId in estado.formData) {
      if (estado.formData[ofertaId].cantidad != 0) {
        precio = precio.add(estado.formData[ofertaId].precio);
      }
    }
    return precio;
  });
  const calcularPrecio = (oferta, cantidad, conFactura) => {
    // seleccion del precio basico por defecto
    let precioSeleccionado = {
      cantidadMin: 1,
      precioConFactura: oferta.precioConFactura,
      precioSinFactura: oferta.precioSinFactura
    };

    // precio por mayor ?
    if (oferta.preciosPorMayor) {
      for (const precio of oferta.preciosPorMayor.sort(
        (a, b) => a.cantidadMin - b.cantidadMin
      )) {
        if (cantidad >= precio.cantidadMin) {
          precioSeleccionado = precio;
        }
      }
    }
    // con o sin factura ?
    const precio = conFactura
      ? precioSeleccionado.precioConFactura
      : precioSeleccionado.precioSinFactura;
    return new Decimal(precio).mul(cantidad);
  };
  const showTree = computed(() => {
    const cats = [];
    const ofertas = [];
    const regex = new RegExp(estado.filtros.buscar, 'i');

    for (const cat of catRows.value ?? []) {
      for (const subCat of cat.hijas ?? []) {
        let has = false;
        subCat;
        for (const oferta of subCat.ofertas ?? []) {
          if (
            !estado.filtros.buscar ||
            estado.filtros.buscar == '' ||
            regex.test(sinImportarAcentos(oferta.nombre))
          ) {
            ofertas.push(oferta._id);
            has = true;
          }
        }
        if (has) {
          cats.push(subCat._id);
          if (!cats.includes(cat._id)) cats.push(cat._id);
        }
      }
    }
    return { cats, ofertas };
  });
  watch(
    () => estado.catalogo,
    () => {
      reiniciarForm();
    }
  );

  const catRows = computed(() => {
    if (!estado.catalogo) return [];
    let filtered = clone(estado.catalogo);

    // solo las ofertas completos
    // const filtroCompleto = catalogo => {
    //   catalogo.ofertas = catalogo.ofertas.filter(o => !ofertaIncompleta(o));
    //   if (catalogo.hijas) {
    //     catalogo.hijas = catalogo.hijas.map(h => filtroCompleto(h));
    //   }
    //   return catalogo;
    // };
    // filtered = filtroCompleto(filtered);

    // no mostrar las categorias vacias
    const hasOfertasCat = catalogo => {
      if (catalogo.ofertas && catalogo.ofertas.length > 0) {
        return catalogo;
      }
      if (catalogo.hijas) {
        const nuevasHijas = [];
        for (const hija of catalogo.hijas) {
          const nuevaHija = hasOfertasCat(hija);
          if (nuevaHija !== null) {
            nuevasHijas.push(nuevaHija);
          }
        }
        catalogo.hijas = nuevasHijas;
      }
      return catalogo.hijas && catalogo.hijas.length > 0 ? catalogo : [];
    };
    filtered = hasOfertasCat(filtered);

    return filtered.hijas ?? [];
  });

  const mandarPedido = async (recibirDirectamente = false) => {
    let pedido;
    console.log('mandarPedido', { recibirDirectamente });
    try {
      const consulta = recibirDirectamente
        ? GqlIniciarPedidoRecibir
        : GqlIniciarPedido;
      pedido = await crearUno(consulta, {
        datos: {
          comprador: estado.comprador,
          vendedor: estado.vendedor,
          conFactura: false,
          items: items.value
        }
      });
      if (!pedido) {
        throw 'Error al realizar el pedido';
      }
    } catch (err) {
      NotifyError('Hubo un error al hacer el pedido, reintente');
      errFailback(err);
      return false;
    }
    NotifySucessCenter('Pedido realizado');
    reiniciarForm();
    estado.validar = false;
    return pedido;
  };

  return {
    estado,
    precioTotal,
    authStore,
    contador,
    items,
    router,
    showTree,
    reiniciarForm,
    catRows,
    calcularPrecio,
    mandarPedido,
    ofertaIncompleta
  };
};
