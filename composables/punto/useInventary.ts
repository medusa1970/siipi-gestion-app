/**
 * IMPORTS
 */
import { ref, reactive, onMounted } from 'vue';
import { Inventarios } from '@/mocks/data.json';
import { productStore } from '@/stores/producto.store';
import {
  NotifyError,
  NotifySucess,
  hideLoading,
  showLoading,
} from '~/helpers/message.service';
import { useQuasar } from 'quasar';
import { authStore } from '~/stores/auth.store';
import { inventarioService } from '~/services/punto/inventary.service';
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
  });
  /**
   * FUNCIONES
   */
  const printInventory = () => {
    window.print();
  };
  const existInventary = () => {
    if (useProduct.ListInventario.length > 0) {
      $q.notify({
        type: 'positive',
        position: 'center',
        message: `Bienvenido, tienes inventario por hacer`,
        progress: true,
        timeout: 1500,
      });
    }
  };
  const terminarInventario = async () => {
    useProduct.ListInventario = useProduct.ListInventario.filter(
      //@ts-ignore
      (item) => item.producto.id !== estado.productoElegido.producto.id,
    );
    NotifySucess('Inventario guardado');
    estado.productoElegido = '';
    estado.countInventary++;
    // console.log(useAuth.negocioIDSelected);
    // console.log(useProduct.ListInventario[currentIndex.value].producto._id);
    // console.log(estado.inventario.lotes);
    // if (useProduct.ListInventario.length > 0) {
    //   /**LOGICA */
    //   showLoading();
    //   inventarioService
    //     .realizarInventario(
    //       useAuth.negocioElegido._id, //@ts-ignore
    //       useProduct.ListInventario[estado.currentIndex].producto._id,
    //       estado.inventario.lotes,
    //       false
    //     )
    //     .then((res) => {
    //       if (
    //         //@ts-ignores
    //         res.entidadHacerInventario.diferencias?.length > 0
    //       ) {
    //         estado.countRetry++;
    //         console.log(estado.countRetry);
    //         if (estado.countRetry > 1) {
    //           // console.log('first');
    //           showLoading();
    //           // console.log(useAuth.negocioElegido._id);
    //           // console.log(
    //           //   useProduct.ListInventario[estado.currentIndex].producto._id
    //           // );
    //           console.log(estado.inventario.lotes);
    //           //ARREGLAR ESTA FUNCION NO SE ESTA EJECUTANDO
    //           GqlHacerInventario({
    //             entidadBusqueda: { _id: useAuth.negocioElegido._id },
    //             guardar: true,
    //             datos: {
    //               producto:
    //                 //@ts-ignore
    //                 useProduct.ListInventario[estado.currentIndex].producto._id, //@ts-ignore
    //               lotes: estado.inventario.lotes,
    //               reporte: 'se hizo'
    //             }
    //           })
    //             .then(() => {
    //               NotifySucess('Inventario guardado');
    //               logica();
    //             })
    //             .finally(() => {
    //               hideLoading();
    //             });
    //         } else {
    //           NotifyError('Hay diferencias, vuelva a hacer el inventario');
    //         }
    //       } else {
    //         inventarioService
    //           .realizarInventario(
    //             useAuth.negocioElegido._id, //@ts-ignore
    //             useProduct.ListInventario[estado.currentIndex].producto._id,
    //             estado.inventario.lotes,
    //             true
    //           )
    //           .then((res) => {
    //             NotifySucess('Inventario guardado');
    //             logica();
    //           })
    //           .finally(() => {
    //             hideLoading();
    //           });
    //       }
    //     })
    //     .finally(() => {
    //       hideLoading();
    //     });
    // }
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
  onMounted(() => {
    existInventary();
    // Obtener la longitud de lotes del primer producto
    const firstProductLotesLength = //@ts-ignore
      useProduct.ListInventario[0]?.lotes?.length || 0;

    // Inicializar table.value con la longitud correspondiente
    estado.inventario.lotes = Array.from(
      { length: firstProductLotesLength },
      () => ({
        vencimiento: '',
        cantidad: '',
        bloque: '',
      }),
    );
  });

  const elegirProductoInventario = (producto: any) => {
    // console.log(producto);
    estado.productoElegido = producto;
  };

  return {
    estado,
    printInventory,
    terminarInventario,
    agregarFila,
    useProduct,
    elegirProductoInventario,
  };
};
