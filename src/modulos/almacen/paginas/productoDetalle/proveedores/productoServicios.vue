<template>
  <Tabla
    :rows="rowsTabla"
    disableExpand
    :columns="[
      {
        name: 'proveedor',
        required: true,
        label: 'Proveedor',
        align: 'left',
        field: row => row.proveedor.nombre,
        sortable: true
      },
      {
        name: 'marca',
        required: true,
        label: 'Marca',
        align: 'center',
        field: row => row.marca.nombre,
        sortable: true
      },
      {
        name: 'identificativo',
        required: true,
        label: 'Identificativo',
        align: 'center',
        field: row => row.identificativo,
        sortable: true
      },
      {
        name: 'precioConFactura',
        required: true,
        label: 'Precio C/F',
        align: 'center',
        field: row => row.precioConFactura + ' Bs',
        sortable: true
      },
      {
        name: 'precioSinFactura',
        required: true,
        label: 'Precio S/F',
        align: 'center',
        field: row => row.precioSinFactura + ' Bs',
        sortable: true
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'right',
        slot: true
      }
    ]">
    <template #dropdown>
      <div class="flex">
        <input-text
          label="Buscar"
          labelAdentro
          @update="(v) => (estado.filtros.buscarFiltro = v as string)"
          class="col-span-1"
          noSlot />
        <q-btn
          @click="() => (estado.modal.formServicioCrear = true)"
          icon="add"
          color="green"
          no-caps
          padding="4px 10px" />
      </div>
    </template>
    <template #cell-actions="{ row }">
      <q-btn-group push @click="e => e.stopPropagation()">
        <q-btn
          @click="
            () => {
              estado.servicio = row;
              estado.entidadProveedorId = estado.servicio.proveedor._id;
              estado.modal.formServicioModificar = true;
            }
          "
          class="p-1"
          color="black"
          size="sm"
          icon="edit" />
      </q-btn-group>
    </template>
    <template #body-expand="{ row }">
      <pre>{{ row }}</pre>
    </template>
  </Tabla>

  <Popup
    v-model="estado.modal.formServicioModificar"
    titulo="Modificar el proveedor">
    <template #body>
      <formServicio
        :config="{
          proveedorId: estado.entidadProveedorId
        }"
        :edicion="estado.servicio"
        @modificarObjeto="handleServicioModificado" />
    </template>
  </Popup>

  <Popup
    v-model="estado.modal.formServicioCrear"
    titulo="Registrar nuevo proveedor">
    <template #body>
      <formServicio @crearObjeto="handleServicioCreado" />
    </template>
  </Popup>
</template>

<script setup lang="ts">
import { useProductoServicios } from './productoServicios.composable';
import formServicio from '@/modulos/almacen/forms/formServicio.vue';
const { $socket } = useNuxtApp();
const {
  estado,
  store,
  getServiciosProducto,
  handleServicioCreado,
  handleServicioModificado
} = useProductoServicios();

/**
 * Rows para la tabla
 */
const rowsTabla = computed(() => {
  let filtered = estado.servicios;
  if (!filtered) return [];
  if (estado.filtros.buscarFiltro != null) {
    const regex = new RegExp(`${estado.filtros.buscarFiltro}`, 'i');
    filtered = filtered.filter(servicio => {
      return regex.test(
        servicio.proveedor?.nombre +
          servicio.proveedor?.nombre
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') +
          servicio.marca.nombre +
          servicio.marca.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      );
    });
  }
  return filtered;
});
</script>

<style lang="scss" scoped></style>
