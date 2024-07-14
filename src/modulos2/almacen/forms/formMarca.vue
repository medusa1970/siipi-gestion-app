<template>
  <q-form @submit="formSubmit">
    <!-- nombre -->
    <input-text
      label="Nombre"
      :porDefecto="estado.dataForm.nombre"
      @update="(v) => (estado.dataForm.nombre = v)"
      :rules="[useRules.requerido()]"
      :error="estado.errorNombre"
    />
    <q-btn :label="edicion != null ? 'Guardar' : 'Crear'" type="submit" />
  </q-form>
</template>

<script setup lang="ts">
import type { Marca } from '#gql';
import type { selectOpcionCallback } from '~/components/input/select.interface';
import type {} from '../almacen.interface';

// definicion de los emits
const emits = defineEmits<{
  (event: 'crear:marca', marca: Marca): void;
  (event: 'modificar:marca', marca: Marca): void;
  (
    event: 'crear:opcion',
    valor: string,
    objeto: any,
    callback: selectOpcionCallback,
  ): void;
}>();

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
};

// definicion del estado
const estado = reactive({
  // valor de los inputs
  dataForm: clone(initForm),
  //mensajes de error del formulario
  errorNombre: '',
});

// Inicializaciones
onMounted(async () => {
  // nada por lo momento
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
      emits('modificar:marca', marca);
    }
    // Modo creacion
    else {
      // lanzamos la consulta
      const marca = await api.crearMarca(estado.dataForm);
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits('crear:marca', marca);
      // ... y especialmente para un eventual input select para insertar la nueva opcion
      emits('crear:opcion', marca._id, marca, (listaOpciones) => [
        ...listaOpciones,
        { label: marca.nombre, value: marca._id },
      ]);
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
