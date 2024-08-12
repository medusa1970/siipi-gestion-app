<template>
  <q-form @submit="formSubmit">
    <p>
      Punto:
      {{ store.entidad?.nombre }}
    </p>

    <input-text
      label="Monto"
      tipo="decimal"
      info="Info #"
      @update="v => (estado.dataForm.monto = v as number)"
      requerido />

    <input-text
      label="Glosa"
      info="Info #"
      @update="v => (estado.dataForm.glosa = v as string)"
      requerido />

    <input-text
      label="Referencia del giro"
      info="Info #"
      @update="v => (estado.dataForm.referencia = v as string)"
      requerido />

    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { useEmpresa } from '~/modulos/empresa/empresa.composable';
const { store, authStore } = useEmpresa();

// definicion de los emits
const emits = defineEmits(['pagoRecibido']);

// definicion del estado
const estado = reactive({
  dataForm: {
    vendedor: authStore.getNegocio._id,
    comprador: store.entidad._id,
    monto: null as number,
    modalidad: 'GIRO',
    glosa: null as string,
    referencia: null as string
  }
});

onMounted(async () => {});

// submision del formulario
const formSubmit = async () => {
  try {
    const transaccion = await api.crearTransaccion(estado.dataForm);
    emits('pagoRecibido', transaccion);
  } catch (err) {
    errFallBack(err);
    return;
  }
};
</script>
