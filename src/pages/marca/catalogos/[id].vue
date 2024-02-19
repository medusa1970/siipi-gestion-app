<template>
  <Navigation
    label="Catalogos"
    icon="list_alt"
    href="/marca/catalogos"
    label2="DetailCatalogo"
  />

  <!-- <code>{{ storeOferta.catalogoElegido }}</code> -->
  <!-- TREE -->
  <div class="flex justify-center mt-4">
    <q-list
      class="rounded-borders w-[350px]"
      v-for="categoria in storeOferta.catalogoElegido"
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
  <Dialog
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
  </Dialog>
</template>

<script setup>
definePageMeta({
  layout: 'marca',
});
import { useOferta } from '@/composables/marca/useOferta';
import Dialog from '@/components/Dialog.vue';

const { storeOferta, estado, crearCatalogoArbol, modalCrearCategoriaArbol } =
  useOferta();
</script>
