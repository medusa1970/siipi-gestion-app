<template>
  <q-input
    type="text"
    class="w-full"
    v-model="localModel"
    :label="label + (requerido ? '*' : '')"
    :rules="requerido ? [obligatorio, ...rules] : rules"
    :dense="!notDense"
    :required="requerido"
    filled
    @update:model-value="handleChange"
  >
    <template #after>
      <BotonDetalle v-if="info.length > 0" :mensaje="info" />
    </template>
  </q-input>
</template>

<script setup>
import { obligatorio } from '@/helpers/validate.form';

/**
 * Refs
 */
const localModel = ref('');

/**
 * Props
 */
defineProps({
  // label del input
  label: {
    type: String,
    default: 'Nombre',
  },
  // texto del boton de informacion
  info: {
    type: String,
    default: 'Escriba algo',
  },
  // reglas de validacion
  rules: {
    type: Array,
    default: [],
  },
  // si el input es dense o no
  notDense: {
    type: Boolean,
    default: false,
  },
  // si el campo es requerido o no
  requerido: {
    type: Boolean,
    default: false,
  },
});

/**
 * Eventos
 */
const emits = defineEmits(['update']);

// el valor cambió
const handleChange = (newValue, oldValue) => {
  emits('update', newValue, oldValue);
};
</script>
