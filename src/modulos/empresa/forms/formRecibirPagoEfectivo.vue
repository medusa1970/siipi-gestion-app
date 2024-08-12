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

    <p class="mb-1">Fraccionamento</p>

    <div class="w-full grid grid-cols-2 mb-5">
      <div class="col-span-1">
        <input-text
          label="Billetes de 200bs"
          labelAdentro
          noSlot
          tipo="number"
          @update="v => (estado.fraccionamento.billete200bs = v)" />
        <input-text
          label="Billetes de 100bs"
          labelAdentro
          noSlot
          tipo="number"
          @update="v => (estado.fraccionamento.billete100bs = v)" />
        <input-text
          label="Billetes de 50bs"
          labelAdentro
          noSlot
          tipo="number"
          @update="v => (estado.fraccionamento.billete50bs = v)" />
        <input-text
          label="Billetes de 20bs"
          labelAdentro
          noSlot
          tipo="number"
          @update="v => (estado.fraccionamento.billete20bs = v)" />
        <input-text
          label="Billetes de 10bs"
          labelAdentro
          noSlot
          tipo="number"
          @update="v => (estado.fraccionamento.billete10bs = v)" />
      </div>
      <div class="col-span-1">
        <input-text
          label="Monedas de 5bs"
          labelAdentro
          noSlot
          tipo="number"
          @update="v => (estado.fraccionamento.moneda5bs = v)" />
        <input-text
          label="Monedas de 2bs"
          labelAdentro
          noSlot
          tipo="number"
          @update="v => (estado.fraccionamento.moneda2bs = v)" />
        <input-text
          label="Monedas de 1bs"
          labelAdentro
          noSlot
          tipo="number"
          @update="v => (estado.fraccionamento.moneda1bs = v)" />
        <input-text
          label="Monedas de 50ctvs"
          labelAdentro
          noSlot
          tipo="number"
          @update="v => (estado.fraccionamento.c50 = v)" />
        <input-text
          label="Monedas de 20ctvs"
          labelAdentro
          noSlot
          tipo="number"
          @update="v => (estado.fraccionamento.c20 = v)" />
        <input-text
          label="Monedas de 10ctvs"
          labelAdentro
          noSlot
          tipo="number"
          @update="v => (estado.fraccionamento.c10 = v)" />
      </div>
    </div>

    <div v-if="estado.dataForm.monto > 0">
      <div v-if="estado.cambio < 0">Falta cancelar {{ -estado.cambio }}bs</div>
      <div v-else-if="estado.cambio > 0">Cambio: {{ estado.cambio }}bs</div>
      <div v-else="estado.cambio === 0">Cabal, no se necesita dar cambio</div>
    </div>

    <!-- Submit -->
    <div class="text-center">
      <q-btn
        :disable="estado.dataForm.monto <= 0 || estado.cambio < 0"
        label="Guardar"
        color="green"
        type="submit" />
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
    modalidad: 'EFECTIVO',
    glosa: null as string
  },
  total: 0,
  fraccionamento: {
    billete200bs: null,
    billete100bs: null,
    billete50bs: null,
    billete20bs: null,
    billete10bs: null,
    moneda5bs: null,
    moneda2bs: null,
    moneda1bs: null,
    c50: null,
    c20: null,
    c10: null
  },
  cambio: 0
});

onMounted(async () => {});

// submision del formulario
const formSubmit = async () => {
  try {
    const transaccion = await api.crearTransaccion(estado.dataForm);
    emits('pagoRecibido', transaccion);
    console.log(1);
  } catch (err) {
    errFallBack(err);
    return;
  }
  // reinicializamos el formulario
  // await store.refreshEmpleados();
  // estado.dataForm = clone(initForm);
};

watch([() => estado.dataForm.monto, estado.fraccionamento], () => {
  const val = string => (string != '' ? Number(string) : 0);
  estado.total =
    200 * val(estado.fraccionamento.billete200bs) +
    100 * val(estado.fraccionamento.billete100bs) +
    50 * val(estado.fraccionamento.billete50bs) +
    20 * val(estado.fraccionamento.billete20bs) +
    10 * val(estado.fraccionamento.billete10bs) +
    5 * val(estado.fraccionamento.moneda5bs) +
    2 * val(estado.fraccionamento.moneda2bs) +
    1 * val(estado.fraccionamento.moneda1bs) +
    0.5 * val(estado.fraccionamento.c50) +
    0.2 * val(estado.fraccionamento.c20) +
    0.1 * val(estado.fraccionamento.c10);
  estado.cambio = estado.total - estado.dataForm.monto;
});
</script>
