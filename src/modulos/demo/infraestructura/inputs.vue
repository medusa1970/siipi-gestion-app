<template>
  <!--
   
   <q-form @submit="formSubmit">
    <input-text
      tipo="j"
      label="Texto 1"
      @update="(v) => (refText = v)"
      :porDefecto="refText"
      :rules="[useRules.requerido(), NoMasita2]"
      dense="false"
    />

    <input-text
      label="Texto igual"
      @update="(v) => (refText2 = v)"
      :porDefecto="refText2"
      :rules="[refText2_rule]"
    />

    <input-image
      label="Imagen"
      @update="onImageChange"
      icono="photo_camera"
      maxSizeKb="200"
      :rules="[]"
      dataPreview="data:image/png;base64,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"
    />
    <input-select
    label="Categoria"
    :opciones="categoriaOptions"
    :porDefecto="refSelect"
    @update="(v) => (refSelect = v)"
    :rules="[useRules.requerido(), NoMasita]"
    :dialog="componienteAgregar"
    />
    
    <q-btn label="submit" type="submit" />
  </q-form>
  
  <q-img :src="imagen" style="width: 50px" />
--></template>

<script setup>
/*definePageMeta({
  layout: 'inicio',
});
import comp from '~/modulos/main/infraestructura/componientes/agregarCategoria.vue';
import { useProducto } from '~/modulos/productos/negocio/producto.composable';
const productoService = useProducto();

// input-image
function onImageChange(data, archivo, isPreview) {
  if (!isPreview && archivo !== null) {
    refImage64.value = archivo;
    imagen.value = data;
  } else {
    refImage64.value = null;
    imagen.value = null;
  }
}

// input-select
const categoriaOptions = ref(null);
const refSelect = ref(null);
const componienteAgregar = ref(comp);
const imagen = ref(null);
const refImage64 = ref(null);
const refText = ref('init');
const refText2 = ref(null);
const refText2_rule = (val) => {
  return val !== refText.value ? 'Debe ser lo mismo que input text 1' : true;
};
const NoMasita = (val) => {
  return val === '65c7ce11ce1b515075092db9' ? 'No puede ser una masita' : true;
};
const NoMasita2 = (val) => {
  return val === 'masita' ? 'No puede ser una masita' : true;
};

onMounted(async () => {
  categoriaOptions.value = await productoService.categoriaSelectOptions(true);
  //   let prods;
  //   prods = await loadingAsync(async () => {
  //     await productoApiService.buscarProductos();
  //     await productoApiService.buscarProductos();
  //     await productoApiService.buscarProductos();
  //     await productoApiService.buscarProductos();
  //     await productoApiService.buscarProductos();
  //     return await productoApiService.buscarProductos();
  //   });
});*/
</script>
