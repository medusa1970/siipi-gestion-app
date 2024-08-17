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
        await api.borrarOferta(store.oferta._id);
      } catch (err) {
        errFailback(err);
        return;
      }
      await store.refreshOfertas();

      // creamos la accion
      try {
        await api.crearAccion(
          {
            comentario: estado.motivoEliminacion,
            producto: store.oferta._id,
            accion: 'borrado'
            // la persona va con el token
          },
          {
            aceptarInexistentes: true
          },
          useGqlToken(authStore.token)
        );
      } catch (err) {
        errFailback(err);
        return;
      }

      // esta todo ok
      NotifySucessCenter('Iferta eliminada correctamente');
      estado.motivoEliminacion = '';
      store.ofertas = store.ofertas.filter(p => p._id !== store.oferta._id);
      store.ofertas = null;
      goTo(router, 'ofertas', { id: store.catalogoRaiz.id });
    });
  };

  return { estado, store, borrarOferta };
};
