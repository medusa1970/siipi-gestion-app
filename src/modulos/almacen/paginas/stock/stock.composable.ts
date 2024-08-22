import type { Bloque, Categoria, Marca, Producto, Stock } from '#gql';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';

/**
 * Permisos requeridos para esta pagina
 */
export const permisosStock = ['ADQUISICION', 'LOGISTICA', 'ALMACEN'];

/**
 * Composable
 */
export const useStock = () => {
  const { store, authStore, router } = useAlmacen();
  if (!authStore.autorizar(permisosStock)) goTo(router, 'noAutorizado');

  const estado = reactive({
    stocks: [],
    filtros: {
      alerta: null,
      categoriaSeleccionada: null,
      marcaSeleccionada: null,
      buscar: ''
    },
    modal: {
      formInventario: false
    }
  });

  /**
   * obtenerTodoStock
   */
  const obtenerTodoStock = async () => {
    const entidad = await api.buscarEntidad_almacen(authStore.getNegocio._id);
    estado.stocks = entidad.almacen.map((stock: any) => {
      // inicializacion res para este stock
      const res = {
        _id: stock._id,
        stock,
        producto: stock.producto,
        marcas: {},

        // cantidad
        cantidadTotal: 0,
        alertaCantidad: 0,

        // vencimiento
        diasHastaProximoVencimiento: null, // dias entre hoy y próxima alerta
        alertaVencimiento: 0,

        // inventario
        fechaUltimoInventario: stock.lotes?.[0]._creado,
        diasDesdeUltimoInventario: Math.floor(
          diferenciaFechas(stock.lotes?.[0]._creado, new Date(), 'D')
        ),
        diasHastaProximoInventario: null,
        inventarioAviso: null,
        alertaInventario: 0
      };

      // Inicializacion de las marcas
      for (const lote of stock.lotes) {
        const marcaId = lote.marca._id.toString();
        const variedad = stock.producto.variedades.find(
          (variedad: any) => variedad.marca._id === marcaId
        );
        if (!res.marcas[marcaId]) {
          Object.assign(res.marcas, {
            [marcaId]: {
              marca: lote.marca,

              //cantidad
              cantidadAvisoSuave: variedad?.cantidadAvisoSuave,
              cantidadAvisoFuerte: variedad?.cantidadAvisoFuerte,
              cantidadTotal: 0,
              alertaCantidad: 0,

              // inventario
              alertaInventario: 0,
              inventarioPeriodo: variedad?.inventarioPeriodo,
              inventarioAviso: variedad?.inventarioAviso,
              diasHastaProximoInventario: null // dias hasta que toque el proximo inventario
            }
          });
        }
      }

      // Alerta de inventario por marca y res
      for (const marcaId in res.marcas) {
        const marca = res.marcas[marcaId];
        if (marca.inventarioPeriodo <= 0) continue;

        // alerta marca
        marca.diasHastaProximoInventario =
          marca.inventarioPeriodo - res.diasDesdeUltimoInventario;
        marca.alertaInventario = 0;
        if (marca.diasHastaProximoInventario <= marca.inventarioAviso) {
          marca.alertaInventario = 1;
        }
        if (marca.diasHastaProximoInventario <= 0) {
          marca.alertaInventario = 2;
        }

        // alerta res
        if (res.diasHastaProximoInventario === null) {
          res.diasHastaProximoInventario = marca.diasHastaProximoInventario;
        } else if (res.alertaInventario !== 3) {
          res.diasHastaProximoInventario = Math.min(
            res.diasHastaProximoInventario,
            marca.diasHastaProximoInventario
          );
        }
        if (res.alertaInventario == null) {
          res.alertaInventario = marca.alertaInventario;
        } else {
          res.alertaInventario = Math.max(
            res.alertaInventario,
            marca.alertaInventario
          );
        }
      }

      // cantidad total y alerta de cantidad por marca y global
      for (const lote of stock.lotes) {
        const marcaId = lote.marca._id.toString();
        // ajustamos las cantidad
        res.cantidadTotal += lote.cantidad;
        res.marcas[marcaId].cantidadTotal += lote.cantidad;
        // max y min segun la configuracion de marca
        const max = Math.max(
          res.marcas[marcaId].cantidadAvisoFuerte,
          res.marcas[marcaId].cantidadAvisoSuave
        );
        const min = Math.min(
          res.marcas[marcaId].cantidadAvisoFuerte,
          res.marcas[marcaId].cantidadAvisoSuave
        );
        // si no hay limite configurado salimos
        if (Math.max(min, max) <= 0) {
          continue;
        }
        // dias hasta que toque el inventario (sale negativo si ya pasó)
        res.marcas[marcaId].diasInventario =
          Math.floor(
            diferenciaFechas(res.fechaUltimoInventario, new Date(), 'D')
          ) + max;
        // alerta de marca
        lote.alertaCantidad = 0;
        if (max > 0 && res.marcas[marcaId].cantidadTotal <= max)
          res.marcas[marcaId].alertaCantidad = 1;
        if (min > 0 && res.marcas[marcaId].cantidadTotal <= min)
          res.marcas[marcaId].alertaCantidad = 2;
        // alerta res
        res.alertaCantidad = Math.max(
          res.alertaCantidad,
          res.marcas[marcaId].alertaCantidad
        );
      }

      // alerta de vencimiento por lote y res
      for (const lote of stock.lotes) {
        if (!stock.producto.puedeVencer || !lote.vencimiento) continue;

        // dias hasta el vencimiento (sale negativo si ya pasó)
        lote.diasHastaVencimiento = Math.ceil(
          diferenciaFechas(new Date(), lote.vencimiento, 'D')
        );

        lote.alertaVencimiento = 0;
        if (
          stock.producto.vencimientoAvisoSuave &&
          lote.diasHastaVencimiento <= stock.producto.vencimientoAvisoSuave
        ) {
          lote.alertaVencimiento = 1;
        }
        if (
          lote.diasHastaVencimiento <
          (stock.producto.vencimientoAvisoFuerte ?? 0)
        ) {
          lote.alertaVencimiento = 2;
        }

        if (res.diasHastaProximoVencimiento == null) {
          res.diasHastaProximoVencimiento = lote.diasHastaVencimiento;
        } else {
          lote.diasHastaVencimiento = Math.min(
            res.diasHastaProximoVencimiento,
            lote.diasHastaVencimiento
          );
        }
        res.alertaVencimiento = Math.max(
          res.alertaVencimiento,
          lote.alertaVencimiento
        );
      }
      return res;
    });
  };

  // computeds
  const selectCategoriaFiltro = computed(() => {
    let options = [];
    if (store.categoriaArbol) {
      for (const cat of store.categoriaArbol.hijas) {
        const idsHijas = [];
        const hijas = [];
        for (const subcat of cat.hijas) {
          hijas.push({
            label: subcat.nombre,
            value: [subcat._id],
            class: 'option'
          });
          idsHijas.push(subcat._id);
        }
        options.push({
          label: cat.nombre,
          value: [...idsHijas, cat._id]
        });
        options = [...options, ...hijas];
      }
    }
    return options;
  });

  // computeds
  const selectMarcaFiltro = computed(() => {
    let options = [];
    if (store.marcas) {
      for (const marca of store.marcas) {
        options.push({
          label: marca.nombre,
          value: marca._id,
          class: 'option'
        });
      }
    }
    return options;
  });

  // rows para la tabla
  const rowsParaMostrar = computed(() => {
    let filtered = estado.stocks;
    // filtro por alertas
    if (estado.filtros.alerta === 'cantidad') {
      filtered = filtered.filter(stock => stock.alertaCantidad > 0);
    }
    if (estado.filtros.alerta === 'vencimiento') {
      filtered = filtered.filter(stock => stock.alertaVencimiento > 0);
    }
    if (estado.filtros.alerta === 'inventario') {
      filtered = filtered.filter(stock => stock.alertaInventario != 0);
    }
    // filtro por categoria
    if (
      estado.filtros.categoriaSeleccionada != null &&
      estado.filtros.categoriaSeleccionada !== ''
    ) {
      filtered = filtered.filter(stock =>
        estado.filtros.categoriaSeleccionada.includes(
          stock.producto.categoria._id
        )
      );
    }
    // filtro por marca
    if (
      estado.filtros.marcaSeleccionada != null &&
      estado.filtros.marcaSeleccionada !== ''
    ) {
      filtered = filtered.filter(stock =>
        Object.keys(stock.marcas).includes(estado.filtros.marcaSeleccionada)
      );
    }
    // filtro por buscar que no discrimine maiusculas de minusculas y acentos
    if (estado.filtros.buscar != null) {
      filtered = filtered.filter(stock => {
        const regex = crearRegex(estado.filtros.buscar);
        return regex.test(sinImportarAcentos(stock.producto.nombre));
      });
    }
    return filtered;
  });

  // Inicializaciones
  onBeforeMount(async () => {
    await store.getEntidad();
    await store.getCategorias();
    await obtenerTodoStock();
  });

  // se hizo un inventario
  const handleInventario = async inventario => {
    NotifySucessCenter('Inventario hecho');
    estado.modal.formInventario = false;
    obtenerTodoStock();
  };

  const getBloque = (id): Bloque => {
    return store.entidad.bloques.find(b => b._id === id);
  };

  return {
    estado,
    store,
    authStore,
    router,
    obtenerTodoStock,
    handleInventario,
    getBloque,
    rowsParaMostrar,
    selectCategoriaFiltro,
    selectMarcaFiltro
  };
};
