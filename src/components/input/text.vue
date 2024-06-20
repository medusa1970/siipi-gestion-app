<template>
  <q-input
    type="text"
    class="w-full"
    v-model="localModel"
    :label="label + (requerido ? '*' : '')"
    :rules="requerido ? [useRules.requerido, ...rules] : rules"
    :dense="!notDense"
    :required="requerido"
    filled
    @update:model-value="handleChange"
  >
    <template #prepend v-if="icono">
      <q-icon :name="icono" @click.stop.prevent />
    </template>
    <template #after>
      <input-botonAyuda v-if="info && info.length > 0" :mensaje="info" />
    </template>
  </q-input>
</template>

<script setup>
/**
 * Props
 */
const props = defineProps({
  // valor inicial
  default: {
    type: String,
    default: '',
  },
  // label del input
  label: {
    type: String,
    default: 'Nombre',
  },
  // texto del boton de informacion
  info: {
    type: String,
    default: null,
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
 * Refs
 */
const localModel = ref(props.default);

/**
 * Eventos
 */
const emits = defineEmits(['update']);

// el valor cambió
const handleChange = (newValue, oldValue) => {
  emits('update', newValue, oldValue);
};
</script>
