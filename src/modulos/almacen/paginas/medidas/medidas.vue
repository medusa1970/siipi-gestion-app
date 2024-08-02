<template>
  <NuxtLayout name="cathering">
    <Tabla
      :rows="rowsTabla"
      :columns="columnsTabla"
      :defaultImage="MedidaImage"
    >
      <template #dropdown>
        <div class="w-full flex" style="align-items: center">
          <input-text
            label="Buscar"
            labelAdentro
            @update="(v) => (estado.filtros.buscar = v as string)"
            noSlot
          />
          <q-btn
            size="12px"
            icon="add"
            color="green"
            style="height: 16px; width: 16px; margin: 5px 10px"
            @click="() => (estado.modal.formCrearMedida = true)"
          />
        </div>
      </template>
      <template #body-cell-actions="{ row }">
        <q-btn-group push @click="(e) => e.stopPropagation()">
          <q-btn
            @click="
              () => {
                estado.medida = row;
                estado.modal.formModificarMedida = true;
              }
            "
            icon="edit"
            class="p-1"
            color="black"
            size="sm"
          />
        </q-btn-group>
      </template>
      <template #body-expand="{ row }">
        <div class="flex">
          <q-card
            class="mr-3 mb-3"
            v-for="tipoEmpaque in row.tipoEmpaques"
            :key="tipoEmpaque._id"
          >
            <q-card-section>
              <p>Nombre: {{ tipoEmpaque.nombre }}</p>
              <p>Abreviacion: {{ tipoEmpaque.abreviacion }}</p>
              <p>Cantidad: {{ tipoEmpaque.cantidad }} {{ row.abreviacion }}</p>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </Tabla>
  </NuxtLayout>
  <popup v-model="estado.modal.formCrearMedida" titulo="Nueva medida">
    <template #body>
      <formMedida @crearObjeto="handleMedidaCreada" />
    </template>
  </popup>
  <popup
    v-model="estado.modal.formModificarMedida"
    titulo="Modificar una medida"
  >
    <template #body>
      <formMedida
        :edicion="estado.medida"
        @modificarObjeto="handleMedidaModificada"
      />
    </template>
  </popup>
</template>

<script setup lang="ts">
import { useMedidas } from './medidas.composable';
const {
  estado,
  store,
  authStore,
  router,
  rowsTabla,
  handleMedidaCreada,
  handleMedidaModificada,
} = useMedidas();

import MedidaImage from '@/assets/img/noHayMedida.png';
import formMedida from '@/modulos/almacen/forms/formMedida.vue';

provide('infoPagina', {
  titulo: 'Gestion de medidas',
  camino: [{ label: 'medidas', to: 'medidas' }],
});

const columnsTabla = [
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
  },
  {
    name: 'abreviacio',
    label: 'Abreviacion',
    style: 'width:50px; margin:5px; padding: 5px; width:100%',
    align: 'left',
    field: (row: any) => row.abreviacion,
    sortable: true,
  },
  {
    name: 'actions',
    label: '',
    align: 'center',
    slot: true,
  },
];
</script>
