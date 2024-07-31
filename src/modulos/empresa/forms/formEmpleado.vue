<template>
  <q-form @submit="formSubmit">
    <!-- Submit -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import type { Empleado } from '#gql';
import { UrlToBase64Image } from '~/components/input/input.service';
import { useEmpresa } from '~/modulos/empresa/empresa.composable';
const { store } = useEmpresa();

// definicion de los emits
const emits = defineEmits(['crearObjeto', 'modificarObjeto']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    edicion?: Empleado;
  }>(),
  {
    edicion: null,
  },
);

// datos por defecto del formulario
const initForm = {};

// definicion del estado
const estado = reactive({
  dataForm: clone(initForm),
});

// Inicializaciones
onMounted(async () => {
});

// submision del formulario
const formSubmit = async () => {
  try {
    if (props.edicion) {
      const empleado = await api.modificarEmpleado(
        props.edicion._id,
        estado.dataForm,
        { loading: true },
      );
      emits('modificarObjeto', empleado);
    } else {
      const empleado = await api.crearEmpleado(estado.dataForm, {
        loading: true,
      });
      emits('crearObjeto', empleado);
    }
  } catch (err) {
    if (isApiBadRequest(err, 'duplicado')) {
      estado.errorNombre = 'Ya existe una empleado con este nombre';
      return;
    }
    errFallBack(err);
    return;
  }
  // reinicializamos el formulario
  await store.refreshEmpleados();
  estado.dataForm = clone(initForm);
};
</script>
