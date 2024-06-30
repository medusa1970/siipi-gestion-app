<template>
  <q-input
    :type="tipo !== 'password' ? tipo : isPwd ? 'password' : 'text'"
    v-model="localModel"
    @update:model-value="handleChange"
    @blur="activarValidacion"
    :label="label + (requerido ? '*' : '')"
    :rules="rules"
    :hint="hint"
    debounce="400"
    :autogrow="tipo === 'password' ? false : autogrow"
    :clearable="clearable"
    :dense="dense"
    :filled="filled"
    :outlined="outlined"
    :class="clase"
    bottom-slots
    :error="errorFlag"
    :errorMessage="errorMensaje"
  >
    <template #prepend v-if="icono">
      <q-icon :name="icono" @click.stop.prevent />
    </template>

    <template #after v-if="info && info.length > 0">
      <input-botonAyuda :mensaje="info" />
    </template>

    <template #append v-if="tipo === 'password'">
      <q-icon
        :name="isPwd ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="isPwd = !isPwd"
      ></q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
/**
 * emits
 */

const emits = defineEmits<{
  (
    // cambió el valor del input
    event: 'update',
    valor: string | null,
  ): void;
  (
    // el input está en estado de error de validación
    event: 'error',
    errorFlag: boolean,
    errorMessage: string | null,
  ): void;
}>();

/**
 * props
 */
const props = withDefaults(
  defineProps<{
    onUpdate: Function; // para que el @update sea obligatorio
    label: string; // label adentro del input
    tipo?: 'text' | 'textarea' | 'password' | 'number';
    hint?: string; // texto de ayuda debajo del input
    info?: string; // texto de ayuda en el boton de ayuda
    porDefecto?: string; // valor seleccionado al iniciar
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
  }>(),
  {
    tipo: 'text',
    outlined: true,
    // filled: true,
    autogrow: false,
    dense: true,
    clearable: true,
    clase: 'mt-2 mb-1',
    rules: [] as Function[],
  },
);

/**
 * refs, reactives y computed
 */

const localModel = ref<string>(props.porDefecto); // contenido del input
const errorFlag = ref<boolean>(false); // si se tiene que mostrar o no el error
const errorMensaje = ref<string>(props.error); // el mensaje de error
const isPwd = ref<boolean>(true); // si las letras son visibles o
const requerido = props.rules.map((rule) => rule.name).includes('requerido');

/**
 * metodos
 */

// metodo llamado cuando el valor del input cambia
const handleChange = (valor: string | null) => {
  activarValidacion();
  emits('update', valor);
};

// activar o deactivar el error para el input (desactiva si param null)
function setError(mensaje: string | null) {
  //@ts-ignore
  errorMensaje.value = mensaje;
  errorFlag.value = mensaje !== null;
  emits('error', errorFlag.value, errorMensaje.value);
}

// activar la validacíon del valor actual del input
function activarValidacion() {
  for (const regla of props.rules as Function[]) {
    const resultado = regla(localModel.value);
    if (resultado !== true) {
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
  () => setError(props.error),
);

// activar la validacion desde el componiente padre
watch(
  () => props.activarValidacion, // si cambia la ref validate en el componiente padre,
  () => activarValidacion(), // se activa la validacion
  { immediate: false },
);
</script>
