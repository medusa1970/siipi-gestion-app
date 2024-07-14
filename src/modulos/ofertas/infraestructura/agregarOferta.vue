<template>
  <q-form @submit="formSubmit">
    <pre>{{ props.producto }}</pre>
    <!-- <input-text
      label="Abreviacion"
      @update="(v) => (abreviacion.value = v)"
      info="La abreviacion debe tener entre 1 o 3 caracteres idealmente, por ejemplo TIR, DL, 12a, etc..."
      :rules="[useRules.requerido()]"
      :error="abreviacion.error"
    />

    <input-text
      label="Cantidad en unidades básicas"
      @update="(v) => (cantidad.value = Number(v))"
      info="Es la cantidad en stock del producto debajo de la cual se alertará para avisar que se necesita hacer un nuevo pedido al proveedor."
      :rules="[useRules.requerido(), useRules.numero()]"
    /> -->

    <q-btn label="Crear" type="submit" />
  </q-form>
</template>

<script setup lang="ts">
import type { Oferta } from '#gql';
import type { Producto } from '#gql';
import { ofertaService } from '../API/oferta.service';

const emits = defineEmits<{
  (event: 'crear:oferta', value: Oferta): void;
}>();

const props = withDefaults(
  defineProps<{
    producto: Producto;
  }>(),
  {},
);

const nombre = reactiveInput(null as string);
onMounted(async () => {});

const formSubmit = async (datos: any) => {
  let nuevaOferta;
  try {
    nuevaOferta = await ofertaService.crearOferta2(datos);
  } catch (err) {
    if (isApiBadRequest(err, 'duplicado')) {
      return;
    }
    errFallBack(err);
    return; 
  }
  emits('crear:oferta', nuevaOferta);
};
</script>
