<template>
  <q-input
    v-model="localModel"
    ref="localRef"
    :type="tipo !== 'password' ? tipo : isPwd ? 'password' : 'text'"
    @update:model-value="handleChange"
    @blur="activarValidacion"
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

const props = defineProps({
  type: { type: String, default: 'text' }, // type : text, textarea, autogrow, password
  valorInicial: { type: String, default: '' }, // el valor inicial del input
  label: { type: String, default: null }, // el label que aparece adentro
  hint: { type: String, default: null }, // texto de ayuda debajo del input
  info: { type: String, default: null }, // el texto del boton de informacion
  rules: { type: Array, default: [] }, // las reglas de validacion
  icono: { type: String, default: null }, // el icono en prepend
  error: { type: String, default: null }, // msj de error desde el componiente padre
  clearable: { type: Boolean, default: false }, // una cruz para vaciar el campo
  dense: { type: Boolean, default: false }, // mas compacto
  autogrow: { type: Boolean, default: false }, // autogrow para tipo text
  clase: { type: Boolean, default: false }, // clase css / tailwind a aplicar al input
  activarValidacion: { type: Boolean, default: false }, // para activar la validacion desde el componiente padre
});

/**
 * refs, reactives y computed
 */

const localModel = ref(props.valorInicial); // contenido del input
const localRef = ref(null); // referencia del input
const errorFlag = ref(false); // si se tiene que mostrar o no el error
const errorMensaje = ref(props.error); // el mensaje de error
const isPwd = ref(true); // si las letras son visibles o
const tipo = ref(props.type);
if (
  ![
    'text', // un campo de texto normal
    'textarea', // un bloque cuadrado de texto fijo
    'password', // las letras estan escondidas, hay un boton para verlas
    'number', // un campo de texto normal pero solo se pueden entrar numeros
  ].includes(tipo.value)
) {
  tipo.value = 'text'; // por defecto es text
}
const requerido = (props.rules as Function[])
  .map((rule) => rule.name)
  .includes('requerido');

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
