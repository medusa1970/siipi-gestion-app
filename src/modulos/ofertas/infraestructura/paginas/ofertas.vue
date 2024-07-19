<template>
  <Navigation2
    :nav="[{ label: 'ofertas', to: 'ofertas' }]"
    titulo="Gestion de ofertas"
  />
  <div>
    <Tabla :rows="rowsParaMostrar" :columns="columnaOfertas">
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
            :options="
              estado.catalogos.filter(
                (catalogo) => catalogo.nombre !== 'CATALOGO PROVEEDORES',
              )
            "
            option-label="nombre"
            label="Selecciona un catalogo"
            style="width: 170px"
            dense
            filled
            bg-color="grey-5"
            @update:model-value="ctrlCatalogoCambios"
          />
          <q-btn
            icon-right="add"
            color="green"
            label="Oferta básica"
            no-caps
            style="padding: 7px 15px"
            @click="() => (estado.modal.show_crearOfertaBasico = true)"
          />
          <q-btn
            icon-right="add"
            color="green"
            label="Oferta completa"
            no-caps
            style="padding: 7px 15px"
            @click="() => (estado.modal.show_crearOfertaSimple = true)"
          />
        </div>
      </template>

      <template #body-cell-estado="{ row }">
        {{ fechaMes(row._modificado ?? row._creado) }}
        <br />
        <q-badge
          v-if="
            // row.empaques.length > 0 &&
            // row.comentario &&
            row.nombre &&
            row.abreviacion &&
            row.catalogo &&
            row.imagen &&
            row.precioSinFactura &&
            row.precioConFactura &&
            row.ingredientes.length > 0
          "
          color="green"
        >
          completo
        </q-badge>
        <q-badge v-else color="orange"> incompleto </q-badge>
      </template>

      <template #body-cell-nombre="{ val, row }">
        <h1 v-if="row.nombre" class="tooltip font-semibold">
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
        <div class="flex" v-if="row.ingredientes?.length > 0">
          <div v-for="ingrediente in row.ingredientes" :key="ingrediente._id">
            <q-badge color="green" class="mr-1 mb-1 lowercase">
              {{ ingrediente.producto.nombre }}
            </q-badge>
            <q-badge color="orange" class="mr-1 mb-1 lowercase">
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

      <!-- <template #body-cell-catalogo="{ val, row }">
        <h1>{{ val.nombre }}</h1>
      </template> -->

      <template #body-cell-acciones="{ val, row }">
        <q-btn-group push @click="(e) => e.stopPropagation()">
          <q-btn
            color="green"
            icon="visibility"
            class="p-1"
            size="sm"
            @click="() => {}"
          >
            <q-tooltip> Ver informacion oferta </q-tooltip>
          </q-btn>

          <q-btn
            color="black"
            icon="edit"
            class="p-1"
            size="sm"
            @click="() => irEdicionOfertas(row)"
          >
            <q-tooltip> Editar producto </q-tooltip></q-btn
          >
        </q-btn-group>
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
  </div>

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

  <Popup v-model="estado.modal.show_crearOfertaSimple" titulo="Nueva Oferta">
    <template #body>
      <formOfertaProducto @crearObjeto="handleOfertaCreada" />
    </template>
  </Popup>
</template>

<script setup lang="ts">
import Table from '@/components/input/Table.vue';
import { useOferta } from '@/modulos/ofertas/negocio/oferta.composable';
import { columnaOfertas } from '../utils/columns';
import Oferta from '@/assets/img/oferta.png';
import formOfertaProducto from '@/modulos2/oferta_temp/forms/formOfertaProducto.vue';
import { storeOferta } from '@/modulos/ofertas/negocio/oferta.store';
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
  handleOfertaCreada,
} = useOferta();
const ofertaStore = storeOferta();

const rowsParaMostrar = computed(() => {
  // console.log(estado.ofertasFiltradas.length);
  let filtered = estado.ofertasFiltradas;
  // console.log(filtered.length);
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
