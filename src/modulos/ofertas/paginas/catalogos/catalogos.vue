<template>
  <Navigation2
    :nav="[{ label: 'catalogos', to: 'catalogos' }]"
    titulo="Gestion de catalogos"
  />
  <q-btn
    color="primary"
    label="Crear catalogo"
    dense
    no-caps
    padding="3px 15px"
    @click="estado.modal.show_agregarCatalogo = true"
  />

  <!-- MAPEO CATALOGOS -->
  <div class="flex flex-wrap justify-center gap-4">
    <q-item
      clickable
      class="shadow-md w-52 p-3 flex flex-col items-center mt-4"
      v-for="catalogo in oferta.estado?.catalogos"
      :key="catalogo?._id"
      @click="irCatalogoID(catalogo?._id)"
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
      <p class="italic">{{ fechaDiaMes(catalogo._creado) }}</p>
    </q-item>
  </div>
</template>

<script setup>
import { useCatalogos } from './catalogos.composable';
import { useOferta } from '@/modulos/ofertas/paginas/ofertas/ofertas.composable';

const { estado, irCatalogoID } = useCatalogos();
const oferta = useOferta();

// layout
definePageMeta({
  layout: 'cathering',
});

onMounted(() => {
  oferta.traerCatalogos();
});
</script>
