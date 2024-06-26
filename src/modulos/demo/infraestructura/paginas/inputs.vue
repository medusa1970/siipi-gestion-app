<template>
  <q-form @submit="formSubmit">
    <p>Input image, value = {{ log64(refImage64) }}</p>
    <input-image
      label="Imagen"
      info="(una pequeña ayuda aquí)"
      @update="(v) => (refImage64 = v)"
      :default="refImage64"
      icono="photo_camera"
      maxSizeKb="2000"
      :rules="[useRules.requerido]"
      clearable
    />

    <p>Input select, value = {{ log(refSelect) }}</p>
    <input-dropdown
      label="Categoria"
      :options="categoriaOptions"
      info="(una pequeña ayuda aquí)"
      @update="(v) => (refSelect = v)"
      :rules="[useRules.requerido, NoMasita]"
      :default="refSelect"
      dense
      clearable
    />

    <p>Input text, value = {{ log(refText) }}</p>
    <input-text
      tipo="textarea"
      label="Texto 1"
      @update="(v) => (refText = v)"
      :default="refText"
      :rules="[useRules.requerido, NoMasita2]"
      dense
      clearable
    />

    <p>Input text, value = {{ log(refText2) }}</p>
    <input-text
      label="Texto igual"
      info="(una pequeña ayuda aquí)"
      @update="(v) => (refText2 = v)"
      :default="refText2"
      :rules="[refText2_rule]"
      dense
    />

    <q-btn label="submit" type="submit" />
  </q-form>
</template>

<script setup>
import { onMounted } from 'vue';
import { useProductoService } from '~/modulos/productos/negocio/useProductoService';
const productoService = useProductoService();

definePageMeta({
  layout: 'inicio',
});

const log = (val) => (val === null ? 'null' : val === '' ? "''" : val);
const log64 = (val) => (val === null ? 'null' : val === '' ? "''" : '<data>');

// select
const categoriaOptions = ref(await productoService.categoriaSelectOptions());
const refSelect = ref(null);

// number, image, textarea
const refNumber = ref(null);
const refImage64 = ref(null);
const refTextarea = ref(null);

// campos de texto, deben ser iguales
const refText = ref(null);
const refText2 = ref(null);
const refText2_rule = (val) => {
  return val !== refText.value ? 'Debe ser lo mismo que input text 1' : true;
};
const NoMasita = (val) => {
  return val.value === '65c7ce11ce1b515075092db9'
    ? 'No puede ser una masita'
    : true;
};
const NoMasita2 = (val) => {
  return val === 'masita' ? 'No puede ser una masita' : true;
};

// para pasar un ordén de validación a los inputs
const formSubmit = () => {};

/*
Use onMounted for components that do not rely on the fetched data for their initial render.
Consider onBeforeMount if the fetched data is essential for the initial render.
Use onServerPrefetch, asyncData, or fetch in Nuxt.js for server-side rendered or statically generated pages to improve performance and SEO.
*/
onMounted(async () => {});

/*
<!--
Forked from:
https://quasar.dev/vue-components/input#example--input-types
-->
<div id="q-app" style="min-height: 100vh;">
<div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-input v-model="password" filled type="password" hint="Password"></q-input>

      <q-input v-model="password" filled :type="isPwd ? 'password' : 'text'" hint="Password with toggle">
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          ></q-icon>
        </template>
      </q-input>

      <q-input v-model="email" filled type="email" hint="Email"></q-input>

      <q-input v-model="search" filled type="search" hint="Search">
        <template v-slot:append>
          <q-icon name="search"></q-icon>
        </template>
      </q-input>

      <q-input v-model="tel" filled type="tel" hint="Telephone number"></q-input>

      <q-input v-model="url" filled type="url" hint="URL"></q-input>

      <q-input v-model="time" filled type="time" hint="Native time"></q-input>

      <q-input v-model="date" filled type="date" hint="Native date"></q-input>
    </div>
  </div>
</div>
*/
</script>
