<template>
  <Navigation label="Catalogos" icon="group" />
  <h1 class="text-lg font-extrabold uppercase text-center">
    Gestion de catalogos
  </h1>
  <q-btn
    color="primary"
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
      <p>
        {{
          catalogo.hijas && catalogo.hijas.length > 0
            ? catalogo.hijas
                .map((hija) => (hija.hijas ? hija.hijas.length : 0))
                .reduce((a, b) => a + b, 0)
            : 0
        }}
        categorias👌
      </p>
      <!-- <p class="italic">29 diciembre 2023</p> -->
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
  layout: 'sede',
});
import { onMounted } from 'vue';
import { useOferta } from '@/composables/marca/useOferta';
const {
  obtenerTodoCatalagos,
  estado,
  redirectCatalogoArbol,
  crearCatalogo,
  calcularTotalOfertas,
} = useOferta();

onMounted(() => {
  obtenerTodoCatalagos();
});
</script>
