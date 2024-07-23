import { storeOferta } from '@/modulos/ofertas/ofertas.store';
import { useQuasar } from 'quasar';
import { apiOfertas } from '@/modulos/ofertas/API/ofertas.api';
import { useAuthStore } from '@/modulos/main/useAuthStore';

export const useAccionesTab = () => {
  /** DECLARACIONES */
  const store = storeOferta();
  const $q = useQuasar();
  const authStore = useAuthStore();

  /** REACTIVOS */
  const estado = reactive({
    motivoEliminacion: '' as string,
  });

  /** FUNCIONES */
  const borrarOferta = () => {
    $q.dialog({
      title: `Eliminar ${store.oferta.nombre}`,
      message: 'No se puede deshacer.',
      cancel: true,
      persistent: true,
    }).onOk(async () => {
      console.log('first');
      apiOfertas
        .borrarOfertaConMotivo(
          store.oferta._id,
          estado.motivoEliminacion,
          useGqlToken(authStore.token),
        )
        .then((res) => {
          console.log(res);
          estado.motivoEliminacion = '';
          NotifySucess('Oferta eliminado correctamente');
          // await act;
        });
    });
  };

  return { estado, store, borrarOferta };
};
