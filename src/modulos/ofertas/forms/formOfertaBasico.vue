<template>
  <q-form @submit="formSubmit">
    <!-- nombre -->
    <input-text
      label="Nombre"
      info="Info #40"
      :porDefecto="estado.dataForm.nombre"
      @update="v => (estado.dataForm.nombre = v)"
      requerido />

    <!-- abreviacion -->
    <input-text
      label="Abreviacion"
      info="Info #41"
      :porDefecto="estado.dataForm.abreviacion"
      @update="v => (estado.dataForm.abreviacion = v)"
      requerido
      :maxLength="30" />

    <!-- descripcion -->
    <input-text
      label="Descripcion"
      info="Info #42"
      autogrow
      :porDefecto="estado.dataForm.descripcion"
      @update="v => (estado.dataForm.descripcion = v)" />

    <!-- Catalogo -->
    <input-select
      label="Catalogo"
      info="Info #43"
      :opciones="selectCatalogo"
      @callback="fn => (set.cat = fn)"
      @update="v => (estado.catalogoAncestro = v)"
      requerido />

    <input-select
      label="Sub catalogo"
      info="Info #44"
      :opciones="selectSubCatalogo"
      @callback="fn => (set.subCat = fn)"
      @update="v => (estado.dataForm.catalogo = v)"
      requerido />

    <!-- Imagen -->
    <input-image
      label="Imagen"
      info="Info #45"
      icono="photo_camera"
      :dataPreview="estado.imagenPreview"
      :key="estado.imagenPreview"
      @update="
        (base64Data, mimetype) =>
          (estado.dataForm.imagen = base64Data
            ? { data: base64Data, mimetype: mimetype }
            : null)
      " />

    <h3>Producto solicitable</h3>
    <div class="">
      <q-checkbox v-model="estado.dataForm.solicitable">
        Este producto se tiene que preparar produccion</q-checkbox
      >
    </div>

    <input-select
      label="Area"
      info="Info #44"
      :opciones="[
        { label: 'Panaderia', value: 'PANADERIA' },
        { label: 'Reposteria', value: 'REPOSTERIA' },
        { label: 'Envasados', value: 'ENVASADOS' },
        { label: 'Embotellados', value: 'EMBOTELLADOS' },
        { label: 'Siinple', value: 'SIINPLE' }
      ]"
      :porDefecto="estado.dataForm.tags?.[0]"
      @update="v => (estado.dataForm.tags = v != null ? [v] : [])" />

    <!-- Submit -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import type { Oferta } from '#gql';
import { useOfertas } from '@/modulos/ofertas/ofertas.composable';
import { UrlToBase64Image } from '~/components/input/input.service';
const { store, ofertaAbreviacion } = useOfertas();

// definicion de los emits
const emits = defineEmits(['crearObjeto', 'modificarObjeto']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    catalogo?: string;
    edicion?: Oferta; // edicion si producto no es null, sino creacion
  }>(),
  {
    catalogo: null,
    edicion: null
  }
);

// datos por defecto del formulario
const initForm = {
  nombre: props.edicion?.nombre,
  catalogo: props.edicion?.catalogo._id,
  abreviacion: props.edicion?.abreviacion,
  descripcion: props.edicion?.descripcion,
  solicitable: props.edicion?.solicitable,
  tags: props.edicion?.tags ?? [],
  imagen: null
};

// definicion del estado
const estado = reactive({
  dataForm: clone(initForm),
  catalogoAncestro: null as string, // catalogo seleccionado (solo el subcat va en el form)
  catalogoOpciones: [],
  subCatalogoOpciones: [],
  imagenPreview: null,
  watchCatalogo: props.edicion?.catalogo._id
});

// callbacks pour les inputs
const set = reactive({
  cat: null,
  subCat: null
});

// opciones
const selectCatalogo = computed(() => {
  if (!store.catalogoArbol) return [];
  let options = [];
  for (const cat of store.catalogoArbol.hijas) {
    if (cat.nombre !== 'CATALOGO PROVEEDORES')
      options.push({
        label: cat.nombre,
        value: cat._id
      });
    options = [...options];
  }
  return options;
});

// opciones
const selectSubCatalogo = computed(() => {
  const catalogo = store.getOne(estado.catalogoAncestro);
  if (!catalogo) return [];
  let options = [];
  for (const cat of catalogo.hijas) {
    const idsHijas = [];
    const hijas = [];
    for (const subcat of cat.hijas) {
      hijas.push({
        label: subcat.nombre,
        value: subcat._id,
        class: 'option'
      });
      idsHijas.push(subcat._id);
    }
    if (cat.nombre !== 'CATALOGO PROVEEDORES')
      options.push({
        label: cat.nombre,
        value: cat._id,
        disable: false,
        class: 'title'
      });
    options = [...options, ...hijas];
  }
  return options;
});

// Inicializaciones
onMounted(async () => {
  const arbol = await store.getCatalogoArbol();

  // catalogo por defecto para agregar nueva oferta segun el catalogo corriente
  if (props.catalogo) {
    set.cat(props.catalogo);
  }

  // catalogo en edicion
  if (props.edicion) {
    const f = (id, catalogo) => {
      return (
        catalogo._id === id ||
        (catalogo.hijas &&
          catalogo.hijas.reduce((res, cat) => f(id, cat) || res, false))
      );
    };
    for (const catalogo of arbol.hijas) {
      if (f(props.edicion?.catalogo?._id, catalogo)) {
        estado.catalogoAncestro = catalogo._id;
      }
    }
    set.cat(estado.catalogoAncestro);
    set.subCat(props.edicion.catalogo._id);
  }

  // reinicializar sub catalogo cuando catalogo cambia
  watch(
    () => estado.catalogoAncestro,
    () => set.subCat(null),
    { immediate: false }
  );

  // recuperamos la imagen desde la url
  if (props.edicion?.imagen?.cloudinaryUrl) {
    await UrlToBase64Image(props.edicion.imagen.cloudinaryUrl, base64Data => {
      estado.imagenPreview = base64Data;
    });
  } else {
    estado.imagenPreview = null;
  }
});

// submision del formulario
const formSubmit = async () => {
  if (!estado.dataForm.imagen) {
    delete estado.dataForm.imagen;
  }
  try {
    // Modo edicion
    if (props.edicion) {
      estado.dataForm.tags = {
        reemplazar: estado.dataForm.tags
      };
      const oferta = await api.modificarOferta(
        props.edicion._id,
        estado.dataForm,
        { loading: true }
      );
      emits('modificarObjeto', oferta);
    } else {
      console.log(estado.dataForm);
      const oferta = await api.crearOferta(estado.dataForm, { loading: true });
      emits('crearObjeto', oferta);
    }
  } catch (err) {
    errFailback(err);
    return;
  }
  await store.refreshOfertas();
  estado.dataForm = clone(initForm);
};
</script>
