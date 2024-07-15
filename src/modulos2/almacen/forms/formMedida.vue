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
    <!-- abreviacion -->
    <input-text2
      label="Abreviacion"
      :porDefecto="estado.dataForm.abreviacion"
      @update="(v) => (estado.dataForm.abreviacion = v)"
      :rules="[useRules.requerido()]"
      :error="estado.errorAbreviacion"
    />
    <!-- Submit -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import type { Medida } from '#gql';
import type {
  SelectOpcion,
  selectOpcionCallback,
} from '~/components/input/select.interface';
import type { CategoriaSelectOpcion } from '../almacen.interface';

// definicion de los emits
const emits = defineEmits(['crearObjeto', 'modificarObjeto']);

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
      emits('modificarObjeto', medida);
    }
    // Modo creacion
    else {
      // lanzamos la consulta
      const medida = await api.crearMedida(estado.dataForm);
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits('crearObjeto', medida, {
        selectValor: medida._id,
        selectCallback: (listaOpciones: SelectOpcion[]): SelectOpcion[] => [
          ...listaOpciones,
          { label: medida.nombre, value: medida._id },
        ],
      });
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
