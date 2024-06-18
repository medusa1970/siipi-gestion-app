/**
 * IMPORTS
 */
import { reactive, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { inventarioService } from '~/services/inventary.service';
import { useProductoStore } from '../producto/useProductoStore';

/**
 * LOGICA
 */
export const useInventary = () => {
  const $q = useQuasar();
  const authStore = useAuthStore();
  const productoStore = useProductoStore();

  const estado = reactive({
    inventario: {
      producto: '',
      lotes: [
        {
          vencimiento: '',
          cantidad: '',
          bloque: '',
        },
      ],
      presentacion: '',
    },
    countRetry: 0,
    currentIndex: 0,
    test: false,
    showComment: false,
    productoElegido: '',
    countInventary: 0,
    // ListInventario: [],
  });
  /**
   * FUNCIONES
   */
  const printInventory = () => {
    window.print();
  };
  const existInventary = async () => {
    // if (productoStore.ListInventario.length > 0) {
    //   $q.notify({
    //     type: 'positive',
    //     position: 'center',
    //     message: `Bienvenido, tienes inventario por hacer`,
    //     progress: true,
    //     timeout: 1500,
    //   });
    // }
    const productosMenu = await inventarioService.inventarioProductosMenu(
      authStore.negocio._id,
    );
    // console.log(entidadProductosMenu);
    //ARREGLAR NO ESTA FUNCIONANDO
    if (productosMenu)
      productosMenu.forEach((item: any) => {
        if (
          !productoStore.ListInventario.some(
            (inventario) => inventario.id === item._id,
          )
        ) {
          productoStore.ListInventario.push({
            id: item._id,
            nombre: item.nombre,
          });
        }
      });
    // console.log(productoStore.ListInventario);
    // console.log('first');
    // entidadProductosMenu.forEach((item: any) =>
    //   productoStore.ListInventario.push(item),
    // );
    // productoStore.ListInventario = [
    //   ...productoStore.ListInventario,
    //   ...entidadProductosMenu,
    // ];
  };
  const terminarInventario = async () => {
    productoStore.ListInventario = productoStore.ListInventario.filter(
      //@ts-ignore
      (item) => item.id !== estado.productoElegido.id,
    );
    // console.log(productoStore.ListInventario);
    // console.log(estado.productoElegido);

    // estado.inventario.producto = estado.productoElegido;
    // delete estado.inventario.presentacion;
    // console.log(estado.inventario);
    // estado.productoElegido = '';
    // estado.countInventary++;
    // @ts-ignore
    // console.log(authStore.negocio._id);
    // console.log(estado.productoElegido);
    // console.log(estado.inventario.lotes);
    // NotifySucess('Inventario guardado');
    // console.log(productoStore.ListInventario[currentIndex.value].producto._id);
    // console.log(estado.inventario.lotes);

    if (productoStore.ListInventario.length > 0) {
      /**LOGICA */
      showLoading();
      inventarioService
        .realizarInventario(
          authStore.negocio._id,
          //@ts-expect-error Wilder deve saber lo que hace
          estado.productoElegido.id,
          estado.inventario.lotes,
          false,
        )
        .then((res) => {
          if (
            //@ts-ignores
            res.entidadHacerInventario.diferencias?.length > 0
          ) {
            estado.countRetry++;
            // console.log(estado.countRetry);
            if (estado.countRetry > 1) {
              // console.log('first');
              showLoading();
              // console.log(authStore.negocio._id);
              // console.log(
              //   productoStore.ListInventario[estado.currentIndex].producto._id
              // );
              // console.log(estado.inventario.lotes);

              // ARREGLAR ESTA FUNCION NO SE ESTA EJECUTANDO

              // Leo : ver :
              // https://nuxt-graphql-client.web.app/getting-started/gql-functions#limitations

              inventarioService
                .realizarInventario(
                  authStore.negocio._id,
                  //@ts-expect-error Wilder deve saber lo que hace
                  estado.productoElegido.id,
                  estado.inventario.lotes,
                  true,
                )
                .then(() => {
                  NotifySucess('Inventario guardado');
                  logica();
                })
                .finally(() => {
                  hideLoading();
                });
            } else {
              NotifyError('Hay diferencias, vuelva a hacer el inventario');
            }
          } else {
            inventarioService
              .realizarInventario(
                authStore.negocio._id, //@ts-ignore
                estado.productoElegido.id,
                estado.inventario.lotes,
                true,
              )
              .then((res) => {
                NotifySucess('Inventario guardado');
                logica();
              })
              .finally(() => {
                hideLoading();
              });
          }
        })
        .finally(() => {
          hideLoading();
        });
    }
    // console.log(productoStore.ListInventarioPDF);
  };
  const logica = () => {
    estado.inventario.producto =
      //@ts-ignore
      productoStore.ListInventario[estado.currentIndex].producto.nombre;
    //@ts-ignore
    productoStore.ListInventarioPDF.push({ ...estado.inventario });
    // Eliminar el inventario actual de la lista
    productoStore.ListInventario.splice(estado.currentIndex, 1);
    estado.inventario.producto = '';
    estado.inventario.presentacion = '';

    // Incrementar el índice para pasar al siguiente inventario
    estado.currentIndex++;

    // Notificar cuando todos los inventarios han sido completados
    if (productoStore.ListInventario.length === 0) {
      $q.notify({
        type: 'positive',
        position: 'center',
        message: `Inventario terminado, puedes descansar`,
        progress: true,
        timeout: 1500,
      });
    }
    // Reiniciar el índice para comenzar de nuevo si es necesario
    estado.currentIndex = 0;
  };
  const agregarFila = () => {
    estado.inventario.lotes.push({
      vencimiento: '',
      cantidad: '',
      bloque: '',
    });
  };

  const elegirProductoInventario = (producto: any) => {
    estado.productoElegido = producto;
  };

  onMounted(() => {
    // existInventary();
    // Obtener la longitud de lotes del primer producto
    // const firstProductLotesLength = //@ts-ignore
    //   productoStore.ListInventario[0]?.lotes?.length || 0;
    // // Inicializar table.value con la longitud correspondiente
    // estado.inventario.lotes = Array.from(
    //   { length: firstProductLotesLength },
    //   () => ({
    //     vencimiento: '',
    //     cantidad: '',
    //     bloque: '',
    //   }),
    // );
  });

  return {
    estado,
    printInventory,
    terminarInventario,
    agregarFila,
    elegirProductoInventario,
  };
};
