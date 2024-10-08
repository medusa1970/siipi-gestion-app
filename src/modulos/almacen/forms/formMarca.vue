<template>
  <q-form @submit="formSubmit">
    <!-- nombre -->
    <input-text
      label="Nombre"
      info="Info #8"
      :porDefecto="estado.dataForm.nombre"
      @update="v => (estado.dataForm.nombre = v)"
      requerido
      :error="estado.errorNombre" />
    <!-- descripcion -->
    <input-text
      label="Descripcion"
      tipo="textarea"
      info="Info #9"
      :porDefecto="estado.dataForm.descripcion"
      @update="v => (estado.dataForm.descripcion = v)" />
    <!-- Imagen -->
    <input-image
      label="Imagen"
      info="Info #10"
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
import type { Marca } from '#gql';
import { UrlToBase64Image } from '~/components/input/input.service';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
const { store } = useAlmacen();

// definicion de los emits
const emits = defineEmits(['crearObjeto', 'modificarObjeto']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    edicion?: Marca;
  }>(),
  {
    edicion: null
  }
);

// datos por defecto del formulario
const initForm = {
  nombre: props.edicion?.nombre,
  descripcion: props.edicion?.descripcion,
  imagen: null
};

// definicion del estado
const estado = reactive({
  // valor de los inputs
  dataForm: clone(initForm),
  //mensajes de error del formulario
  errorNombre: '',
  // preview de la imagen en el input
  imagenPreview: null
});

// Inicializaciones
onMounted(async () => {
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
    if (props.edicion) {
      const marca = await modificarUno(GqlModificarMarcas, {
        busqueda: props.edicion._id,
        datos: estado.dataForm
      });
      emits('modificarObjeto', marca);
    } else {
      const marca = await crearUno(GqlCrearMarcas, { datos: estado.dataForm });
      emits('crearObjeto', marca);
    }
  } catch (err) {
    if (isApiBadRequest(err, 'duplicado')) {
      estado.errorNombre = 'Ya existe una marca con este nombre';
      return;
    }
    errFailback(err);
    return;
  }
  // reinicializamos el formulario
  await store.refreshMarcas();
  estado.dataForm = clone(initForm);
};
</script>
