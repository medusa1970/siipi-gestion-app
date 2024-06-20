<template>
  <div>
    <p>Input text, value = {{ log(refText) }}</p>
    <input-text
      label="Texto"
      info="(una pequeña ayuda aquí)"
      @update="(v) => (refText = v)"
      :default="refText"
      requerido
    />
  </div>

  <div>
    <p>Input number, value = {{ log(refNumber) }}</p>
    <input-number
      label="Number"
      info="(una pequeña ayuda aquí)"
      @update="(v) => (refNumber = v)"
      :default="refNumber"
      requerido
    />
  </div>

  <div>
    <p>Input select, value = {{ log(refSelect) }}</p>
    <input-dropdown
      label="Categoria"
      :options="categoriaOptions"
      info="(una pequeña ayuda aquí)"
      @update="(v) => (refSelect = v)"
      :default="refSelect"
      requerido
      :icono="work"
    />
  </div>

  <div>
    <p>Input image, value = {{ log64(refImage64) }}</p>
    <input-image
      label="Imagen"
      info="(una pequeña ayuda aquí)"
      @update="(v) => (refImage64 = v)"
      :default="refImage64"
      requerido
      icono="photo_camera"
      maxSizeKb="20"
    />
  </div>

  <div>
    <p>Input textarea, value = {{ log(refTextarea) }}</p>
    <input-textarea
      labeproductoApiServicel="Textarea"
      info="(una pequeña ayuda aquí)"
      @update="(v) => (refTextarea = v)"
      :default="refTextarea"
      requerido
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useProductoService } from '~/modulos/productos/negocio/useProductoService';

const productoService = useProductoService();

definePageMeta({
  layout: 'cathering',
});

const categoriaOptions = ref(await productoService.categoriaSelectOptions());
const log = (val) => (val === null ? 'null' : val === '' ? "''" : val);
const log64 = (val) => (val === null ? 'null' : val === '' ? "''" : '<data>');
const refText = ref(null);
const refSelect = ref('65c7ce11ce1b515075092dbc');
const refNumber = ref(42);
const refImage64 = ref(null);
const refTextarea = ref('escribir algo');

/*
Use onMounted for components that do not rely on the fetched data for their initial render.
Consider onBeforeMount if the fetched data is essential for the initial render.
Use onServerPrefetch, asyncData, or fetch in Nuxt.js for server-side rendered or statically generated pages to improve performance and SEO.
*/
onMounted(async () => {});
</script>
