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
    productosOpciones: [] as any[],

    // para el empaque
    resetEmpaque: null,
    nombreEmpaque: null
  });

  const submitForm = async () => {
    const ofertaModificada = await api.modificarOferta(
      {
        _id: [store.oferta._id]
      },
      {
        ingredientes: {
          reemplazar: [
            {
              tipo: 'SIMPLE',
              producto: estado.dataForm.producto,
              marca: estado.dataForm.marca,
              cantidad: estado.dataForm.cantidad
            }
          ]
        }
      }
    );
    if (ofertaModificada) {
      NotifySucessCenter('Producto modificado  correctamente');
      store.oferta = ofertaModificada;
      await store.refreshOfertas();
    }
  };

  return {
    estado,
    submitForm,
    store
  };
};
