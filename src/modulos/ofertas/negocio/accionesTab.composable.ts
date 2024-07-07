import { storeOferta } from '@/modulos/ofertas/negocio/oferta.store';
import { useQuasar } from 'quasar';
import { ofertaService } from '../API/oferta.service';
import { useAuthStore } from '@/modulos/main/negocio/useAuthStore.js';

export const useAccionesTab = () => {
  /** DECLARACIONES */
  const ofertaStore = storeOferta();
  const $q = useQuasar();
  const authStore = useAuthStore();

  /** REACTIVOS */
  const estado = reactive({
    motivoEliminacion: '' as string,
  });

  /** FUNCIONES */
  const borrarOferta = () => {
    $q.dialog({
      title: `Eliminar ${ofertaStore.oferta.nombre}`,
      message: 'No se puede deshacer.',
      cancel: true,
      persistent: true,
    }).onOk(async () => {
      console.log('first');
      ofertaService
        .borrarOferta(
          ofertaStore.oferta._id,
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

  return { estado, ofertaStore, borrarOferta };
};
