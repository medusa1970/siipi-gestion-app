<template>
  <NuxtLayout name="cathering">
    <Tabla
      disableExpand
      :rows="rowsTabla"
      :columns="columnsTabla"
      :defaultImage="MarcaImage">
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
            @click="() => (estado.modal.formCrearMarca = true)" />
        </div>
      </template>
      <template #cell-nombre="{ val, row }">
        {{ val }}
        <br />
        <i>{{ row.descripcion }}</i>
      </template>
      <template #cell-actions="{ row }">
        <q-btn-group push @click="e => e.stopPropagation()">
          <q-btn
            @click="
              () => {
                estado.marca = row;
                estado.modal.formModificarMarca = true;
              }
            "
            icon="edit"
            class="p-1"
            color="black"
            size="sm" />
        </q-btn-group>
      </template> </Tabla
  ></NuxtLayout>

  <popup v-model="estado.modal.formCrearMarca" titulo="Nueva marca">
    <template #body>
      <formMarca @crearObjeto="handleMarcaCreada" />
    </template>
  </popup>
  <popup v-model="estado.modal.formModificarMarca" titulo="Modificar una marca">
    <template #body>
      <formMarca
        :edicion="estado.marca"
        @modificarObjeto="handleMarcaModificada" />
    </template>
  </popup>
</template>

<script setup lang="ts">
import { useMarcas } from './marcas.composable';
const {
  estado,
  authStore,
  rowsTabla,
  handleMarcaCreada,
  handleMarcaModificada
} = useMarcas();

import MarcaImage from '@/assets/img/noHayMarca.png';
import formMarca from '@/modulos/almacen/forms/formMarca.vue';

provide('infoPagina', {
  infoPagina: {
    titulo: 'Gestion de marcas',
    camino: [{ label: 'Marcas', to: 'marcas' }]
  }
});

const columnsTabla = [
  {
    name: 'imagen',
    label: 'Imagen',
    imagen: true,
    style: 'width:50px; margin:5px; padding: 5px',
    align: 'center',
    field: (row: any) => row.imagen?.cloudinaryUrl
  },
  {
    name: 'nombre',
    label: 'Nombre',
    style: 'width:50px; margin:5px; padding: 5px; width:100%',
    align: 'left',
    field: (row: any) => row.nombre,
    sortable: true,
    slot: true
  },
  {
    name: 'actions',
    label: '',
    align: 'center',
    slot: true
  }
];
</script>
