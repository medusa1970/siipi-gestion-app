import { storeAlmacen } from '../../negocio/almacen.store';
import { almacenService } from '../../API/almacen.service';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';
import type { Inventario } from '#gql';

export const useInventario = () => {
  const store = storeAlmacen();
  const service = almacenService;
  const authStore = useAuthStore();

  const estado = reactive({
    productosBloquesNull: [],
    inventario: null as Inventario,
    // {
    //   producto: '',
    //   lotes: [
    //     {
    //       vencimiento: '',
    //       cantidad: '',
    //       bloque: '',
    //     },
    //   ],
    // },
    countRetry: 0,
    diferencias: [],
  });

  /**
   * obtenerProductosInventariar
   */
  const obtenerProductosInventariar = async () => {
    const productos = await service.filaInventario(authStore.getNegocio._id);
    estado.productosBloquesNull = productos;
  };

  /**
   * agregarFila
   */
  const agregarFila = () => {
    estado.inventario.lotes.push({
      vencimiento: '',
      cantidad: '',
      bloque: '',
    });
  };

  /**
   * terminarInventario
   */
  const terminarInventario = async (producto) => {
    estado.inventario.lotes.forEach((lote) => {
      if (lote.vencimiento === '') lote.vencimiento = null;
    });

    console.log(authStore.getNegocio._id);
    console.log(producto._id);
    console.log(estado.inventario.lotes);

    /**LOGICA */
    service
      .realizarInventario(
        authStore.getNegocio._id,
        producto._id,
        estado.inventario.lotes,
        false,
      )
      .then((res) => {
        if (res.diferencias?.length > 0) {
          estado.diferencias = res.diferencias;
          estado.countRetry++;
          if (estado.countRetry > 1) {
            if (estado.diferencias == res.diferencias)
              service
                .realizarInventario(
                  authStore.getNegocio._id,
                  producto._id,
                  estado.inventario.lotes,
                  true,
                )
                .then(() => {
                  NotifySucess('Inventario guardado');
                  estado.productosBloquesNull =
                    estado.productosBloquesNull.filter(
                      (item) => item._id !== producto._id,
                    );
                  limpiarInputs();
                });
          } else {
            NotifyError('Hay diferencias, vuelva a hacer el inventario');
          }
        } else {
          // console.log('first');
          service
            .realizarInventario(
              authStore.getNegocio._id,
              producto._id,
              estado.inventario.lotes,
              true,
            )
            .then((res) => {
              NotifySucess('Inventario guardado');
              estado.productosBloquesNull = estado.productosBloquesNull.filter(
                //@ts-ignore
                (item) => item._id !== producto._id,
              );
              limpiarInputs();
            });
        }
      });
  };

  /**
   * limpiarInputs
   */
  const limpiarInputs = () => {
    estado.inventario.lotes = [
      {
        vencimiento: '',
        cantidad: '',
        bloque: '',
      },
    ];
  };

  return {
    estado,
    store,
    service,
    obtenerProductosInventariar,
    agregarFila,
    terminarInventario,
    limpiarInputs,
  };
};
