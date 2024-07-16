<template>
  <q-form @submit="formSubmit">
    <!-- nombre -->
    <input-text2
      label="Nombre"
      :porDefecto="estado.dataForm.nombre"
      @update="(v) => (estado.dataForm.nombre = v)"
      :rules="[useRules.requerido()]"
      :error="estado.errorNombre"
    />
    <!-- Imagen -->
    <input-image2
      label="Imagen"
      info="Logo de la marca."
      :dataPreview="estado.imagenPreview"
      :key="estado.imagenPreview"
      @update="
        (base64Data, mimetype) =>
          (estado.dataForm.imagen = base64Data
            ? { data: base64Data, mimetype: mimetype }
            : null)
      "
      icono="photo_camera"
    />
    <!-- Submit -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import type { Marca } from '#gql';
import { UrlToBase64Image } from '~/components/input/input.service';
import type { SelectOpcion } from '~/components/input/select.interface';
// import { useAlmacen } from '~/modulos2/almacen/almacen.composable';
// const { actProductosDB } = useAlmacen();
// const { $socket } = useNuxtApp();

// definicion de los emits
const emits = defineEmits(['crearObjeto', 'modificarObjeto']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    edicion: Marca | null; // edicion si null, sino creacion
  }>(),
  {
    edicion: null,
  },
);

// datos por defecto del formulario
const initForm = {
  nombre: props.edicion?.nombre ?? '',
  imagen: null,
};

// definicion del estado
const estado = reactive({
  // valor de los inputs
  dataForm: clone(initForm),
  //mensajes de error del formulario
  errorNombre: '',
  // preview de la imagen en el input
  imagenPreview: null,
});

//
onMounted(async () => {
  // recuperamos la imagen desde la url
  if (props.edicion.imagen?.cloudinaryUrl) {
    await UrlToBase64Image(
      props.edicion.imagen?.cloudinaryUrl,
      (base64Data) => {
        estado.imagenPreview = base64Data;
      },
    );
  } else {
    estado.imagenPreview = null;
  }
});

// submision del formulario
const formSubmit = async () => {
  try {
    // Modo edicion
    if (props.edicion) {
      // lanzamos la consulta
      const marca = await api.modificarMarca(
        props.edicion._id,
        estado.dataForm,
      );
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits('modificarObjeto', marca);
    }
    // Modo creacion
    else {
      // lanzamos la consulta
      const marca = await api.crearMarca(estado.dataForm);
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits('crearObjeto', marca, {
        selectValor: marca._id,
        selectCallback: (listaOpciones: SelectOpcion[]): SelectOpcion[] => [
          ...listaOpciones,
          { label: marca.nombre, value: marca._id },
        ],
      });
    }
  } catch (err) {
    if (isApiBadRequest(err, 'duplicado')) {
      estado.errorNombre = 'Ya existe una marca con este nombre';
      return;
    }
    errFallBack(err);
    return;
  }
};
</script>
