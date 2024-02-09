<template>
  <q-btn
    color="primary"
    icon="add"
    label="Crear catalogo"
    dense
    no-caps
    padding="3px 15px"
    @click="estado.modal.isAddCatalogo = true"
  />

  <!-- MAPEO CATALOGOS -->
  <!-- <code>{{ estado.catalogos }}</code> -->
  <div class="flex flex-wrap justify-center gap-4" v-if="estado.catalogos">
    <q-item
      clickable
      class="shadow-md w-52 p-3 flex flex-col items-center mt-4"
      v-for="catalogo in estado.catalogos.hijas"
      :key="catalogo.nombre"
      @click="redirectCatalogoArbol(catalogo)"
    >
      <h1 class="font-bold text-center">{{ catalogo.nombre }}</h1>
      <p>{{ catalogo.ofertas.length }} ofertas👌</p>
      <p class="italic">29 diciembre 2023</p>
    </q-item>
  </div>

  <!-- MODAL CATALOGO -->
  <Dialog
    v-model="estado.modal.isAddCatalogo"
    title="Agregar catalogo"
    :handle-submit="crearCatalogo"
  >
    <template #inputsDialog>
      <q-input
        v-model="estado.catalogo.nombre"
        label="Nombre del catalogo"
        dense
      />
    </template>
  </Dialog>
</template>

<script setup>
definePageMeta({
  layout: 'marca',
});
import { onMounted } from 'vue';
import { useOferta } from '@/composables/marca/useOferta';
const { obtenerTodoCatalagos, estado, redirectCatalogoArbol, crearCatalogo } =
  useOferta();

const catalogos = [
  {
    nombre: 'Catalogo Produccion',
    items: 56,
    fecha: '12 febrero 2023',
  },
  {
    nombre: 'Catalogo Punto',
    items: 156,
    fecha: '29 diciembre 2023',
  },
  {
    nombre: 'Catalogo 3',
    items: 91,
    fecha: '28 enero 2024',
  },
];

onMounted(() => {
  obtenerTodoCatalagos();
});
</script>
