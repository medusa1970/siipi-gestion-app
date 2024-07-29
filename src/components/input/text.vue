<template>
  <div>
    <h3 class="inputTitle" v-if="!labelAdentro">
      {{ label + (requerido ? ' *' : '') }}
      <q-icon name="help" color="blue" size="20px" @click="tooltip = !tooltip">
        <q-tooltip
          v-model="tooltip"
          class="no-pointer-events text-white text-sm bg-blue-9"
          anchor="bottom left"
          self="top left"
          :offset="[0, 5]"
          max-width="300px"
          no-parent-event
          @show="hideTooltip()"
        >
          {{ info }}
        </q-tooltip></q-icon
      >
    </h3>
    <q-input
      :label="labelAdentro ? label + (requerido ? ' *' : '') : undefined"
      :type="tipo"
      v-model="localModel"
      @update:model-value="handleChange"
      @Blur="handleBlur"
      @clear="handleClear"
      :rules="reglas"
      :hint="hint"
      debounce="300"
      :autogrow="tipo === 'password' ? false : autogrow"
      :clearable="clearable"
      :dense="dense"
      :filled="filled"
      :outlined="outlined"
      :class="clase"
      :bottom-slots="!noSlot"
      :error="noSlot ? undefined : errorFlag"
      :errorMessage="errorMensaje"
      :color="inputConfig.color"
      :bg-color="
        localModel && localModel !== ''
          ? inputConfig.bgColorLleno
          : inputConfig.bgColorVacio
      "
    >
      <template #prepend v-if="icono">
        <q-icon :name="icono" @click.stop.prevent />
      </template>
      <template #append v-if="tipo === 'password'">
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        ></q-icon>
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { inputConfig } from './input.service';
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
    valor: string | number | null,
  ): void;
  (
    // el input está en estado de error de validación
    event: 'error',
    errorFlag: boolean,
    errorMessage: string | null,
    valor: any,
  ): void;
}>();

/**
 * props
 */

const props = withDefaults(
  defineProps<{
    onUpdate: Function; // solo se declara para que el @update sea obligatorio
    label: string; // label adentro del input
    tipo?: 'text' | 'textarea' | 'password' | 'number' | 'decimal';
    hint?: string; // texto de ayuda debajo del input
    info?: string; // texto de ayuda en el boton de ayuda
    porDefecto?: string | number; // valor seleccionado al iniciar
    watch?: string | number; // ref de la cual se hara un watch de los cambios para cambiar el input
    forceWatch?: boolean; // forzar el watch para seguir sus cambios mismo si no cambia
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
    labelAdentro: boolean;
  }>(),
  {
    tipo: 'text',
    autogrow: false,
    noSlot: false,
    clearable: true,
    rules: [] as Function[],
    filled: inputConfig.filled,
    dense: inputConfig.dense,
    outlined: inputConfig.outlined,
    clase: inputConfig.clase,
    labelAdentro: inputConfig.labelAdentro,
    forceWatch: null,
  },
);

/**
 * para mostrar el valor con decimales y comas si es un numero
 */

const tipar = (valor) => {
  let res = null;
  if (valor != null) {
    switch (props.tipo) {
      case 'number':
        res = parseFloat(String(valor)).toLocaleString('en-US', {
          minimumFractionDigits: 0,
        });
        break;
      case 'decimal':
        res = parseFloat(String(valor)).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        break;
      default:
        res = String(valor);
    }
  }
  return res;
};

/**
 * refs, reactives y computed
 */

const localModel = ref<string>(tipar(props.porDefecto));
const errorFlag = ref<boolean>(false); // si se tiene que mostrar o no el error
const errorMensaje = ref<string>(props.error); // el mensaje de error
const isPwd = ref<boolean>(true); // si las letras son visibles o
const requerido = props.rules.map((rule) => rule.name).includes('requerido');
const reglas = ref(
  props.tipo === 'decimal'
    ? [...props.rules, useRules.decimal()]
    : props.tipo === 'number'
    ? [...props.rules, useRules.numero()]
    : props.rules,
);

/**
 * tipo que debemos pasar a q-input
 */

const tipo = computed(() =>
  props.tipo === 'password'
    ? isPwd.value
      ? 'password'
      : 'text'
    : props.tipo === 'textarea'
    ? 'textarea'
    : 'text',
);

/**
 * manejadores de eventos
 */

// valor del input cambia : emitemos el nuevo valor (si es correcto)
const handleChange = (valor: string | null) => {
  if (activarValidacion()) {
    if (props.tipo === 'number' || props.tipo === 'decimal') {
      valor = valor.replace(',', '');
      emits('update', valor == null ? null : Number(valor));
    } else {
      emits('update', valor);
    }
  }
};

// input se reinicia con la cruz
const handleClear = () => {
  activarValidacion();
  localModel.value = null;
  emits('update', null);
};

// input pierde el focus
const handleBlur = () => {
  activarValidacion();
};

/**
 * Errores y validacion
 */

// activar o deactivar el error para el input (desactiva si param null)
function setError(mensaje: string | null) {
  errorMensaje.value = mensaje;
  errorFlag.value = mensaje !== null;
  emits('error', errorFlag.value, errorMensaje.value, localModel.value);
}

// activar la validacíon del valor actual del input
function activarValidacion() {
  for (const regla of reglas.value as Function[]) {
    const resultado = regla(localModel.value);
    if (resultado !== true) {
      setError('//'); // para que se detecte un cambio
      setError(resultado);
      return false; // solo el primer error se manda
    }
  }
  setError(null);
  return true;
}

/**
 * watch y subscripciones
 */

// activar el error si llega un mensaje de error desde el componiente padre
watch(
  () => props.error,
  () => setError(props.error),
);

// activar la validacion desde el componiente padre
watch(
  () => props.activarValidacion, // si cambia la ref validate en el componiente padre...
  () => activarValidacion(), // ... entonces se activa la validacion
  { immediate: false },
);

// modificar el valor desde el componiente padre segun la prop 'watch'
watch(
  () => [props.watch, props.forceWatch],
  () => {
    localModel.value = tipar(props.watch);
    handleChange(localModel.value);
  },
  { immediate: false },
);
</script>
