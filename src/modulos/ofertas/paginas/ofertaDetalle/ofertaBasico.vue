<template>
  <!-- @vue-ignore -->
  <formOfertaBasico
    v-show="ofertaParaMostrar"
    :edicion="ofertaParaMostrar"
    :key="ofertaParaMostrar"
    @modificarObjeto="handleOfertaModificada" />
</template>

<script setup>
import formOfertaBasico from '@/modulos/ofertas/forms/formOfertaBasico.vue';
const props = defineProps({
  ofertaCorriente: null
});
const ofertaParaMostrar = ref(props.ofertaCorriente);
const handleOfertaModificada = oferta => {
  NotifySucessCenter('Oferta modificada correctamente');
  ofertaParaMostrar.value = oferta;
};
</script>
