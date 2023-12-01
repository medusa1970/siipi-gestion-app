<template>
  <div>
    <h1 class="text-lg font-bold mb-1">
      Agregar Oferta
      <!-- {{ useProduct.isEdit === true ? 'Editar Producto' : 'Agregar Producto' }} -->
    </h1>
    <div
      class="flex flex-col items-center justify-center bg-gray-200 w-32 h-32 cursor-pointer"
    >
      <input type="file" class="hidden" id="fileInput" />
      <label
        for="fileInput"
        class="flex items-center justify-center text-gray-500"
      >
        <q-icon name="add" size="xs" />
      </label>
      <span class="text-gray-500">Subir imagen</span>
    </div>
    <span class="flex gap-8 items-center my-3">
      <span class="flex flex-col gap-2 w-80">
        <q-input
          v-model="oferta.nombre"
          type="text"
          label="Nombre"
          outlined
          dense
        />
        <q-select
          v-model="oferta.tags"
          multiple
          outlined
          dense
          use-chips
          stack-label
          label="Grupos"
          :options="tags"
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
              >{{ scope.opt }}</q-chip
            >
          </template>
        </q-select>
        <q-select
          v-model="oferta.grupos"
          multiple
          outlined
          dense
          use-chips
          stack-label
          label="Tags"
          :options="tags"
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
              >{{ scope.opt }}</q-chip
            >
          </template>
        </q-select>
      </span>
      <q-input
        class="w-1/2"
        v-model="oferta.descripcion"
        type="textarea"
        label="Descripcion"
        outlined
        dense
      />
    </span>
    <!-- <q-btn color="secondary" label="Editar información" no-caps class="mb-3" /> -->

    <div class="flex gap-3 mb-3 items-center">
      <span class="leading-none">
        <h1 class="font-semibold text-base">Ingredientes</h1>
        <p style="font-size: 12px" class="text-gray-500">
          Producto con diferente presentacion
        </p>
      </span>
      <q-btn icon="add" dense round color="primary" size="12px" />
    </div>
    <DragDrop :lista="ingredientes" item-key="producto" />
    <br />
    <div class="flex gap-3 mb-3 items-center">
      <span class="leading-none">
        <h1 class="font-semibold text-base">Condiciones</h1>
        <p style="font-size: 12px" class="text-gray-500">
          Producto con diferentes condiciones
        </p>
      </span>
      <q-btn icon="add" dense round color="primary" size="12px" />
    </div>
    <DragDrop :lista="condiciones" item-key="tipo" />
    <br />
    <q-btn color="secondary" label="Agregar oferta" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import draggable from 'vuedraggable';
import DragDrop from '@/components/DrogDrop.vue';

const oferta = ref({
  nombre: '',
  descripcion: '',
  tags: [],
  grupos: [],
  ingredientes: [],
  condiciones: []
});

const tags = ['empanadas', 'Masas', 'Embutidos', 'pedazos'];
const ingredientes = ref([
  { producto: 'Empanada😀', cantidad: 2, unidad: 'unidad' },
  { producto: 'Masa', cantidad: 2, unidad: 'unidad' },
  { producto: 'Embutido', cantidad: 2, unidad: 'unidad' }
]);
const condiciones = ref([
  { tipo: 'Fecha', valor: '14 de sep.' },
  { tipo: 'Dias', valor: 'lunes' },
  { tipo: 'Cantidad', valor: '25' }
]);

// const drag = ref(false);
const removeAt = (idx: any) => {
  ingredientes.value.splice(idx, 1);
};
</script>
