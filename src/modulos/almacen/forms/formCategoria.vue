<template>
  <q-form @submit="formSubmit">
    <!-- nombre -->
    <input-text
      label="Nombre"
      info="Nombre de la categoria que se esta creando."
      :porDefecto="estado.dataForm.nombre"
      @update="v => (estado.dataForm.nombre = v)"
      requerido
      :error="estado.errorNombre" />

    <!-- Categoria -->
    <input-select
      label="Categoria pariente"
      :opciones="selectCategoriaNivel1"
      info="Dentro de que CATEGORIA PADRE deseas crear esta nueva categoria"
      :porDefecto="estado.dataForm.pariente"
      @update="v => (estado.dataForm.pariente = v)"
      requerido />

    <!-- Submit -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import type { Categoria } from '#gql';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
const { store } = useAlmacen();

// definicion de los emits
const emits = defineEmits(['crearObjeto', 'modificarObjeto']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    edicion?: Categoria;
  }>(),
  {
    edicion: null
  }
);

// datos por defecto del formulario
const initForm = {
  nombre: props.edicion?.nombre,
  pariente: props.edicion?.pariente?._id
};

// definicion del estado
const estado = reactive({
  dataForm: clone(initForm),
  errorNombre: ''
});

// opciones
const selectCategoriaNivel1 = computed(() => {
  const options = [];
  if (store.categoriaArbol) {
    for (const cat of store.categoriaArbol.hijas) {
      options.push({
        label: cat.nombre,
        value: cat._id
      });
    }
  }
  return options;
});

// Inicializaciones
onMounted(async () => {
  await store.getCategorias();
});

// submision del formulario
const formSubmit = async () => {
  try {
    if (props.edicion) {
      const categoria = modificarUno(GqlModificarCategorias, {
        busqueda: props.edicion._id,
        datos: estado.dataForm
      });
      emits('modificarObjeto', categoria);
    } else {
      const categoria = await crearUno(GqlCrearCategorias, {
        datos: estado.dataForm
      });
      emits('crearObjeto', categoria);
    }
  } catch (err) {
    if (isApiBadRequest(err, 'duplicado')) {
      estado.errorNombre = 'Ya existe una categoria con este nombre';
      return;
    }
    errFailback(err);
    return;
  }
  // reinicializacion del formulario
  store.refreshCategorias();
  estado.dataForm = clone(initForm);
};
</script>
