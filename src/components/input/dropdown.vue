<template>
  <q-select
    class="w-full"
    :label="label + (requerido ? '*' : '')"
    v-model="selected"
    @update:model-value="handleChange"
    :rules="requerido ? [obligatorio, ...rules] : rules"
    :dense="!notDense"
    :required="requerido"
    filled
    :options="options"
    :option-label="(option) => option.label"
    bottom-slots
  >
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
        :class="scope.opt.class"
      >
        <q-item-section>{{ scope.opt.label }}</q-item-section>
      </q-item>
    </template>
    <template #after>
      <BotonDetalle v-if="info.length > 0" :mensaje="info" />
    </template>
  </q-select>
</template>

<script setup>
import { obligatorio } from '@/helpers/validate.form';

/**
 * Refs
 */
const selected = ref('');

/**
 * Props
 */
const props = defineProps({
  // opciones de la lista
  options: Array,
  // debe ser del tipo siguiente:
  // interface dropdownOption {
  //   label: String;
  //   value: String;
  //   class: String;
  //   disable: Boolean;
  // }

  // label del input
  label: {
    type: String,
    default: 'Seleccionar una opción',
  },
  // texto del boton de informacion
  info: {
    type: String,
    default: 'Elija la opción que le parece mejor',
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
const handleChange = (option) => {
  emits('update', option.value);
};
</script>
