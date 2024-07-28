<template>
  <q-form @submit="formSubmit">
    <div class="text-center">
      <q-btn
        label="Agregar Lote"
        color="orange"
        @click="showModal.crearLote = true"
      />
    </div>
    <div class="flex">
      <q-card class="mr-3 mb-3" v-for="lote in estado.lotes" :key="lote.id">
        <q-btn
          @click="
            () => {
              estado.loteEdicion = lote;
              showModal.modificarLote = true;
            }
          "
          icon="edit"
          class="p-1"
          color="black"
          size="sm"
        />
        <q-btn
          icon="delete"
          class="p-1"
          color="red"
          size="sm"
          @click="borrarLote(lote)"
        />
        <ul>
          <li>cantidad: {{ lote.cantidad }}</li>
          <li>marca: {{ getMarca(lote).nombre }}</li>
          <li>bloque: {{ getBloque(lote).nombre }}</li>
        </ul>
      </q-card>
    </div>
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>

  <Popup v-model="showModal.crearLote" titulo="Agregar un lote">
    <template #body>
      <formInventarioLote :producto @crearLote="handleCrearLote" />
    </template>
  </Popup>
  <Popup v-model="showModal.modificarLote" titulo="Modificar un lote">
    <template #body>
      <formInventarioLote
        :edicion="estado.loteEdicion"
        :producto
        @crearLote="handleModificarLote"
      />
    </template>
  </Popup>
</template>

<script setup lang="ts">
// imports
import type { Inventario, InventarioLote, Producto } from '#gql';
import formInventarioLote from '@/modulos/almacen/forms/formInventarioLote.vue';
import { apiAlmacen } from '~/modulos/almacen/API/almacen.api';
import { useAuthStore } from '~/modulos/main/useAuthStore';
const authStore = useAuthStore();
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
const { store } = useAlmacen();
const $q = useQuasar();
import type { Lote } from './formInventarioLote.vue';
import type { Bloque } from '#gql';
import type { Marca } from '#gql';

// definicion de los emits
const emits = defineEmits(['hacerInventario']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    producto: Producto;
  }>(),
  {},
);

// definicion del estado
const estado = reactive({
  dataForm: {},
  lotes: [] as Lote[],
  loteEdicion: null,
});
const showModal = reactive({
  crearLote: false,
  modificarLote: false,
});

// Inicializaciones
onMounted(async () => {
  await store.getEntidad();
});

// submision del formulario
const formSubmit = async () => {
  // debe haber por lo menos un lote
  if (estado.lotes.length === 0) {
    console.log('debe haber por lo menos un lote');
    return false;
  }

  // mandamos el inventario
  let inventario: Inventario = null;
  try {
    inventario = await apiAlmacen.realizarInventario(
      authStore.negocio._id,
      props.producto._id,
      estado.lotes.map((lote) => {
        delete lote.id;
        return lote;
      }),
      true,
      'se hizo',
    );
  } catch (err) {
    errFallBack(err);
    return;
  }
  emits('hacerInventario', inventario);
};

// Lote >> InventarioLote
const getMarca = (lote: Lote): Marca =>
  props.producto.variedades.find((v) => v.marca._id === lote.marca).marca;
const getBloque = (lote: Lote): Bloque =>
  store.entidad.bloques.find((b) => b._id === lote.bloque);

// lote creado
const handleCrearLote = async (lote) => {
  showModal.crearLote = false;
  estado.lotes.push(lote);
};

// lote modificado
const handleModificarLote = async (modificado) => {
  showModal.modificarLote = false;
  estado.lotes = estado.lotes.map((lote) =>
    lote.id === modificado.id ? modificado : lote,
  );
};

// lote borrar
const borrarLote = async (loteBorrar) => {
  $q.dialog({
    message: '¿Estas seguro de borrar este lote?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    estado.lotes = estado.lotes.filter((lote) => loteBorrar.id !== lote.id);
  });
};
</script>
