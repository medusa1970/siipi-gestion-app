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
    <!-- descripcion -->
    <input-text2
      label="Descripcion"
      :porDefecto="estado.dataForm.descripcion"
      @update="(v) => (estado.dataForm.descripcion = v)"
    />

    <!-- Submit -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import type { Entidad } from '#gql';
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
      const proveedor = await api.modificarEntidad_basico(
        props.edicion._id,
        estado.dataForm,
      );
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits('modificarObjeto', proveedor);
    }
    // Modo creacion
    else {
      // lanzamos la consulta
      const proveedor = await api.crearEntidad_basico(estado.dataForm);
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
