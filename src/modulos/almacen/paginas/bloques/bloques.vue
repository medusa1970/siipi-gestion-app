<template>
  <Navigation2
    :nav="[
      {
        label: 'bloques',
        to: 'bloques',
      },
    ]"
    titulo="Gestion de bloques"
  />
  <Tabla
    disableExpand
    :rows="composable.rowsTabla.value"
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
    :defaultImage="BloqueImage"
  >
    <template #dropdown>
      <div class="w-full flex" style="align-items: center">
        <input-text
          label="Buscar"
          labelAdentro
          @update="(v) => (estado.filtros.buscar = v as string)"
          porDefecto=""
          noSlot
        />
        <q-btn
          size="12px"
          icon="add"
          color="green"
          style="height: 16px; width: 16px; margin: 5px 10px"
          @click="() => (estado.modal.formCrearBloque = true)"
        />
      </div>
    </template>
    <template #body-cell-nombre="{ val, row }">
      {{ val }}
      <br />
      <i>{{ row.descripcion }}</i>
    </template>
    <template #body-cell-actions="{ row }">
      <q-btn-group push @click="(e) => e.stopPropagation()">
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
          size="sm"
        />
      </q-btn-group>
    </template>
  </Tabla>

  <popup v-model="estado.modal.formCrearBloque" titulo="Nueva bloque">
    <template #body>
      <formBloque @crearObjeto="composable.handleBloqueCreado" />
    </template>
  </popup>
  <popup
    v-model="estado.modal.formModificarBloque"
    titulo="Modificar una bloque"
  >
    <template #body>
      <formBloque
        :edicion="estado.bloque"
        @modificarObjeto="composable.handleBloqueModificado"
      />
    </template>
  </popup>
</template>

<script setup lang="ts">
// layout
definePageMeta({ layout: 'cathering' });
// import composable, store & estado
import { useBloques } from './bloques.composable';
const composable = useBloques();
const { estado, store } = composable;
// Otros imports
import BloqueImage from '@/assets/img/noHayBloque.png';
import formBloque from '@/modulos/almacen/forms/formBloque.vue';
</script>
