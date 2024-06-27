<template>
  <q-form @submit="formSubmit">
    <input-text
      label="Nombre"
      @update="(v) => (nombre.valor = v)"
      :errorMessage="nombre.error"
      :rules="[useRules.requerido()]"
      dense
      clearable
    />

    <input-dropdown
      label="Categoria"
      :options="categoriaOptions"
      @update="(v) => (pariente.valor = v)"
      :rules="[useRules.requerido()]"
      dense
      clearable
    />

    <q-btn label="Crear" type="submit" />
  </q-form>
</template>

<script setup lang="ts">
/**
 * Imports y inicializaciones
 */
definePageMeta({
  layout: 'inicio',
});
const emits = defineEmits(['crear:objeto']);
import { onMounted } from 'vue';
import type { CrearCategoriaDto } from '#gql';
import { useProductoService } from '~/modulos/productos/negocio/useProductoService';
const productoService = useProductoService();

const nombre = reactiveInput('');
const pariente = reactiveInput('');
const catSelect1 = await productoService.categoriaSelectOptions1nivel();
const categoriaOptions = ref(catSelect1); // opciones para el input pariente

const formSubmit = async (datos: any) => {
  try {
    const nuevaCategoria = await productoService.crearCategoria({
      nombre: nombre.valor,
      pariente: pariente.valor,
    } as CrearCategoriaDto);

    // find id of next cat nivel1, or null
    const indexPariente = catSelect1.findIndex(
      (c) => c.value === pariente.valor,
    );
    const insertarAntesDe = catSelect1[indexPariente + 1]?.value;
    Object.assign(nuevaCategoria, { insertarAntesDe });
    emits('crear:objeto', nuevaCategoria);
    NotifySucess(`Categoria creada con éxito`);
  } catch (e: any) {
    NotifyError(`Error no tratado: ${e}`);
    console.log(e);
    return false;
  }
};
</script>
