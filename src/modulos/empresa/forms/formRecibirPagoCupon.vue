<template>
  <q-form @submit="formSubmit">
    <p>Total a pagar: {{ porPagar }} bs</p>
    <br />

    <input-text
      label="Monto"
      tipo="decimal"
      info="Info #"
      @update="v => (estado.dataForm.monto = v as number)"
      :error="estado.errorAdelantado"
      requerido />

    <input-text
      label="Referencia del cupon"
      info="Info #"
      @update="v => (estado.dataForm.referencia = v as string)"
      requerido />

    <!-- descripcion -->
    <input-text
      label="Comentario"
      info="Info #"
      autogrow
      :porDefecto="estado.dataForm.comentario"
      @update="v => (estado.dataForm.comentario = v as string)" />

    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { useEmpresa } from '~/modulos/empresa/empresa.composable';
const { store, authStore, apiEmpresa } = useEmpresa();
const $q = useQuasar();

const props = withDefaults(
  defineProps<{
    porPagar: number;
  }>(),
  {}
);

// definicion de los emits
const emits = defineEmits(['pagoRecibido']);

// definicion del estado
const estado = reactive({
  dataForm: {
    vendedor: authStore.getNegocio._id,
    comprador: store.entidad._id,
    monto: null as number,
    modalidad: 'CUPON',
    referencia: null as string,
    comentario: null as string
  },
  errorAdelantado: null
});

onMounted(async () => {});

// submision del formulario
const formSubmit = async () => {
  $q.dialog({
    title: `Confirmar recepcion`,
    message: 'Monto ' + estado.dataForm.monto + 'bs, punto Irala',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      const transaccion = await apiEmpresa.crearTransaccionConLimite(
        estado.dataForm
      );
      const validado = await apiEmpresa.validarTransaccion({
        _id: transaccion._id
      });
      emits('pagoRecibido', transaccion);
    } catch (err) {
      if (isApiBadRequest(err, 'adelantado')) {
        estado.errorAdelantado = 'No se aceptan pagos adelantados';
        return;
      }
      errFailback(err);
      return;
    }
  });
};
</script>
