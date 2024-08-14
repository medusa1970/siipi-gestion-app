<template>
  <div>
    <h3 class="inputTitle" v-if="!labelAdentro">
      {{ label + (requerido ? ' *' : '') }}
      <q-icon
        name="help"
        color="blue"
        size="20px"
        @click="tooltip = !tooltip" />
    </h3>
    <div class="flex items-center w-full justify-between">
      <q-field
        ref="localRef"
        dense
        borderless
        class="w-full"
        :rules="reglasValidacion"
        :error="noSlot ? undefined : errorFlag"
        :bottom-slots="!noSlot"
        :hide-bottom-space="!noSlot"
        :errorMessage="errorMensaje"
        v-model="localModel"
        @blur="handleBlur">
        <q-toggle
          true-value="true"
          false-value="false"
          v-model="localModel"
          :color="color"
          :disable>
          {{
            labelAdentro ? (label ?? '') + (requerido ? ' *' : '') : undefined
          }}
        </q-toggle>
        <template #after>
          <q-icon
            v-if="labelAdentro && info && info.length > 0"
            name="help"
            @click="tooltip = !tooltip">
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
            </q-tooltip></q-icon
          >
        </template>
      </q-field>
    </div>
  </div>
</template>

<script setup lang="ts">
import { _green } from '#tailwind-config/theme/accentColor';
import { inputConfig } from './input.service';
import { ref } from 'vue';
import { validacion } from './input.validacion';

/**
 * El tooltip tiene el texto de ayuda ;
 * Cuando aparece se llama a esta funcion para ocultarlo despues de un tiempo
 */
const tooltip = ref(false);
const hideTooltip = (seconds = 5) =>
  setTimeout(() => (tooltip.value = false), seconds * 1000);

/**
 * Definicion y tipado de los eventos que puede emitir este componiente
 */
const emits = defineEmits<{
  (event: 'update', valor: boolean): void;
  (event: 'error', mensaje: string, valor: boolean): void;
}>();

/**
 * Definicion de todos los parametros
 */
const props = withDefaults(
  defineProps<{
    onUpdate: Function;
    porDefecto?: boolean;
    info?: string;
    label: string;
    labelAdentro?: boolean;
    requerido?: boolean | string;
    disable?: boolean;
    error?: string;
    color?: string;
    rules?: any;
    noSlot?: boolean;
  }>(),
  {
    labelAdentro: inputConfig.labelAdentro,
    requerido: false,
    disable: false,
    error: null,
    color: inputConfig.checkColor,
    rules: [] as Function[],
    noSlot: false
  }
);

/**
 * Definicion de las refs
 */
const localRef = ref(null);
const localModel = ref<string>(props.porDefecto ? 'true' : 'false');
const errorMensaje = ref<string>(props.error);
const errorFlag = ref<boolean>(false);

/**
 * Error y validacion
 */
let reglasValidacion = props.rules ?? [];
if (props.requerido) {
  reglasValidacion.unshift(validacion.requeridoCheck(props.requerido));
}

function setError(mensaje: string | null) {
  errorMensaje.value = mensaje;
  errorFlag.value = mensaje != null;
  emits('error', mensaje, localModel.value === 'true' ? true : false);
}

watch(
  () => props.error,
  () => setError(props.error)
);

function activarValidacion() {
  for (const regla of reglasValidacion as Function[]) {
    const resultado = regla(localModel.value);
    if (resultado !== true) {
      setError(resultado);
      return;
    }
  }
  setError(null);
}

/**
 * Emision de valor
 */

watch(localModel, () => {
  if (localRef.value) localRef.value.resetValidation();
  activarValidacion();
  emits('update', localModel.value == 'true' ? true : false);
});

/**
 * Este metodo se ejecuta cada vez que el input pierde el focus
 */
const handleBlur = e => {
  setError(null);
};
</script>
