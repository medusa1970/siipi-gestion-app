/**
 * IMPORTS
 */
import { ref, reactive, onMounted } from 'vue';
import { Inventarios } from '@/mocks/data.json';
import { productStore, type InventarioProps } from '@/stores/producto.store';
import {
  NotifyError,
  NotifySucess,
  hideLoading,
  showLoading,
} from '~/helpers/message.service';
import { useQuasar } from 'quasar';
import { authStore } from '~/stores/auth.store';
import { inventarioService } from '~/services/inventary.service';
/**
 * LOGICA
 */
export const useInventary = () => {
  const useAuth = authStore();
  const $q = useQuasar();
  const useProduct = productStore();

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
    // if (useProduct.ListInventario.length > 0) {
    //   $q.notify({
    //     type: 'positive',
    //     position: 'center',
    //     message: `Bienvenido, tienes inventario por hacer`,
    //     progress: true,
    //     timeout: 1500,
    //   });
    // }
    const productosMenu = await inventarioService.inventarioProductosMenu(
      useAuth.negocioElegido._id,
    );
    // console.log(entidadProductosMenu);
    //ARREGLAR NO ESTA FUNCIONANDO
    if (productosMenu)
      productosMenu.forEach((item: any) => {
        if (
          !useProduct.ListInventario.some(
            (inventario) => inventario.id === item._id,
          )
        ) {
          useProduct.ListInventario.push({ id: item._id, nombre: item.nombre });
        }
      });
    // console.log(useProduct.ListInventario);
    // console.log('first');
    // entidadProductosMenu.forEach((item: any) =>
    //   useProduct.ListInventario.push(item),
    // );
    // useProduct.ListInventario = [
    //   ...useProduct.ListInventario,
    //   ...entidadProductosMenu,
    // ];
  };
  const terminarInventario = async () => {
    useProduct.ListInventario = useProduct.ListInventario.filter(
      //@ts-ignore
      (item) => item.id !== estado.productoElegido.id,
    );
    // console.log(useProduct.ListInventario);
    // console.log(estado.productoElegido);

    // estado.inventario.producto = estado.productoElegido;
    // delete estado.inventario.presentacion;
    // console.log(estado.inventario);
    // estado.productoElegido = '';
    // estado.countInventary++;
    // @ts-ignore
    // console.log(useAuth.negocioElegido._id);
    // console.log(estado.productoElegido);
    // console.log(estado.inventario.lotes);
    // NotifySucess('Inventario guardado');
    // console.log(useProduct.ListInventario[currentIndex.value].producto._id);
    // console.log(estado.inventario.lotes);

    if (useProduct.ListInventario.length > 0) {
      /**LOGICA */
      showLoading();
      inventarioService
        .realizarInventario(
          useAuth.negocioElegido._id,
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
              // console.log(useAuth.negocioElegido._id);
              // console.log(
              //   useProduct.ListInventario[estado.currentIndex].producto._id
              // );
              // console.log(estado.inventario.lotes);

              // ARREGLAR ESTA FUNCION NO SE ESTA EJECUTANDO

              // Leo : ver :
              // https://nuxt-graphql-client.web.app/getting-started/gql-functions#limitations

              inventarioService
                .realizarInventario(
                  useAuth.negocioElegido._id,
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
                useAuth.negocioElegido._id, //@ts-ignore
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
    // console.log(useProduct.ListInventarioPDF);
  };
  const logica = () => {
    estado.inventario.producto =
      //@ts-ignore
      useProduct.ListInventario[estado.currentIndex].producto.nombre;
    //@ts-ignore
    useProduct.ListInventarioPDF.push({ ...estado.inventario });
    // Eliminar el inventario actual de la lista
    useProduct.ListInventario.splice(estado.currentIndex, 1);
    estado.inventario.producto = '';
    estado.inventario.presentacion = '';

    // Incrementar el índice para pasar al siguiente inventario
    estado.currentIndex++;

    // Notificar cuando todos los inventarios han sido completados
    if (useProduct.ListInventario.length === 0) {
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
    //   useProduct.ListInventario[0]?.lotes?.length || 0;
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
    useProduct,
    elegirProductoInventario,
  };
};
