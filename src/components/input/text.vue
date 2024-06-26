<template>
  <!-- eslint-disable -->
  <q-input
    :type="type !== 'password' ? type : isPwd ? 'password' : 'text'"
    ref="localRef"
    v-model="localModel"
    @update:model-value="handleChange"
    :label="label + (requerido ? '*' : '')"
    :rules="requerido ? [useRules.requerido, ...rules] : rules"
    outlined
    debounce="400"
    :clearable="clearable"
    :dense="dense"
    :class="class"
    :autogrow="autogrow"
    bottom-slots
    :error="error"
    :errorMessage="errorMessage"
  >
    <template #prepend v-if="icono">
      <q-icon :name="icono" @click.stop.prevent />
    </template>

    <template #after v-if="info && info.length > 0">
      <input-botonAyuda :mensaje="info" />
    </template>

    <template #append v-if="type === 'password'">
      <q-icon
        :name="isPwd ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="isPwd = !isPwd"
      ></q-icon>
    </template>
  </q-input>
</template>

<script setup>
// props
const props = defineProps({
  // debe ser un ref, cuando cambia se activara la validación
  validate: Boolean,

  // type : text, textarea, autogrow, password
  type: { type: String, default: 'text' },

  // el valor inicial
  default: { type: String, default: '' },

  // el label del input
  label: { type: String, default: null },

  // el texto del boton de informacion
  info: { type: String, default: null },

  // las reglas de validacion
  rules: { type: Array, default: [] },

  // el icono en prepend
  icono: { type: String, default: null },

  // el icono en prepend
  errorMessage: { type: String, default: null },
});

// type del input
if (
  !['textarea', 'text', 'autogrow', 'password', 'number'].includes(props.type)
) {
  props.type = 'text';
}
const autogrow = ref(false);
if (props.type === 'autogrow') {
  props.type = 'text';
  autogrow.value = true;
}

// la ref del model que contiene el valor actual
const localModel = ref(props.default);

// la ref del input para llamar a sus metodos
// localref.value.validacion(), .resetValidacion(), .focus(), .blur())
const localRef = ref(null);

// visibilidad del icono de show pwd
const isPwd = ref(true);
const error = ref(false);

// pasando el nuevo valor al componiente padre
const emits = defineEmits(['update']);
const handleChange = (newValue, oldValue) => {
  emits('update', newValue, oldValue);
};

/*
// recibiendo un ordén de validación desde el componiente padre
// sirve para actualizacion cuando se llama por @click en vez de @submit
watch(
  () => props.validate,
  () => {
    // localRef.value.resetValidation();
    localRef.value?.validate();
  },
  { immediate: false },
);
*/

// recibiendo un mensaje de error desde el componiente padre
watch(
  () => props.errorMessage,
  () => {
    error.value = props.errorMessage != null;
  },
);

// reinicializando el error y el mensaje personalizado cuando cambia el valor del input
watch(localModel, () => {
  error.value = false;
  props.errorMessage = '';
});
</script>
