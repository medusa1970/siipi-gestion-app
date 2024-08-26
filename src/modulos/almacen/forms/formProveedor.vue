<template>
  <q-form @submit="formSubmit">
    <!-- nombre -->
    <input-text
      label="Nombre"
      info="Info #15"
      :porDefecto="estado.dataForm.nombre"
      @update="v => (estado.dataForm.nombre = v)"
      requerido
      :error="estado.errorNombre" />
    <!--<input-select
      label="Catalogo"
      info="Info #44"
      :opciones="selectCatalogo"
      @update="v => (estado.dataForm.catalogoId = v)" />
  -->
    <!-- descripcion -->
    <input-text
      label="Descripcion"
      tipo="textarea"
      info="Info #16"
      :porDefecto="estado.dataForm.descripcion"
      @update="v => (estado.dataForm.descripcion = v)" />
    <!-- Imagen -->
    <input-image
      label="Imagen"
      info="Info #17"
      :dataPreview="estado.imagenPreview"
      :key="estado.imagenPreview"
      @update="
        (base64Data, mimetype) =>
          (estado.dataForm.imagen = base64Data
            ? { data: base64Data, mimetype: mimetype }
            : null)
      "
      icono="photo_camera" />
    <!-- Submit -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import type { Catalogo } from '#gql';
import type { Entidad } from '#gql';
import { UrlToBase64Image } from '~/components/input/input.service';
import type { SelectOpcion } from '~/components/input/select.interface';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
import { areaInfo } from '~/modulos/ofertas/oferta.definicion';
const { store } = useAlmacen();
import { useOfertas } from '~/modulos/ofertas/ofertas.composable';
const { store: storeOferta } = useOfertas();

// definicion de los emits
const emits = defineEmits(['crearObjeto', 'modificarObjeto']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    edicion?: Entidad;
  }>(),
  {
    edicion: null
  }
);

// datos por defecto del formulario
const initForm = {
  tipo: 'PROVEEDOR',
  nombre: props.edicion?.nombre,
  descripcion: props.edicion?.descripcion,
  imagen: null,
  catalogoId: null
};

// definicion del estado
const estado = reactive({
  dataForm: clone(initForm),
  nombreOriginal: props.edicion?.nombre,
  errorNombre: '',
  imagenPreview: null
});

// Inicializaciones
onMounted(async () => {
  cata.value = await buscarUno(GqlCatalogoArbol, {
    busqueda: areaInfo.proveedores.catalogo,
    opciones: { limit: 0 }
  });
  // recuperamos la imagen desde la url
  if (props.edicion?.imagen?.cloudinaryUrl) {
    await UrlToBase64Image(props.edicion.imagen.cloudinaryUrl, base64Data => {
      estado.imagenPreview = base64Data;
    });
  } else {
    estado.imagenPreview = null;
  }
});

const cata = ref<Catalogo>(null);
const selectCatalogo = computed(() => {
  if (!cata.value) return [];
  let options = [];
  for (const cat of cata.value.hijas) {
    options.push({
      label: cat.nombre,
      value: cat._id,
      disable: true
    } as SelectOpcion);
    for (const cat2 of cat.hijas ?? []) {
      options.push({
        label: '__ ' + cat2.nombre,
        value: cat2._id
      } as SelectOpcion);
    }
  }
  return options;
});

// submision del formulario
const formSubmit = async () => {
  if (!estado.dataForm.imagen) {
    delete estado.dataForm.imagen;
  }
  try {
    // Modo edicion
    if (props.edicion) {
      const proveedor = await modificarUno(GqlModificarEntidades_basico, {
        busqueda: props.edicion._id,
        datos: estado.dataForm
      });
      emits('modificarObjeto', proveedor);
    }
    // Modo creacion
    else {
      const proveedor = await crearUno(GqlCrearEntidades_basico, {
        datos: estado.dataForm
      });
      emits('crearObjeto', proveedor);
    }
  } catch (err) {
    if (isApiBadRequest(err, 'duplicado')) {
      estado.errorNombre = 'Ya existe un proveedor con este nombre';
      return;
    }
    errFailback(err);
    return;
  }
  await store.refreshProveedores();
  estado.dataForm = clone(initForm);
};
</script>
