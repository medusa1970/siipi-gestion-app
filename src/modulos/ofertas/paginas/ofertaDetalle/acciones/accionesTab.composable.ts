import { useOfertas } from '~/modulos/ofertas/ofertas.composable';
import { useQuasar } from 'quasar';

export const useAccionesTab = () => {
  const $q = useQuasar();
  const { store, authStore, estadoOfertas, router } = useOfertas();
  const estado = reactive({
    motivoEliminacion: '' as string
  });

  const borrarOferta = () => {
    $q.dialog({
      title: `Eliminar ${store.oferta.nombre}`,
      message: 'No se puede deshacer.',
      cancel: true,
      persistent: true
    }).onOk(async () => {
      // borramos el producto
      try {
        await borrarUno(GqlBorrarOfertas, { busqueda: store.oferta._id });
      } catch (err) {
        errFailback(err);
        return;
      }
      await store.refreshOfertas();

      // creamos la accion
      try {
        await crearUno(GqlCrearAcciones, {
          datos: {
            comentario: estado.motivoEliminacion,
            producto: store.oferta._id,
            accion: 'borrado'
          },
          opciones: {
            aceptarInexistentes: true
          }
        });
      } catch (err) {
        errFailback(err);
        return;
      }

      // esta todo ok
      NotifySucessCenter('Iferta eliminada correctamente');
      estado.motivoEliminacion = '';
      store.ofertas = store.ofertas.filter(p => p._id !== store.oferta._id);
      store.ofertas = null;
      goTo(router, 'ofertas', { id: '75a4475e446a5885b05739c4' });
    });
  };

  return { estado, store, borrarOferta };
};
