<template>
  <!-- @vue-ignore -->
  <formOfertaBasico
    v-show="ofertaCorriente"
    :edicion="ofertaCorriente"
    :key="ofertaCorriente"
    @modificarObjeto="handleOfertaModificada" />
</template>

<script setup>
import formOfertaBasico from '@/modulos/ofertas/forms/formOfertaBasico.vue';
const props = defineProps({
  ofertaCorriente: null
});
const handleOfertaModificada = oferta => {
  NotifySucessCenter('Oferta modificada correctamente');
  // store.ofertas.oferta = oferta ?
};
</script>
