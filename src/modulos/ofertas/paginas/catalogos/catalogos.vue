<template>
  <NuxtLayout name="cathering">
    <q-btn
      v-show="false"
      color="primary"
      label="Crear catalogo"
      dense
      no-caps
      padding="3px 15px"
      @click="estado.modal.show_agregarCatalogo = true" />
    <!-- MAPEO CATALOGOS -->
    <div class="flex flex-wrap justify-center gap-4">
      <div v-for="catalogo in store.catalogoArbol.hijas">
        <q-item
          clickable
          class="shadow-md w-52 p-3 flex flex-col items-center mt-4"
          v-if="catalogo?._id !== '85a4475e446a5885b05739c4'"
          :key="catalogo?._id"
          @click="goTo(router, 'catalogo', { id: catalogo._id })">
          <h1 class="font-bold text-center">{{ catalogo.nombre }}</h1>
          <p>
            {{
              catalogo?.hijas.length > 0
                ? catalogo.hijas
                    .map(hija => (hija.hijas ? hija.hijas.length : 0))
                    .reduce((a, b) => a + b, 0)
                : 0
            }}
            categorias👌
          </p>
          <p class="italic">{{ fechaDiaMes(catalogo?._creado) }}</p>
        </q-item>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { useCatalogos } from './catalogos.composable';
const { estado, store, authStore, router } = useCatalogos();

provide('infoPagina', {
  infoPagina: {
    titulo: 'Gestion de catalogos',
    camino: [{ label: 'Catalogos', to: 'catalogos' }]
  }
});

onBeforeMount(async () => {
  store.catalogoArbol = await store.getCatalogoArbol();
});
</script>
