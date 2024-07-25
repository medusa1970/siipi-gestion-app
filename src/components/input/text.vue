<template>
  <q-input
    :type="typet"
    v-model="localModel"
    @update:model-value="handleChange"
    @Blur="activarValidacion"
    @clear="handleClear"
    :label="label + (requerido ? '*' : '')"
    :rules="reglas"
    :hint="hint"
    debounce="400"
    :autogrow="tipo === 'password' ? false : autogrow"
    :clearable="clearable"
    :dense="dense"
    :filled="filled"
    :outlined="outlined"
    :class="clase"
    :bottom-slots="!noSlot"
    :error="noSlot ? undefined : errorFlag"
    :errorMessage="errorMensaje">
    <q-tooltip
      v-model="tooltip"
      class="no-pointer-events text-white text-sm bg-blue-9"
      anchor="bottom middle"
      self="top middle"
      :offset="[0, 5]"
      max-width="300px"
      no-parent-event
      @show="hideTooltip()">
      {{ info }}
    </q-tooltip>

    <template #prepend v-if="icono">
      <q-icon :name="icono" @click.stop.prevent />
    </template>
    <template #after v-if="info && info.length > 0">
      <q-icon name="help" @click="tooltip = !tooltip" />
    </template>
    <template #append v-if="tipo === 'password'">
      <q-icon
        :name="isPwd ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="isPwd = !isPwd"></q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { ref } from 'vue';

/**
 * Tooltip
 */
const tooltip = ref(false);
const hideTooltip = (seconds = 3) =>
  setTimeout(() => (tooltip.value = false), seconds * 1000);

/**
 * emits
 */

const emits = defineEmits<{
  (
    // cambió el valor del input
    event: 'update',
    valor: string | number | null
  ): void;
  (
    // el input está en estado de error de validación
    event: 'error',
    errorFlag: boolean,
    errorMessage: string | null
  ): void;
  (
    // cleared
    event: 'clear'
  ): void;
}>();

/**
 * props
 */
const props = withDefaults(
  defineProps<{
    onUpdate: Function; // para que el @update sea obligatorio
    label: string; // label adentro del input
    tipo?: 'text' | 'textarea' | 'password' | 'number' | 'decimal';
    hint?: string; // texto de ayuda debajo del input
    info?: string; // texto de ayuda en el boton de ayuda
    porDefecto?: string | number; // valor seleccionado al iniciar
    watch?: string; // ref de la cual se hara un watch de los cambios para cambiar el input
    rules?: any; // reglas de validacion
    icono?: string; // icono a mostrar adentro a la isquierda antes del label
    clase?: string; // clases css o tailwind
    activarValidacion?: boolean; // cambiar en el comp. pariente para forzar validacion
    error?: string; // cambiar en el comp. oariente para mostrar un error personalizado
    dense?: boolean;
    outlined?: boolean;
    filled?: boolean;
    clearable?: boolean;
    autogrow?: boolean;
    noSlot?: boolean;
  }>(),
  {
    tipo: 'text',
    outlined: true,
    // filled: true,
    autogrow: false,
    dense: true,
    noSlot: false,
    clearable: true,
    clase: '',
    rules: [] as Function[]
  }
);

/**
 * refs, reactives y computed
 */

const valorInicial = props.porDefecto != null ? String(props.porDefecto) : null;
const localModel = ref<string>(valorInicial);
const errorFlag = ref<boolean>(false); // si se tiene que mostrar o no el error
const errorMensaje = ref<string>(props.error); // el mensaje de error
const isPwd = ref<boolean>(true); // si las letras son visibles o
const requerido = props.rules.map(rule => rule.name).includes('requerido');
const reglas = ref(
  props.tipo === 'number'
    ? [...props.rules, useRules.numero()]
    : props.rules || props.tipo === 'decimal'
    ? [...props.rules, useRules.decimal()]
    : props.rules
);

const typet = computed(() =>
  props.tipo === 'password'
    ? isPwd.value
      ? 'password'
      : 'text'
    : props.tipo === 'textarea'
    ? 'textarea'
    : 'text'
);

/**
 * metodos
 */

// metodo llamado cuando el valor del input cambia
const handleChange = (valor: string | null) => {
  activarValidacion();
  emits(
    'update',
    props.tipo === 'number' && valor != null ? Number(valor) : valor
  );
  let processedValue: string | number | null = valor;

  if (valor !== null && props.tipo === 'number') {
    processedValue = Number(valor);
  } else if (props.tipo === 'decimal') {
    processedValue =
      isNaN(parseFloat(valor)) || valor.includes('.') || valor.includes(',')
        ? valor
        : parseFloat(valor).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
  }

  emits('update', processedValue);
};

// Se ha creado una nueva opcion via el boton [+]
const handleClear = () => {
  activarValidacion();
  localModel.value = null;
  emits('clear');
};

// activar o deactivar el error para el input (desactiva si param null)
function setError(mensaje: string | null) {
  errorMensaje.value = mensaje;
  errorFlag.value = mensaje !== null;
  emits('error', errorFlag.value, errorMensaje.value);
}

// activar la validacíon del valor actual del input
function activarValidacion() {
  console.log('ok');
  for (const regla of reglas.value as Function[]) {
    const resultado = regla(localModel.value);
    if (resultado !== true) {
      setError('0');
      setError(resultado);
      return; // solo el primer error se manda
    }
  }
  setError(null);
}

/**
 * watch y subscripciones
 */

// activar el error si llega un mensaje de error desde el componiente padre
watch(
  () => props.error,
  () => setError(props.error)
);

// activar la validacion desde el componiente padre
watch(
  () => props.activarValidacion, // si cambia la ref validate en el componiente padre,
  () => activarValidacion(), // se activa la validacion
  { immediate: false }
);

// modificar el valor desde el componiente padre
watch(
  () => props.watch,
  () => {
    localModel.value = props.watch;
    activarValidacion();
  },
  { immediate: false }
);
</script>
