<template>
  <q-form @submit="formSubmit">
    <!-- nombre -->
    <input-text2
      label="Nombre"
      info="Info."
      :porDefecto="estado.dataForm.nombre"
      @update="(v) => (estado.dataForm.nombre = v)"
      :rules="[useRules.requerido()]"
      :error="estado.errorNombre"
    />
    <!-- descripcion -->
    <input-text2
      label="Descripcion"
      tipo="textarea"
      info="Info."
      :porDefecto="estado.dataForm.descripcion"
      @update="(v) => (estado.dataForm.descripcion = v)"
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
import type { Entidad } from '#gql';
import type { SelectOpcion } from '~/components/input/select.interface';
import { UrlToBase64Image } from '~/components/input/input.service';

// definicion de los emits
const emits = defineEmits(['crearObjeto', 'modificarObjeto']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    edicion: Entidad | null; // edicion si null, sino creacion
  }>(),
  {
    edicion: null,
  },
);

// datos por defecto del formulario
const initForm = {
  tipo: 'PROVEEDOR',
  nombre: props.edicion?.nombre ?? '',
  descripcion: props.edicion?.descripcion ?? '',
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

// Inicializaciones
onMounted(async () => {
  // recuperamos la imagen desde la url
  if (props.edicion?.imagen?.cloudinaryUrl) {
    await UrlToBase64Image(props.edicion.imagen.cloudinaryUrl, (base64Data) => {
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
      // lanzamos la consulta
      const proveedor = await api.modificarEntidad_basico(
        props.edicion._id,
        estado.dataForm,
        { loading: true },
      );
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits('modificarObjeto', proveedor);
    }
    // Modo creacion
    else {
      // lanzamos la consulta
      const proveedor = await api.crearEntidad_basico(estado.dataForm, {
        loading: true,
      });
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits('crearObjeto', proveedor, {
        selectValor: proveedor._id,
        selectCallback: (listaOpciones: SelectOpcion[]): SelectOpcion[] => [
          ...listaOpciones,
          { label: proveedor.nombre, value: proveedor._id },
        ],
      });
    }
  } catch (err) {
    if (isApiBadRequest(err, 'duplicado')) {
      estado.errorNombre = 'Ya existe una proveedor con este nombre';
      return;
    }
    errFallBack(err);
    return;
  }
};
</script>
