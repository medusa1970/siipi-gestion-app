<template>
  <Tabla :rows="rowsParaMostrar" :columns="columnaOfertas" :paginacion="9">
    <!-- AGREGAR -->

    <template #dropdown>
      <div
        style="
          display: grid;
          grid-gap: 16px;
          grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
          width: 100%;
        ">
        <input-text
          label="Buscar"
          labelAdentro
          @update="v => (estado.filtros.buscar = v)"
          noSlot />

        <input-select
          label="Estado"
          labelAdentro
          @update="v => (estado.filtros.completud = v)"
          :opciones="[
            { value: 'soloCompletos', label: 'solo completas' },
            { value: 'soloIncompletos', label: 'solo incompletas' }
          ]"
          noSlot />
      </div>
    </template>

    <template #cell-estado="{ row }">
      {{ fechaMes(row._modificado ?? row._creado) }}
      <br />
      <q-badge v-if="!ofertaIncompleta(row)" color="green"> completo </q-badge>
      <q-badge v-else color="orange"> incompleto </q-badge>
    </template>

    <template #cell-nombre="{ val, row }">
      <h1 v-if="row.nombre" class="tooltip font-semibold">
        {{
          row.nombre.length > 30 ? row.nombre.slice(0, 30) + '...' : row.nombre
        }}
        <span
          class="tooltiptext shadow-lg text-blue-500 font-semibold bg-white px-4 py-1"
          >{{ row.nombre }}</span
        >
      </h1>
      <div class="flex" v-if="row.ingredientes?.length > 0">
        <div v-for="ingrediente in row.ingredientes" :key="ingrediente._id">
          <q-badge color="darkblue" class="mr-1 mb-1 lowercase">
            {{ ingrediente.producto.nombre }} /
            {{ ingrediente.marca ? ingrediente.marca?.nombre : 'Sin marca' }}
          </q-badge>
        </div>
      </div>
      <div v-else><span class="aIngresar">Registrar una marca</span></div>
      <p style="white-space: normal">
        <span v-if="row.precioSinFactura"
          >precio S/F: <b>{{ row.precioSinFactura }}Bs</b></span
        ><span v-else class="aIngresar">Sin precio S/F</span> -
        <span v-if="row.catalogo">En: {{ row.catalogo?.nombre }}</span
        ><span v-else class="aIngresar">Sin precio C/F</span>
      </p>
    </template>

    <!-- <template #cell-catalogo="{ val, row }">
        <h1>{{ val.nombre }}</h1>
      </template> -->

    <template #cell-acciones="{ val, row }">
      <q-btn-group push @click="e => e.stopPropagation()">
        <btnAccion
          icono="edit black"
          @click="
            () => {
              ofertaStore.oferta = row;
              goTo(router, 'oferta', { id: row._id });
            }
          " />
      </q-btn-group>
    </template>

    <template #body-expand="{ row }">
      <div
        style="
          display: grid;
          grid-gap: 16px;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        ">
        <!-- IMAGEN -->
        <div>
          <q-img
            v-if="row.imagen?.cloudinaryUrl"
            :src="row.imagen?.cloudinaryUrl"
            spinner-color="primary"
            spinner-size="82px"
            class="w-full h-auto object-cover" />
          <h1 v-else>No hay imagen...</h1>
        </div>
        <!-- DATOS BASICOS -->
        <div>
          <h1 class="text-center bg-gray-300 font-bold py-[2px]">
            DATOS BASICOS
          </h1>
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">NOMBRE:</h1>
            <p>{{ row.nombre }}</p></span
          >
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">ABREVIACION:</h1>
            <p>{{ row.abreviacion }}</p></span
          >
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">CATALOGO:</h1>
            <p>{{ row.catalogo.nombre }}</p></span
          >
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">DESCRIPCION:</h1>
            <p>{{ row.descripcion }}</p></span
          >
        </div>
        <!-- PRODUCTOS -->
        <div>
          <h1 class="text-center bg-gray-300 font-bold py-[2px]">PRODUCTOS</h1>
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">PRODUCTO:</h1>
            <p>{{ row.ingredientes[0]?.producto?.nombre }}</p></span
          >
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">MARCA:</h1>
            <p>{{ row.ingredientes[0]?.marca?.nombre }}</p></span
          >
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">CANTIDAD:</h1>
            <p>{{ row.ingredientes[0]?.cantidad }}</p></span
          >
        </div>
        <!-- PRECIOS -->
        <div>
          <h1 class="text-center bg-gray-300 font-bold py-[2px]">PRECIOS</h1>
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">PRECIO S/F:</h1>
            <p>{{ row.precioSinFactura }}</p></span
          >
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">PRECIO C/F:</h1>
            <p>{{ row.precioConFactura }}</p></span
          >
        </div>
      </div>
    </template>
  </Tabla>
</template>

<script setup lang="ts">
import { storeOferta } from '~/modulos/ofertas/ofertas.store';
import { useProductoOfertas } from './productoOfertas.composable';
const { estado, router, ofertaIncompleta, rowsParaMostrar } =
  useProductoOfertas();
const ofertaStore = storeOferta();

const columnaOfertas = [
  {
    name: 'imagen',
    label: 'Imagen',
    imagen: true,
    align: 'center',
    field: (row: any) => row.imagen?.cloudinaryUrl
  },
  {
    name: 'nombre',
    label: 'Nombre',
    align: 'left',
    field: (row: any) => row.nombre,
    sortable: true,
    slot: true
  },
  {
    name: 'estado',
    label: 'Modif.',
    align: 'right',
    field: (row: any) => row._modificado,
    slot: true,
    sortable: true
  },
  {
    name: 'acciones',
    label: 'Accion',
    align: 'center',
    slot: true
  }
];
</script>
