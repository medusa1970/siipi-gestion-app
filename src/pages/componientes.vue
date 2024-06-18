<template>
  <div>
    <p>Input text, value = {{ log(refText) }}</p>
    <input-text
      label="Texto"
      info="(una pequeña ayuda aquí)"
      @update="(v) => (refText = v)"
      requerido
    />
  </div>

  <div>
    <p>Input number, value = {{ log(refNumber) }}</p>
    <input-number
      label="Number"
      info="(una pequeña ayuda aquí)"
      @update="(v) => (refNumber = v)"
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
      requerido
      icono="photo_camera"
      maxSizeKb="20"
    />
  </div>

  <div>
    <p>Input textarea, value = {{ log(refTextarea) }}</p>
    <input-textarea
      labeproductoServicel="Textarea"
      info="(una pequeña ayuda aquí)"
      @update="(v) => (refTextarea = v)"
      requerido
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { columnsProductos } from '~/helpers/columns';
import Producto from '@/assets/img/producto.png';
import { useProducto } from '~/composables/producto/useProducto';
import { useProductoStore } from '~/composables/producto/useProductoStore';

const productoService = useProducto();
const productoStore = useProductoStore();

definePageMeta({
  layout: 'cathering',
});

const categoriaOptions = ref([]);
const log = (val) => (val === null ? 'null' : val === '' ? "''" : val);
const log64 = (val) => (val === null ? 'null' : val === '' ? "''" : '<data>');
const refText = ref(null);
const refSelect = ref(null);
const refNumber = ref(0);
const refImage64 = ref(null);
const refTextarea = ref(null);

/*
Use onMounted for components that do not rely on the fetched data for their initial render.
Consider onBeforeMount if the fetched data is essential for the initial render.
Use onServerPrefetch, asyncData, or fetch in Nuxt.js for server-side rendered or statically generated pages to improve performance and SEO.
*/
onMounted(async () => {
  categoriaOptions.value = await productoService.categoriaSelectOptions();
});
</script>
