<template>
  <NuxtLayout name="cathering">
    <Tabla
      disableExpand
      :rows="rowsTabla"
      :columns="columnsTabla"
      :defaultImage="ProveedorImage">
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
            @click="() => (estado.modal.formCrearProveedor = true)" />
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
                estado.proveedor = row;
                estado.modal.formModificarProveedor = true;
              }
            "
            icon="edit"
            class="p-1"
            color="black"
            size="sm" />
        </q-btn-group>
      </template>
    </Tabla>

    <popup v-model="estado.modal.formCrearProveedor" titulo="Nueva proveedor">
      <template #body>
        <formProveedor @crearObjeto="handleProveedorCreado" />
      </template>
    </popup>
    <popup
      v-model="estado.modal.formModificarProveedor"
      titulo="Modificar un proveedor">
      <template #body>
        <formProveedor
          :edicion="estado.proveedor"
          @modificarObjeto="handleProveedorModificado" />
      </template> </popup
  ></NuxtLayout>
</template>

<script setup lang="ts">
import { useProveedores } from './proveedores.composable';
const {
  estado,
  store,
  authStore,
  router,
  rowsTabla,
  handleProveedorCreado,
  handleProveedorModificado
} = useProveedores();

import ProveedorImage from '@/assets/img/noHayProveedor.png';
import formProveedor from '@/modulos/almacen/forms/formProveedor.vue';

provide('infoPagina', {
  infoPagina: {
    titulo: 'Gestion de proveedores',
    camino: [{ label: 'Proveedores', to: 'proveedores' }]
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
