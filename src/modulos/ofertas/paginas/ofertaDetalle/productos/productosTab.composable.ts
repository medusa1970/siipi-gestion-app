import type { Producto } from '#gql';
import { useOfertas } from '~/modulos/ofertas/ofertas.composable';

export const useProductoTab = () => {
  const { store, authStore, estadoOfertas, router } = useOfertas();

  // datos por defecto del formulario
  const initForm = {
    producto: null as string,
    marca: null as string,
    cantidad: null as number
  };

  const estado = reactive({
    dataForm: clone(initForm),
    productosOpciones: [] as any[]
  });

  const submitForm = async () => {
    console.log({
      ingredientes: {
        reemplazar: [
          {
            tipo: 'SIMPLE',
            producto: estado.dataForm.producto._id,
            marca: estado.dataForm.marca._id,
            cantidad: estado.dataForm.cantidad
          }
        ]
      }
    });
    const ofertaModificada = await api.modificarOferta(
      {
        _id: [store.oferta._id]
      },
      {
        ingredientes: {
          reemplazar: [
            {
              tipo: 'SIMPLE',
              producto: estado.dataForm.producto._id,
              marca: estado.dataForm.marca._id,
              cantidad: estado.dataForm.cantidad
            }
          ]
        }
      }
    );
    if (ofertaModificada) {
      NotifySucessCenter('Producto modificado  correctamente');
      store.oferta = ofertaModificada;
    }
  };

  return {
    estado,
    submitForm,
    store
  };
};
