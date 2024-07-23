<template>
  <!-- @vue-ignore -->
  <formOfertaBasico
    v-show="store.oferta"
    :edicion="store.oferta"
    :key="store.oferta"
    @modificarObjeto="handleOfertaModificada"
  />
</template>

<script setup>
import formOfertaBasico from '@/modulos/ofertas/forms/formOfertaBasico.vue';
import { useDatosBasicosTab } from './datosBasicosTab.composable';
const { store, handleOfertaModificada } = useDatosBasicosTab();
</script>
