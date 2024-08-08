<template>
  <NuxtLayout name="cathering">
    <Tabla
      :rows="rowsTabla"
      :columns="colunasTabla"
      :defaultImage="ProductoImage"
    >
      <template #dropdown>
        <div
          style="
            display: grid;
            grid-gap: 16px;
            grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
            width: 100%;
          "
        >
          <input-select
            label="Producto"
            labelAdentro
            :opciones="selectProductoFiltro"
            @update="(v) => (estado.filtros.productoSeleccionado = v)"
            noSlot
          />
          <input-select
            label="Estado"
            labelAdentro
            @update="(v) => (estado.filtros.estado = v)"
            :opciones="[
              { value: 'soloResueltos', label: 'resueltos' },
              { value: 'soloPendientes', label: 'pendientes' },
            ]"
            noSlot
          />
        </div>
      </template>
      <template #body-expand="{ row }">
        <div class="flex">
          <q-card
            class="mr-3 mb-3"
            v-for="dif in row.diferencias"
            :key="dif._id"
          >
            <q-card-section>
              <p>{{ dif.marca.nombre }}</p>
              <p>{{ fechaMes(dif.vencimiento) }}</p>
              <p>
                {{
                  dif.diferencia > 0
                    ? `hay ${dif.diferencia} por demás`
                    : `están faltando ${-dif.diferencia}`
                }}
              </p>
            </q-card-section>
          </q-card>
        </div>
      </template>
      <template #body-cell-acciones="{ row }">
        <q-btn-group push>
          <q-btn
            color="green"
            icon="visibility"
            class="p-1"
            size="sm"
            @click="() => {}"
          >
            <q-tooltip> Ver informacion producto </q-tooltip>
          </q-btn>
          <q-btn
            @click="
              (e) => {
                e.stopPropagation();
                estado.problemaID = row._id;
                estado.showModal.resolver = true;
              }
            "
            icon="search"
            class="p-1"
            color="orange"
            size="sm"
          >
            <q-tooltip> Modificar </q-tooltip>
          </q-btn>
        </q-btn-group>
      </template>
    </Tabla>

    <Popup v-model="estado.showModal.resolver" titulo="Resolucion de problema">
      <template #body>
        <formResolverProblema
          :edicion="problemaSeleccionado"
          @modificarObjeto="handleProblemaResuelto"
        />
      </template>
    </Popup>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Problema } from "#gql";
import { useProblemas } from "./problemas.composable";
import ProductoImage from "@/assets/img/noHayProducto.png";
import formResolverProblema from "@/modulos/almacen/forms/formResolverProblema.vue";

const {
  estado,
  store,
  authStore,
  router,
  rowsTabla,
  selectProductoFiltro,
  problemaSeleccionado,
  handleProblemaResuelto,
} = useProblemas();

provide("infoPagina", {
  titulo: "Gestion de problemas",
  camino: [{ label: "Tesoreria", to: "tesoreria" }],
});

const colunasTabla = [
  {
    name: "imagen",
    label: "Imagen",
    imagen: true,
    align: "center",
    field: (row: any) => row.producto.imagen?.cloudinaryUrl,
  },
  {
    name: "nombre",
    label: "Producto",
    align: "left",
    field: (row: any) => row.producto.nombre,
    sortable: true,
  },
  {
    name: "fecha",
    label: "Fecha",
    align: "left",
    field: (row: any) => fechaMes(row._creado),
    sortable: true,
  },
  {
    name: "estado",
    label: "Resuelto",
    align: "left",
    field: (row: any) => (row.resuelto ? "SI" : "NO"),
    sortable: true,
  },
  {
    name: "acciones",
    label: "Accion",
    align: "center",
    slot: true,
  },
];
</script>
