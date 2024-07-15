<template>
  <Navigation2
    :nav="[{ label: 'ofertas', to: 'ofertas' }]"
    titulo="Gestion de ofertas"
  />
  <div>
    <Table :rows="rowsParaMostrar" :columns="columnaOfertas">
      <!-- AGREGAR -->

      <template #dropdown>
        <div class="flex gap-3">
          <input-text
            class="col-span-1"
            label="Buscar"
            @update="(v) => (estado.filtros.buscarFiltro = v)"
            porDefecto=""
            noSlot
          />
          <q-select
            v-model="ofertaStore.catalogoSeleccionado"
            :options="estado.catalogos"
            option-label="nombre"
            label="Selecciona un catalogo"
            style="width: 170px"
            dense
            filled
            color="black"
            bg-color="orange-5"
            @update:model-value="ctrlCatalogoCambios"
          />
          <q-btn
            icon-right="add"
            color="green"
            label="Crear oferta"
            no-caps
            style="padding: 7px 15px"
            @click="() => (estado.modal.show_crearOfertaBasico = true)"
          />
        </div>
      </template>

      <template #body-cell-nombre="{ val, row }">
        <h1 v-if="row.nombre" class="tooltip">
          {{
            row.nombre.length > 30
              ? row.nombre.slice(0, 30) + '...'
              : row.nombre
          }}
          <span
            class="tooltiptext shadow-lg text-blue-500 font-semibold bg-white px-4 py-1"
            >{{ row.nombre }}</span
          >
        </h1>
      </template>

      <template #body-cell-catalogo="{ val, row }">
        <h1>{{ val.nombre }}</h1>
      </template>
      <template #body-cell-actions="{ val, row }">
        <q-btn
          color="primary"
          icon="visibility"
          round
          dense
          padding="1px"
          size="11px"
          @click="() => {}"
        >
          <q-tooltip> Ver informacion producto </q-tooltip>
        </q-btn>

        <q-btn
          color="orange"
          icon="edit"
          round
          dense
          padding="1px"
          size="10px"
          @click="() => irEdicionOfertas(row)"
        >
          <q-tooltip> Editar producto </q-tooltip></q-btn
        >
      </template>
      <template #body-expand="{ row }">
        <div
          style="
            display: grid;
            grid-gap: 16px;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          "
        >
          <!-- IMAGEN -->
          <div>
            <q-img
              v-if="row.imagen?.cloudinaryUrl"
              :src="row.imagen?.cloudinaryUrl"
              spinner-color="primary"
              spinner-size="82px"
              class="w-full h-auto object-cover"
            />
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
              ><h1 class="font-bold text-xs">CATEGORIA:</h1>
              <p>{{ row.catalogo.nombre }}</p></span
            >
          </div>
          <!-- PRODUCTOS -->
          <div>
            <h1 class="text-center bg-gray-300 font-bold py-[2px]">
              PRODUCTOS
            </h1>
            <span class="flex gap-2 items-center"
              ><h1 class="font-bold text-xs">PRODUCTO:</h1>
              <p>{{ row.ingredientes[0]?.producto?.nombre }}</p></span
            >
            <span class="flex gap-2 items-center"
              ><h1 class="font-bold text-xs">MARCA:</h1>
              <p>{{ row.ingredientes[0]?.marca }}</p></span
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
    </Table>
  </div>

  <!-- <div
              style="
                display: grid;
                grid-gap: 16px;
                grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
              "
            > -->
  <!-- IMAGEN -->
  <!-- <div>
                <q-img
                  v-if="props.row.imagen?.cloudinaryUrl"
                  :src="props.row.imagen?.cloudinaryUrl"
                  spinner-color="primary"
                  spinner-size="82px"
                  class="w-full h-auto object-cover"
                />
                <h1 v-else>No hay imagen...</h1>
              </div> -->
  <!-- DATOS BASICOS -->
  <!-- <div>
                <h1 class="text-center bg-gray-300 font-bold py-[2px]">
                  DATOS BASICOS
                </h1>
                <span class="flex gap-2 items-center"
                  ><h1 class="font-bold text-xs">NOMBRE:</h1>
                  <p>{{ props.row.nombre }}</p></span
                >
              </div>
            </div> -->

  <!-- OFERTA DATOS BASICOS -->
  <Dialog
    v-model="estado.modal.show_crearOfertaBasico"
    title="Crear oferta"
    label-btn="Crear"
    :handle-submit="crearOferta"
  >
    <template #inputsDialog>
      <!-- nombre -->
      <input-text
        label="Nombre"
        @update="(v) => (estado.datos_ofertaBasica.nombre = v)"
        info="Se debe modificar el nombre UNICAMENTE para corrigir su ortografia o mejorar su descriptividad, caso contrario toca crear una nueva oferta."
        :porDefecto="estado.datos_ofertaBasica.nombre"
        :rules="[useRules.requerido()]"
      />
      <!-- abreviacion -->
      <input-text
        label="Abreviación"
        @update="(v) => (estado.datos_ofertaBasica.abreviacion = v)"
        info="Se debe modificar el abreviacion UNICAMENTE para corrigir su ortografia o mejorar su descriptividad."
        :porDefecto="estado.datos_ofertaBasica.abreviacion"
      />

      <!-- Categoria -->
      <input-select
        label="Categoria"
        @update="
          (v) => {
            estado.datos_ofertaBasica.catalogo = v;
          }
        "
        :porDefecto="estado.datos_ofertaBasica.catalogo"
        :rules="[useRules.requerido()]"
        :opciones="estado.categoriaOpciones"
        info="Seleccione la categoria a la que pertenecera a esta oferta."
      />

      <!-- Imagen -->
      <input-image
        label="Imagen"
        @update="
          (base64Data, mimetype) =>
            (estado.datos_ofertaBasica.imagen = base64Data
              ? { data: base64Data, mimetype: mimetype }
              : null)
        "
        info="Por favor elija una foto para esta oferta, que se distinga claramente ante un fondo claro y unido. Prefiera un formato cuadrado."
        icono="photo_camera"
        :rules="[]"
        :porDefecto="estado.datos_ofertaBasica.imagen"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Table from '@/components/input/Table.vue';
import { useOferta } from '@/modulos/ofertas/negocio/oferta.composable.js';
import { columnaOfertas } from '../utils/columns';
import Oferta from '@/assets/img/oferta.png';
import { storeOferta } from '@/modulos/ofertas/negocio/oferta.store.js';
definePageMeta({
  layout: 'cathering',
});

const {
  estado,
  traerOfertas,
  traerCatalagos,
  ctrlCatalogoCambios,
  irEdicionOfertas,
  categoriaSelectOptions,
  crearOferta,
  actOfertasDB,
} = useOferta();
const ofertaStore = storeOferta();

const rowsParaMostrar = computed(() => {
  console.log(estado.ofertasFiltradas.length);
  let filtered = estado.ofertasFiltradas;
  console.log(filtered.length);
  // filtro por buscar que no discrimine maiusculas de minusculas y acentos
  if (estado.filtros.buscarFiltro != null) {
    filtered = filtered.filter((oferta) => {
      const regex = new RegExp(`${estado.filtros.buscarFiltro}`, 'i');
      return regex.test(
        oferta.nombre +
          oferta.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      );
    });
  }
  return filtered;
});

const { $socket } = useNuxtApp();

onMounted(async () => {
  await traerOfertas();
  await traerCatalagos();
  estado.categoriaOpciones = categoriaSelectOptions(true);

  // ofertaStore.obtenerOfertas();
  $socket.on('cambiosOfertas', async (data: any) => {
    await actOfertasDB();
  });
});
onBeforeUnmount(() => {
  $socket.off('cambiosOfertas');
});
</script>
<style scoped>
/* Estilo base del checkbox */
.weekday {
  display: none !important;
}
input[type='checkbox'] + label {
  display: inline-block;
  border-radius: 50%;
  background: #dddddd;
  height: 37px;
  width: 37px;
  line-height: 37px;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
}
input[type='checkbox']:checked + label {
  background: #007bff;
  color: #ffffff;
}
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  text-align: center;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap; /* Prevent text from wrapping onto new lines */
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>
