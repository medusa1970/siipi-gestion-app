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
    <!-- abreviacion -->
    <input-text
      label="Abreviacion"
      :porDefecto="estado.dataForm.abreviacion"
      @update="(v) => (estado.dataForm.abreviacion = v)"
      :rules="[useRules.requerido()]"
      :error="estado.errorAbreviacion"
    />
    <q-btn :label="edicion != null ? 'Guardar' : 'Crear'" type="submit" />
  </q-form>
</template>

<script setup lang="ts">
import type { Medida } from '#gql';
import type { selectOpcionCallback } from '~/components/input/select.interface';
import type {} from '../almacen.interface';

// definicion de los emits
const emits = defineEmits<{
  (event: 'crear:medida', medida: Medida): void;
  (event: 'modificar:medida', medida: Medida): void;
  (
    event: 'crear:opcion',
    valor: string,
    objeto: any,
    callback: selectOpcionCallback,
  ): void;
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
    edicion: Medida | null; // edicion si null, sino creacion
  }>(),
  {
    edicion: null,
  },
);

// datos por defecto del formulario
const initForm = {
  nombre: props.edicion?.nombre ?? '',
  abreviacion: props.edicion?.nombre ?? '',
};

// definicion del estado
const estado = reactive({
  // valor de los inputs
  dataForm: clone(initForm),
  //mensajes de error del formulario
  errorNombre: '',
  errorAbreviacion: '',
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
      const medida = await api.modificarMedida(
        props.edicion._id,
        estado.dataForm,
      );
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits('modificar:medida', medida);
    }
    // Modo creacion
    else {
      // lanzamos la consulta
      const medida = await api.crearMedida(estado.dataForm);
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits('crear:medida', medida);
      // ... y especialmente para un eventual input select para insertar la nueva opcion
      emits('crear:opcion', medida._id, medida, (listaOpciones) => [
        ...listaOpciones,
        { label: medida.nombre, value: medida._id },
      ]);
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
    errFallBack(err);
    return;
  }
};
</script>
