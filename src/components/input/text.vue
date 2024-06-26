<template>
  <q-input
    v-model="localModel"
    :type="tipo !== 'password' ? tipo : isPwd ? 'password' : 'text'"
    ref="localRef"
    @update:model-value="handleChange"
    :label="label + (requerido ? '*' : '')"
    :rules="rules"
    :hint="hint"
    debounce="400"
    outlined
    :autogrow="autogrow"
    :clearable="clearable"
    :dense="dense"
    :class="clase"
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
const props = defineProps({
  // debe ser un ref, cuando cambia se activara la validación
  validate: Boolean,

  // type : text, textarea, autogrow, password
  tipo: { type: String, default: 'text' },

  // el valor inicial
  default: { type: String, default: '' },

  // el label del input
  label: { type: String, default: null },

  // texto de ayuda debajo del input
  hint: { type: String, default: null },

  // el texto del boton de informacion
  info: { type: String, default: null },

  // las reglas de validacion
  rules: { type: Array, default: [] },

  // el icono en prepend
  icono: { type: String, default: null },

  // mensaje de error personalizado desde el componiente padre
  errorMessage: { type: String, default: null },
});

// tipo del input
if (
  !['textarea', 'text', 'autogrow', 'password', 'number'].includes(props.tipo)
) {
  props.tipo = 'text';
}
const autogrow = ref(false);
if (props.tipo === 'autogrow') {
  props.tipo = 'text';
  autogrow.value = true;
}

// refs
const localModel = ref(props.default);
const localRef = ref(null);
const error = ref(false);
const dense = ref(null);
const clase = ref(null);
const clearable = ref(null);
const isPwd = ref(true);
const requerido = props.rules.map((rule) => rule.name).includes('requerido');

// pasando el nuevo valor al componiente padre
const emits = defineEmits(['update']);
const handleChange = (newValue, oldValue) => {
  emits('update', newValue, oldValue);
};

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

// recibiendo un mensaje de error desde el componiente padre
watch(
  () => props.errorMessage,
  () => {
    error.value = props.errorMessage != null;
  },
);
</script>
