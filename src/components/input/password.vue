<template>
  <q-input
    type="password"
    class="w-full"
    v-model="localModel"
    :rules="requerido ? [useRules.requerido, ...rules] : rules"
    :label="label + (requerido ? '*' : '')"
    :dense="!notDense"
    :required="requerido"
    filled
    @update:model-value="handleChange"
  >
    <template #prepend v-if="icono">
      <q-icon :name="icono" @click.stop.prevent />
    </template>
    <template #after>
      <input-botonAyuda v-if="info.length > 0" :mensaje="info" />
    </template>
  </q-input>
</template>

<script setup>
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
    default: 'Contraseña',
  },
  // texto del boton de informacion
  info: {
    type: String,
    default: 'Entre su contraseña',
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
  // el icono en prepend
  icono: {
    type: String,
    default: '',
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
