import { storeAlmacen } from '../../negocio/almacen.store';
import { almacenService } from '../../API/almacen.service';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';
import type { Producto, Stock } from '#gql';

export const useStock = () => {
  const store = storeAlmacen();
  const service = almacenService;
  const authStore = useAuthStore();

  const estado = reactive({
    stocks: [] as {
      // key: String;
      stock: Stock;
      producto: Producto;
      cantidadTotal: Number;
    }[],
    producto: {
      id: '',
      cantidadMinima: 0,
    },
    alerta: 0,
    modal: {
      isShowCantidad: false,
      isShowAlertProduct: false,
      isShowVencidos: false,
      isShowAllProducts: false,
    },
    productosVencidos: [] as any[],
  });

  /**
   * obtenerTodoStock
   */
  const obtenerTodoStock = async () => {
    const stocks = await service.stockEntidad(authStore.getNegocio._id);
    estado.stocks = stocks.map((stock: any) => {
      // Cantidad Total
      const cantidadTotal = stock.lotes.reduce(
        (total: any, lote: any) => total + lote.cantidad,
        0,
      );

      // Alerta de cantidad global
      let alertaC =
        cantidadTotal <= stock.cantidadLimite
          ? cantidadTotal - stock.cantidadLimite
          : null;
      if (alertaC > 0) alertaC = null;

      // Aleta de vencimiento en cada lote
      for (const lote of stock.lotes) {
        lote.alertaV = lote.vencimiento
          ? diferenciaFechas(lote.vencimiento, new Date(), 'D')
          : null;
      }

      // alerta de venciminento global
      const vencimientos = stock.lotes
        .map((lote) => lote.alertaV)
        .filter((v) => v !== null);
      const alertaV = vencimientos.length > 0 ? Math.min(vencimientos) : null;

      // Return
      return {
        _id: stock._id,
        stock,
        producto: stock.producto,
        cantidadTotal,
        alertaC,
        alertaV,
        alertaI: null,
      };
    });
  };

  /**
   * obtenerTodoStock
   */
  const modalEditarCantidad = (row: any) => {
    estado.modal.isShowCantidad = true;
    estado.producto.id = row.producto._id;
    estado.producto.cantidadMinima = row.cantidadMinima;
  };

  /**
   * guardarCantidad
   */
  const guardarCantidad = async () => {
    await service.modificarCantidad(
      authStore.getNegocio._id,
      estado.producto.id,
      estado.producto.cantidadMinima,
    );
    NotifySucess('Se actualizo correctamente');
    estado.modal.isShowCantidad = false;
    obtenerTodoStock();
  };

  /**
   * agregarListaInventario
   */
  const agregarListaInventario = (row: any) => {
    // console.log(row);
    const data = {
      id: row.producto.id,
      nombre: row.producto.nombre,
    };
    const isInList = store.ListInventario.some((item) => {
      return item.id === data.id;
    });
    // console.log(isInList);
    if (!isInList) {
      store.ListInventario.push(data);
      NotifySucess('Se añadio a la lista de inventario');
    } else {
      NotifyError('Ya se encuentra en la lista de  inventario');
    }
  };

  return {
    estado,
    store,
    service,
    modalEditarCantidad,
    guardarCantidad,
    agregarListaInventario,
    obtenerTodoStock,
  };
};
