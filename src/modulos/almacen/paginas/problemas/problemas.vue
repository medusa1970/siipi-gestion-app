<template>
  <NuxtLayout
    :name="authStore.getNegocio.tipo === 'PUNTO' ? 'punto' : 'cathering'"
    titulo="Gestion de problemas"
    :navegacion="[{ label: 'Problemas', to: 'problemas' }]">
    <div
      style="
        display: grid;
        grid-gap: 16px;
        grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
        width: 100%;
      ">
      <input-select
        label="Producto"
        labelAdentro
        :opciones="selectProductoFiltro"
        @update="v => (estado.filtros.productoSeleccionado = v)"
        noSlot />
      <!-- <input-select
            label="Estado"
            labelAdentro
            @update="v => (estado.filtros.estado = v)"
            :opciones="[
              { value: 'soloResueltos', label: 'resueltos' },
              { value: 'soloPendientes', label: 'pendientes' }
            ]"
            noSlot /> -->
    </div>

    <Tabla
      :rows="rowsTablaPendientes"
      :columns="colunasTabla"
      :defaultImage="ProductoImage">
      <template #body-expand="{ row }">
        <p v-if="row.reporteResolucion">
          <b>Resolución :</b> {{ row.reporteResolucion }}
        </p>
        <p><b>Problemas :</b></p>
        <div class="flex">
          <q-card
            class="mr-3 mb-3"
            v-for="dif in row.diferencias"
            :key="dif._id">
            <q-card-section>
              <p>Marca {{ dif.marca.nombre }}</p>
              <p>
                Vence
                {{ dif.vencimiento ? fechaMes(dif.vencimiento) : '(sin)' }}
              </p>
              <p>
                {{
                  dif.diferencia > 0
                    ? `Hay ${dif.diferencia} por demás`
                    : `Faltan ${-dif.diferencia}`
                }}
              </p>
            </q-card-section>
          </q-card>
        </div>
      </template>
      <template #cell-acciones="{ row }">
        <q-btn-group push @click="e => e.stopPropagation()">
          <BtnAccion
            @click="
              estado.problemaID = row._id;
              estado.showModal.resolver = true;
            "
            icono="search"
            color="orange">
            <q-tooltip> Modificar </q-tooltip>
          </BtnAccion>
        </q-btn-group>
      </template>
    </Tabla>

    <Popup v-model="estado.showModal.resolver" titulo="Resolucion de problema">
      <template #body>
        <formResolverProblema
          :edicion="problemaSeleccionado"
          @modificarObjeto="handleProblemaResuelto" />
      </template>
    </Popup>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Problema } from '#gql';
import { useProblemas } from './problemas.composable';
import ProductoImage from '@/assets/img/noHayProducto.png';
import formResolverProblema from '@/modulos/almacen/forms/formResolverProblema.vue';

const {
  estado,
  authStore,
  rowsTablaPendientes,
  rowsTablaResueltos,
  selectProductoFiltro,
  problemaSeleccionado,
  handleProblemaResuelto
} = useProblemas();

const colunasTabla = [
  {
    name: 'imagen',
    label: 'Imagen',
    imagen: true,
    align: 'center',
    field: (row: any) => row.producto.imagen?.cloudinaryUrl
  },
  {
    name: 'nombre',
    label: 'Producto',
    align: 'left',
    field: (row: any) => row.producto.nombre,
    sortable: true
  },
  {
    name: 'fecha',
    label: 'Fecha',
    align: 'left',
    field: (row: any) => fechaMes(row._creado),
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
