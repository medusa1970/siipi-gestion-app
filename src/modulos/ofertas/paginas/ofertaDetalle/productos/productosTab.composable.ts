import type { Producto } from '#gql';
import { apiOfertas } from '@/modulos/ofertas/API/ofertas.api';
import { storeOferta } from '@/modulos/ofertas/ofertas.store.js';

export const useProductoTab = () => {
  const store = storeOferta();

  // datos por defecto del formulario
  const initForm = {
    producto: null as string,
    marca: null as string,
    cantidad: null as number,
  };

  const estado = reactive({
    dataForm: clone(initForm),
    productosOpciones: [] as any[],
  });

  const submitForm = async () => {
    const ofertaModificada = await api.modificarOferta(
      {
        _id: [store.oferta._id],
      },
      {
        ingredientes: {
          reemplazar: [
            {
              tipo: 'SIMPLE',
              producto: estado.dataForm.producto._id,
              marca: estado.dataForm.marca._id,
              cantidad: estado.dataForm.cantidad,
            },
          ],
        },
      },
    );
    if (ofertaModificada) {
      NotifySucessCenter('Producto modificado  correctamente');
      store.oferta = ofertaModificada;
    }
  };

  return {
    estado,
    submitForm,
    store,
  };
};
