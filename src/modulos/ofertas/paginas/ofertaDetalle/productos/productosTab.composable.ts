import type { Producto } from '#gql';
import { useOfertas } from '~/modulos/ofertas/ofertas.composable';

export const useProductoTab = () => {
  const { store } = useOfertas();

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
    let ofertaModificada;
    try {
      ofertaModificada = await modificarUno(GqlModificarOfertas, {
        busqueda: {
          _id: [store.oferta._id]
        },
        datos: {
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
      });
    } catch (err) {
      NotifyError('Se produjo un error');
      errFailback(err);
      return false;
    }
    NotifySucessCenter('Producto modificado correctamente');
    store.oferta = ofertaModificada;
    await store.refreshOfertas();
  };

  return {
    estado,
    submitForm,
    store
  };
};
