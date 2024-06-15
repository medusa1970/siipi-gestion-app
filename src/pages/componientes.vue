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
    />
  </div>

  <div>
    <p>Input textarea, value = {{ log(refTextarea) }}</p>
    <input-textarea
      label="Textarea"
      info="(una pequeña ayuda aquí)"
      @update="(v) => (refTextarea = v)"
      requerido
    />
  </div>
</template>

<script setup>
import { obligatorio, password, phone, string } from '@/helpers/validate.form';
import { ref, onMounted } from 'vue';
import { useProducts } from '@/composables/sede/useProducts';
import { columnsProductos } from '~/helpers/columns';
import { fechaMes } from '@/helpers/fecha';
import { fechaHora } from '@/helpers/fecha';
import Producto from '@/assets/img/producto.png';

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

// eventos para el modal de creacion de productos
const updateCategoria = (v) => {
  cat = 'v';
  loop: for (const cat of estado.categorias.hijas) {
    for (const subcat of cat.hijas) {
      if (v === subcat._id) {
        categoria = v;
      }
    }
  }
};

const {
  estado,
  getAllProductos,
  navegarDetalleProducto,
  modalAgregarProducto,
  borrarProducto,
  navegarCrearOferta,
  getCategoria,
  producto,
  imagen,
  imagePreview,
  crearProductoBasico,
  esEditarProducto,
  mostrarInformacionProducto,
  verImagen,
} = useProducts();

/*
Use onMounted for components that do not rely on the fetched data for their initial render.
Consider onBeforeMount if the fetched data is essential for the initial render.
Use onServerPrefetch, asyncData, or fetch in Nuxt.js for server-side rendered or statically generated pages to improve performance and SEO.
*/
onMounted(async () => {
  getAllProductos();
  await getCategoria();
  categoriaOptions.value = [];
  for (const cat of estado.categorias.hijas) {
    categoriaOptions.value.push({
      label: `${cat.nombre} (${cat.hijas.length})`,
      disable: true,
      class: 'title',
    });
    for (const subcat of cat.hijas) {
      categoriaOptions.value.push({
        label: subcat.nombre,
        value: subcat._id,
        class: 'option',
      });
    }
  }
});
</script>
