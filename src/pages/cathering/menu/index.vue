<template>
  <Navigation label="Menu" icon="folder" />
  <q-btn
    color="primary"
    label="Crear menu"
    no-caps
    dense
    padding="2px 15px"
    @click="estado.modal.isAddMenu = true"
  />
  <div class="flex gap-4 flex-wrap justify-center">
    <div v-for="menu in estado.menus" :key="menu" class="w-80 p-4 shadow-lg">
      <h1>{{ menu._id }}</h1>
      <h1 class="text-orange-600 font-bold">{{ menu.catalogo.nombre }}</h1>
      <h1>{{ menu.exepciones.length }} exepciones</h1>
    </div>
  </div>

  <!-- <code>{{ estado.catalogos }}</code> -->

  <Dialog
    v-model="estado.modal.isAddMenu"
    title="Crear menu"
    :handle-submit="crearMenu"
  >
    <template #inputsDialog>
      <q-select
        color="primary"
        v-model="estado.menu.catalogo"
        :options="estado.catalogos"
        label="Seleccionar catalogo"
        option-label="nombre"
        use-input
        onfocus="this.select()"
        dense
        filled
      >
        <template v-slot:append>
          <q-icon
            style="margin: 0"
            name="close"
            @click.stop.prevent="estado.menu.catalogo = ''"
            class="cursor-pointer q-mr-md"
          />
        </template>
        <template v-slot:prepend>
          <q-icon name="group" />
        </template>
      </q-select>
      <q-select
        v-model="estado.menu.exepciones"
        multiple
        dense
        filled
        use-chips
        class="mt-2"
        label="seleccionar Exepciones"
        :options="exepciones"
        option-label="nombre"
        color="primary"
        use-input
        onfocus="this.select()"
      >
        <template v-slot:selected-item="scope">
          <q-chip
            removable
            dense
            @remove="scope.removeAtIndex(scope.index)"
            :tabindex="scope.tabindex"
            color="green"
            text-color="white"
            class="p-3"
            >{{ scope.opt.nombre }}</q-chip
          >
        </template>
      </q-select>
    </template>
  </Dialog>
</template>

<script setup>
definePageMeta({
  layout: 'cathering',
});
import { useMenu } from '@/composables/punto/useMenu';
import { onMounted, ref } from 'vue';
import { ofertaService } from '~/services/ofertas.service';

const { obtenerMenus, estado, obtenerCatalogos, crearMenu } = useMenu();
const exepciones = ref([]);

const ofertasDeCatalogo = async (id) => {
  const catalogoArbol = await ofertaService.buscarCatalogoID(id);
  const test = catalogoArbol.hijas
    .filter((item) => item.hijas)[0]
    .hijas.map((item2) => item2.ofertas)
    .flat();
  return test;
};
const res = await ofertasDeCatalogo('65a4475e446a5885b05739c4');
// console.log(exepciones.value);

onMounted(() => {
  obtenerMenus();
  obtenerCatalogos();
  ofertasDeCatalogo('65a4475e446a5885b05739c4').then(
    (res) => (exepciones.value = res),
  );
});
</script>
