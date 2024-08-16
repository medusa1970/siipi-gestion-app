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
    style: 'margin:5px; padding: 5px',
    align: 'center',
    field: (row: any) => row.persona.imagen?.cloudinaryUrl,
  },
  {
    name: 'nombre',
    label: 'Nombre',
    style: 'margin:5px; padding: 5px;',
    align: 'left',
    field: (row: any) => row.persona.nombre + ' ' +row.persona.apellido ,
    sortable: true,
  },
  {
    name: 'cargo',
    label: 'Cargo',
    style: 'margin:5px; padding: 5px;',
    align: 'left',
    field: (row: any) => row.cargos[0].nombre,
    sortable: true,
  },  
  {
    name: 'permisos',
    label: 'Permisos',
    style: 'margin:5px; padding: 5px;',
    align: 'left',
    field: (row: any) => row.permisos.length,
    sortable: true,
  },
  {
    name: 'actions',
    label: '',
    align: 'center',
    slot: true,
  },
]"
      :defaultImage="EmpleadoImage">
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
            @click="() => (estado.showModal.crearEmpleado = true)" />
        </div>
      </template>
      <template #cell-nombre="{ val, row }">
        {{ val }}
        <br />
        <i>{{ row.descripcion }}</i>
      </template>
      <template #cell-actions="{ row }">
        <q-btn-group push @click="e => e.stopPropagation()">
          <btnAccion
            icono="edit black"
            @click="goTo(router, 'empleado', { id: row._id })">
            <q-tooltip> Modificar </q-tooltip>
          </btnAccion>
        </q-btn-group>
      </template>
    </Tabla>
  </NuxtLayout>

  <Popup v-model="estado.showModal.crearEmpleado" titulo="Nuevo producto">
    <template #body>
      <formEmpleado @crearObjeto="handleEmpleadoCreado" />
    </template>
  </Popup>
</template>

<script setup lang="ts">
import { useEmpleados } from './empleados';
const { estado, store, authStore, router, rowsTabla, handleEmpleadoCreado } =
  useEmpleados();
import EmpleadoImage from '@/assets/img/noHayEmpleado.png';
import formEmpleado from '@/modulos/empresa/forms/formEmpleado.vue';

provide('infoPagina', {
  infoPagina: {
    titulo: 'Gestion de empleados',
    camino: [{ label: 'Empleados', to: 'empleados' }]
  }
});

onMounted(async () => {
  await store.getEmpleados();
});
</script>
