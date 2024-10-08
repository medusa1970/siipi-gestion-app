<template>
  <q-form @submit="formSubmit">
    <!-- nombre -->
    <input-text
      label="Nombre"
      :porDefecto="estado.dataForm.nombre"
      info="Info #12"
      @update="v => (estado.dataForm.nombre = v)"
      requerido
      :error="estado.errorNombre" />
    <!-- abreviacion -->
    <input-text
      label="Abreviacion"
      info="Info #13"
      :porDefecto="estado.dataForm.abreviacion"
      @update="v => (estado.dataForm.abreviacion = v)"
      requerido
      :error="estado.errorAbreviacion" />
    <!-- Imagen -->
    <input-image
      label="Imagen"
      info="Info #14"
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
import type { Medida } from '#gql';
import { UrlToBase64Image } from '~/components/input/input.service';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
const { store } = useAlmacen();

// definicion de los emits
const emits = defineEmits(['crearObjeto', 'modificarObjeto']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    edicion?: Medida;
  }>(),
  {
    edicion: null
  }
);

// datos por defecto del formulario
const initForm = {
  nombre: props.edicion?.nombre,
  abreviacion: props.edicion?.abreviacion,
  imagen: null
};

// definicion del estado
const estado = reactive({
  // valor de los inputs
  dataForm: clone(initForm),
  //mensajes de error del formulario
  errorNombre: '',
  errorAbreviacion: '',
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
      const medida = await modificarUno(GqlModificarMedidas, {
        busqueda: props.edicion._id,
        datos: estado.dataForm
      });
      emits('modificarObjeto', medida);
    }
    // Modo creacion
    else {
      const medida = await await crearUno(GqlCrearMedidas, {
        datos: estado.dataForm
      });
      emits('crearObjeto', medida);
    }
  } catch (err) {
    if (isApiBadRequest(err, 'duplicado')) {
      for (const campo of err.detalle.campos) {
        const [path] = campo;
        if (ultimo(path.split('.')) === 'nombre') {
          estado.errorNombre = 'Este nombre ya esta registrado.';
        } else if (ultimo(path.split('.')) === 'abreviacion') {
          estado.errorAbreviacion = 'Esta abreviacion ya esta registrada.';
        }
      }
      return;
    }
    errFailback(err);
    return;
  }
  await store.refreshMedidas();
  estado.dataForm = clone(initForm);
};
</script>
