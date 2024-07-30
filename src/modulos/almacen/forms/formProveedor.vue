<template>
  <q-form @submit="formSubmit">
    <!-- nombre -->
    <input-text
      label="Nombre"
      info="Info #15"
      :porDefecto="estado.dataForm.nombre"
      @update="(v) => (estado.dataForm.nombre = v)"
      requerido
      :error="estado.errorNombre"
    />
    <!-- descripcion -->
    <input-text
      label="Descripcion"
      tipo="textarea"
      info="Info #16"
      :porDefecto="estado.dataForm.descripcion"
      @update="(v) => (estado.dataForm.descripcion = v)"
    />
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
import { UrlToBase64Image } from '~/components/input/input.service';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
const { store } = useAlmacen();

// definicion de los emits
const emits = defineEmits(['crearObjeto', 'modificarObjeto']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    edicion?: Entidad;
  }>(),
  {
    edicion: null,
  },
);

// datos por defecto del formulario
const initForm = {
  tipo: 'PROVEEDOR',
  nombre: props.edicion?.nombre,
  descripcion: props.edicion?.descripcion,
  imagen: null,
};

// definicion del estado
const estado = reactive({
  dataForm: clone(initForm),
  errorNombre: '',
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
      const proveedor = await api.modificarEntidad_basico(
        props.edicion._id,
        estado.dataForm,
        { loading: true },
      );
      emits('modificarObjeto', proveedor);
    }
    // Modo creacion
    else {
      const proveedor = await api.crearEntidad_basico(estado.dataForm, {
        loading: true,
      });
      emits('crearObjeto', proveedor);
    }
  } catch (err) {
    if (isApiBadRequest(err, 'duplicado')) {
      estado.errorNombre = 'Ya existe un proveedor con este nombre';
      return;
    }
    errFallBack(err);
    return;
  }
  await store.refreshProveedores();
  estado.dataForm = clone(initForm);
};
</script>
