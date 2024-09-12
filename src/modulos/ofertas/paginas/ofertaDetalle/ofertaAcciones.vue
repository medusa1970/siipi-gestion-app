<template>
  <div>
    <p>Indica el motivo por cual desea borrar esta oferta:</p>

    <!-- Comentario -->
    <div class="flex" style="justify-content: space-between; margin: 15px 0">
      <div style="flex-grow: 1">
        <input-text
          tipo="textarea"
          label="Motivo"
          @update="v => (estado.motivoEliminacion = v as string)"
          info="El jefe de logistica recibira una notificacion cuando elimines una oferta"
          requerido />
      </div>
    </div>
    <q-btn
      color="primary"
      label="Confirmar"
      :disable="estado.motivoEliminacion === ''"
      no-caps
      @click="borrarOferta()" />
  </div>
</template>

<script setup lang="ts">
import { useOfertas } from '~/modulos/ofertas/ofertas.composable';
const { store, router, ofertaIncompleta } = useOfertas();

const props = defineProps({
  ofertaCorriente: null
});

const estado = reactive({
  motivoEliminacion: '' as string
});

const $q = useQuasar();
const borrarOferta = () => {
  $q.dialog({
    title: `Eliminar ${props.ofertaCorriente.nombre}`,
    message: 'No se puede deshacer.',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    // borramos el producto
    try {
      await borrarUno(GqlBorrarOfertas, {
        busqueda: props.ofertaCorriente._id
      });
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
          producto: props.ofertaCorriente._id,
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
    store.ofertas = store.ofertas.filter(
      p => p._id !== props.ofertaCorriente._id
    );
    store.ofertas = null;
    goTo(router, 'ofertas', { area: store.catalogoParaVolver });
  });
};
</script>
