<template>
  <Navigation
    label="Catalogos"
    icon="list_alt"
    href="/cathering/sede/catalogos"
    label2="DetailCatalogo"
  />
  <!-- TREE -->
  <h1 class="text-lg font-bold text-center">
    {{ estado.catalogoSeleccionado[0]?.nombre }}
  </h1>

  <div class="flex justify-center mt-4">
    <q-list
      class="rounded-borders w-[350px]"
      v-for="categoria in estado.catalogoSeleccionado"
      :key="categoria.nombre"
    >
      <q-expansion-item
        expand-separator
        icon="category"
        :label="categoria.nombre"
        default-opened
        dense
      >
        <q-list
          v-for="(item, index) in categoria.hijas"
          :key="index"
          class="border-b-[1px] border-gray-300"
        >
          <q-expansion-item
            :header-inset-level="0.5"
            switch-toggle-side
            dense-toggle
            :label="item.nombre"
            default-opened
            dense
          >
            <q-list v-for="(item2, index) in item.hijas" :key="index">
              <q-expansion-item
                switch-toggle-side
                dense-toggle
                :label="item2.nombre"
                :header-inset-level="1"
                :content-inset-level="2"
                expand-separator
                active-class="text-blue"
                dense
              >
              </q-expansion-item>
            </q-list>
            <q-item clickable dense>
              <q-item-section side @click="modalCrearCategoriaArbol(item)">
                <span class="text-blue ml-20"
                  >Agregar nueva categoria <q-icon name="add"
                /></span>
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </q-list>
        <q-item clickable dense>
          <q-item-section side @click="modalCrearCategoriaArbol(categoria)">
            <span class="text-blue ml-12"
              >Agregar nueva categoria <q-icon name="add"
            /></span>
          </q-item-section>
        </q-item>
      </q-expansion-item>
    </q-list>
  </div>

  <!-- MODAL CATALOGO -->
  <q-dialog persistent v-model="estado.modal.isAddCatalogo">
    <q-card class="p-3 w-[380px]">
      <div class="flex justify-between">
        <h1 class="text-lg font-bold">Agregar Catalogoo</h1>
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          class="border-2 border-red-500"
        />
      </div>
      <!-- <q-space /> -->

      <div class="my-1">
        <q-input
          v-model="estado.catalogo.nombre"
          label="Nombre del catalogo"
          dense
        />
      </div>
      <div class="flex row justify-center">
        <q-btn
          class="mt-2 mb-1"
          no-caps
          style="font-size: 15px"
          padding="4px 10px"
          label="Guardar"
          color="secondary"
          type="submit"
          @click="crearCatalogoArbol(route.params.id)"
        ></q-btn>
      </div>
    </q-card>
  </q-dialog>
  <!-- <Dialog
    v-model="estado.modal.isAddCatalogo"
    title="Agregar catalogo"
    :handle-submit="crearCatalogoArbol"
  >
    <template #inputsDialog>
      <q-input
        v-model="estado.catalogo.nombre"
        label="Nombre del catalogo"
        dense
      />
    </template>
  </Dialog> -->
</template>

<script setup>
definePageMeta({
  layout: 'cathering',
});
import { useOferta } from '~/composables/empleados/useOferta';
import Dialog from '@/components/Dialog.vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
console.log(route.params.id);

onMounted(() => {
  obtenerCatalogoId(route.params.id);
});

const {
  storeOferta,
  estado,
  crearCatalogoArbol,
  modalCrearCategoriaArbol,
  obtenerTodoCatalagos,
  obtenerCatalogoId,
} = useOferta();
</script>
