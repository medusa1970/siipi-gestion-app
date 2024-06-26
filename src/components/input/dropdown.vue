<template>
  <!-- eslint-disable -->
  <q-select
    v-model="localModel"
    ref="localRef"
    @update:model-value="handleChange"
    @filter="filterFn"
    :label="label + (requerido ? '*' : '')"
    :rules="rules"
    :options="displayOpts"
    :option-label="(option) => option.label"
    use-input
    fill-input
    hide-selected
    input-debounce="0"
    outlined
    :clearable="clearable"
    :dense="dense"
    :class="clase"
    bottom-slots
    :error="error"
    :errorMessage="errorMessage"
    options-cover
    options-dense
  >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey"> No hay resultados </q-item-section>
      </q-item>
    </template>
    <template #prepend v-if="icono">
      <q-icon :name="icono" @click.stop.prevent />
    </template>
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
      <input-botonAyuda v-if="info && info.length > 0" :mensaje="info" />
    </template>
  </q-select>
</template>

<script setup>
const props = defineProps({
  // debe ser un ref, cuando cambia se activara la validación
  validate: Boolean,

  // opciones de la lista
  options: Array,
  // debe ser del tipo siguiente:
  // interface dropdownOption {
  //   label: String;
  //   value: String;
  //   class: String;
  //   disable: Boolean;
  // }

  // valor inicial
  default: { type: String, default: '' },

  // label del input
  label: { type: String, default: 'Seleccionar una opción' },

  // texto del boton de informacion
  info: { type: String, default: 'Elija la opción que le parece mejor' },

  // reglas de validacion
  rules: { type: Array, default: [] },

  // el icono en prepend
  icono: { type: String, default: '' },

  // mensaje de error personalizado desde el componiente padre
  errorMessage: { type: String, default: null },
});

// opciones que se mostraran en el select, talvez filtradas
const displayOpts = ref(props.options);

// opcion seleccionada al inicio (cf prop.default)
const defaultOption = props.options.find(
  (option) => option.value === props.default,
);

// refs
const localModel = ref(defaultOption);
const localRef = ref(null);
const error = ref(false);
const dense = ref(null);
const clase = ref(null);
const clearable = ref(null);
const requerido = props.rules.map((rule) => rule.name).includes('requerido');

// pasando el nuevo valor al componiente padre
const emits = defineEmits(['update']);
const handleChange = (option, oldValue) => {
  emits('update', option.value, oldValue);
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

// filtrar las opciones al entrar un valor en el input
function filterFn(val, update) {
  update(() => {
    const needle = val.toLowerCase();
    displayOpts.value =
      val === ''
        ? props.options
        : props.options.filter(
            (v) => !v.disabled && v.label.toLowerCase().indexOf(needle) > -1,
          );
  });
}
</script>
