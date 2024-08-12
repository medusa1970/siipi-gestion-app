<template>
  <NuxtLayout name="cathering">
    <Tabla
      disableExpand
      :rows="rowsTabla"
      :columns="[
  {
    name: 'imagen',
    label: 'Imagen',
    imagen: true,
    style: 'width:50px; margin:5px; padding: 5px',
    align: 'center',
    field: (row: any) => row.imagen?.cloudinaryUrl,
  },
  {
    name: 'nombre',
    label: 'Nombre',
    style: 'width:50px; margin:5px; padding: 5px; width:100%',
    align: 'left',
    field: (row: any) => row.nombre,
    sortable: true,
    slot: true,
  },
  {
    name: 'actions',
    label: '',
    align: 'center',
    slot: true,
  },
]"
      :defaultImage="BloqueImage">
      <template #dropdown>
        <div class="w-full flex" style="align-items: center">
          <input-text
            label="Buscar"
            labelAdentro
            @update="(v) => (estado.filtros.buscar = v as string)"
            noSlot />
          <q-btn
            size="12px"
            icon="add"
            color="green"
            style="height: 16px; width: 16px; margin: 5px 10px"
            @click="() => (estado.modal.formCrearBloque = true)" />
        </div>
      </template>
      <template #body-cell-nombre="{ val, row }">
        {{ val }}
        <br />
        <i>{{ row.descripcion }}</i>
      </template>
      <template #body-cell-actions="{ row }">
        <q-btn-group push @click="e => e.stopPropagation()">
          <q-btn
            @click="
              () => {
                estado.bloque = row;
                estado.modal.formModificarBloque = true;
              }
            "
            icon="edit"
            class="p-1"
            color="black"
            size="sm" />
        </q-btn-group>
      </template>
    </Tabla>

    <popup v-model="estado.modal.formCrearBloque" titulo="Nueva bloque">
      <template #body>
        <formBloque @crearObjeto="handleBloqueCreado" />
      </template>
    </popup>
    <popup
      v-model="estado.modal.formModificarBloque"
      titulo="Modificar una bloque">
      <template #body>
        <formBloque
          :edicion="estado.bloque"
          @modificarObjeto="handleBloqueModificado" />
      </template>
    </popup>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useBloques } from './bloques.composable';
const {
  estado,
  store,
  authStore,
  router,
  rowsTabla,
  handleBloqueModificado,
  handleBloqueCreado
} = useBloques();

provide('infoPagina', {
  infoPagina: {
    titulo: 'Gestion de bloques',
    camino: [{ label: 'Bloques', to: 'bloques' }]
  }
});

import BloqueImage from '@/assets/img/noHayBloque.png';
import formBloque from '@/modulos/almacen/forms/formBloque.vue';
</script>
