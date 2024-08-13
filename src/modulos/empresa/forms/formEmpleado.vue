<template>
  <q-form @submit="formSubmit">
    <!-- Persona -->
    <input-select
      label="Persona"
      :opciones="selectPersona"
      info="Info #"
      @update="v => (estado.dataForm.persona = v)"
      :error="estado.errorNombre"
      requerido />

    <!-- Cargo -->
    <input-text
      label="Cargo"
      info="Info #"
      @update="v => (estado.dataForm.cargos[0].nombre = v)"
      requerido />

    <!-- Descripcion -->
    <input-text
      label="Comentario"
      tipo="textarea"
      info="Info #"
      @update="v => (estado.dataForm.comentario = v)" />
    <!-- Submit -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import type { Cargo } from '#gql';
import { useEmpresa } from '~/modulos/empresa/empresa.composable';
const { store, authStore } = useEmpresa();

// definicion de los emits
const emits = defineEmits(['crearObjeto']);

// datos por defecto del formulario
const initForm = {
  persona: null as string,
  cargos: [{ nombre: null as string }] as [Cargo]
};

// definicion del estado
const estado = reactive({
  dataForm: clone(initForm),
  errorNombre: null
});

// Inicializaciones
const personas = ref([]);
const personasSinRegistrar = computed(() =>
  personas.value.filter(
    persona =>
      !store.empleados.find(empleado => empleado.persona._id === persona._id)
  )
);
const selectPersona = computed(() =>
  personasSinRegistrar.value.map(persona => ({
    label: persona.nombre,
    value: persona._id
  }))
);
onMounted(async () => {
  try {
    personas.value = await api.buscarPersonas({});
  } catch (err) {
    errFailback(err);
    return;
  }
});

// submision del formulario
const formSubmit = async () => {
  try {
    const entidad = await api.modificarEntidad_empleados(
      authStore.getNegocio._id,
      {
        empleados: {
          agregar: estado.dataForm
        }
      }
    );
    emits('crearObjeto', ultimo(entidad.empleados), entidad);
  } catch (err) {
    if (isApiBadRequest(err, 'duplicado')) {
      estado.errorNombre = 'Esta persona ya esta empleada';
      return;
    }
    errFailback(err);
    return;
  }
  // reinicializamos el formulario
  await store.refreshEmpleados();
  estado.dataForm = clone(initForm);
};
</script>
