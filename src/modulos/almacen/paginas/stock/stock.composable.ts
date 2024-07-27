import type { Categoria, Marca, Producto, Stock } from '#gql';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
import { useAuthStore } from '~/modulos/main/useAuthStore';

export const useStock = () => {
  const authStore = useAuthStore();
  const { store } = useAlmacen();
  const estado = reactive({
    stocks: [] as {
      _id: String;
      stock: Stock;
      producto: Producto;
      primerVencimiento: Date;
      cantidadTotal: number;
      alertaCantidad: number;
      alertaVencimiento: number;
      diasVencimiento: number;
      vencimientoLimite: [number, number];
      alertaInventario: number;
      marcas: {
        [key: string]: {
          marca: Marca;
          cantidadTotal: number;
          primerVencimiento: null;
          alertaCantidad: number;
          diasVencimiento: number;
          alertaVencimiento: number;
          cantidadLimite: [number, number];
          inventarioLimite: [number, number];
        };
      };
    }[],
    filtros: {
      alerta: '',
      categoriaSeleccionada: '',
      marcaSeleccionada: '',
      buscarFiltro: '',
    },
  });

  /**
   * obtenerTodoStock
   */
  const obtenerTodoStock = async () => {
    const entidad = await api.buscarEntidad_almacen(authStore.getNegocio._id);
    estado.stocks = entidad.almacen.map((stock: any) => {
      const res = {
        _id: stock._id,
        stock,
        producto: stock.producto,
        vencimientoLimite: stock.producto.vencimientoLimite,
        cantidadTotal: 0,
        primerVencimiento: null,
        alertaCantidad: 0,
        alertaVencimiento: 0,
        diasVencimiento: null,
        alertaInventario: 0,
        marcas: {},
      };

      // recorremos los lotes
      for (const lote of stock.lotes) {
        const id = lote.marca._id.toString();

        // INICIALIZACION
        const variedad = stock.producto.variedades.find(
          (variedad: any) => variedad.marca._id === id,
        );
        if (!res.marcas[id]) {
          Object.assign(res.marcas, {
            [id]: {
              marca: lote.marca,
              cantidadLimite: variedad?.cantidadLimite,
              inventarioLimite: variedad?.inventarioLimite,
              cantidadTotal: 0,
              alertaCantidad: 0,
              primerVencimiento: null,
              alertaVencimiento: 0,
              diasVencimiento: null,
              alertaInventario: 0,
            },
          });
        }

        // CANTIDAD
        res.cantidadTotal += lote.cantidad;
        res.marcas[id].cantidadTotal += lote.cantidad;

        // VENCIMIENTO
        if (lote.vencimiento && res.vencimientoLimite) {
          // lote
          lote.diasVencimiento = Math.floor(
            diferenciaFechas(new Date(), lote.vencimiento, 'D'),
          );
          lote.alertaVencimiento =
            lote.diasVencimiento <= Math.min(...res.vencimientoLimite)
              ? 2
              : lote.diasVencimiento <= Math.max(...res.vencimientoLimite)
              ? 1
              : 0;
          // marca
          if (res.marcas[id].diasVencimiento == null) {
            res.marcas[id].diasVencimiento = lote.diasVencimiento;
          } else {
            res.marcas[id].diasVencimiento = Math.min(
              res.marcas[id].diasVencimiento,
              lote.diasVencimiento,
            );
          }
          if (
            res.marcas[id].primerVencimiento == null ||
            new Date(lote.vencimiento).getTime() <
              new Date(res.marcas[id].primerVencimiento).getTime()
          ) {
            res.marcas[id].primerVencimiento = lote.vencimiento;
          }
          // global
          if (res.diasVencimiento == null) {
            res.diasVencimiento = lote.diasVencimiento;
          } else {
            res.diasVencimiento = Math.min(
              res.diasVencimiento,
              lote.diasVencimiento,
            );
          }
          res.alertaVencimiento = Math.max(
            res.alertaVencimiento,
            lote.alertaVencimiento,
          );
          if (
            res.primerVencimiento == null ||
            new Date(lote.vencimiento).getTime() <
              new Date(res.primerVencimiento).getTime()
          ) {
            res.primerVencimiento = lote.vencimiento;
          }
        }
      }

      // alerta cantidad global
      for (const id in res.marcas) {
        const marca = res.marcas[id];
        if (marca.cantidadLimite) {
          marca.alertaCantidad =
            marca.cantidadTotal <= Math.min(...marca.cantidadLimite)
              ? 2
              : marca.cantidadTotal <= Math.max(...marca.cantidadLimite)
              ? 1
              : 0;
          res.alertaCantidad = Math.max(
            res.alertaCantidad,
            marca.alertaCantidad,
          );
        }
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
            class: 'option',
          });
          idsHijas.push(subcat._id);
        }
        options.push({
          label: `${cat.nombre} (${cat.hijas.length})`,
          value: [...idsHijas, cat._id],
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
          class: 'option',
        });
      }
    }
    return options;
  });

  // Inicializaciones
  onMounted(async () => {
    await store.getCategorias();
  });

  return {
    estado,
    store,
    obtenerTodoStock,
    selectCategoriaFiltro,
    selectMarcaFiltro,
  };
};
