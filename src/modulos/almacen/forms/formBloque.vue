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
import type { Bloque } from '#gql';
import { UrlToBase64Image } from '~/components/input/input.service';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
const { store } = useAlmacen();
import { useAuthStore } from '~/modulos/main/useAuthStore';
const authStore = useAuthStore();

// definicion de los emits
const emits = defineEmits(['crearObjeto', 'modificarObjeto']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    edicion?: Bloque;
  }>(),
  {
    edicion: null,
  },
);

// datos por defecto del formulario
const initForm = {
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

// opciones
const selectBloque = computed(() => {
  const bloques = store.entidad.bloques ?? [];
  return bloques.map((bloque) => ({
    value: bloque._id,
    label: bloque.nombre,
  }));
});

// Inicializaciones
onMounted(async () => {
  await store.getEntidad();
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
    if (props.edicion) {
      const entidad = await api.modificarEntidad_bloques(
        authStore.negocio._id,
        {
          bloques: {
            buscar: {
              _id: [props.edicion._id],
            },
            modificar: estado.dataForm,
          },
        },
      );
      emits(
        'modificarObjeto',
        entidad.bloques.find((v) => v._id === props.edicion?._id),
        entidad,
      );
    } else {
      const entidad = await api.modificarEntidad_bloques(
        authStore.negocio._id,
        {
          bloques: {
            agregar: [estado.dataForm],
          },
        },
      );
      emits('crearObjeto', ultimo(entidad.bloques), entidad);
    }
  } catch (err) {
    if (isApiBadRequest(err, 'duplicado')) {
      estado.errorNombre = 'Este bloque ya esta registrada';
      return;
    }
    errFallBack(err);
    return;
  }
  await store.refreshProductos();
  estado.dataForm = clone(initForm);
};
</script>
