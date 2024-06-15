<template>
  <q-input
    type="textarea"
    class="w-full"
    v-model="localModel"
    :rules="requerido ? [obligatorio, ...rules] : rules"
    :label="label + (requerido ? '*' : '')"
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
    default: 'Escribir algo',
  },
  // texto del boton de informacion
  info: {
    type: String,
    default: '',
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

// otra forma de hacerlo:
// watch(localModel, (newValue, oldValue) => {
//   emits('update', newValue, oldValue);
// });
</script>
