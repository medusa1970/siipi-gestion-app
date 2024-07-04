<template>
  <div>
    <Navigation label="Ofertas" icon="folder" />
    <h1 class="text-lg font-extrabold uppercase text-center">
      Gestion de ofertas '{{ estado.catalogoSeleccionado?.nombre }}'
    </h1>
    <Table
      :rows="estado.ofertasFiltradas"
      :columns="columnaOfertas"
      badge
      dense
    >
      <!-- AGREGAR -->

      <template #dropdown>
        <q-select
          v-model="estado.catalogoSeleccionado"
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
          style="padding: 7px 15px; margin-left: 10px"
          @click="() => (estado.modal.show_crearOfertaBasico = true)"
        />
      </template>
      <!-- BADGE -->
      <template #rows-badge="{ props }">
        <q-tr :props="props">
          <q-td key="imagen" :props="props" class="">
            <q-img
              v-if="props.row.imagen"
              :src="props.row.imagen.cloudinaryUrl"
              spinner-color="black"
              class="cell-image"
              width="40px"
              height="40px"
            />
            <q-img
              v-else
              :src="Oferta"
              spinner-color="black"
              class="cell-image"
              width="40px"
              height="40px"
            />
          </q-td>
          <q-td key="modificado" :props="props">
            <h1 :class="props.row._modificado ? '' : 'text-green-800'">
              {{ fechaMes(props.row._modificado ?? props.row._creado) }}
            </h1>
          </q-td>
          <q-td key="nombre" :props="props">
            <h1 v-if="props.row.nombre" class="tooltip">
              {{
                props.row.nombre.length > 30
                  ? props.row.nombre.slice(0, 30) + '...'
                  : props.row.nombre
              }}
              <span
                class="tooltiptext shadow-lg text-blue-500 font-semibold bg-white px-4 py-1"
                >{{ props.row.nombre }}</span
              >
            </h1>
          </q-td>
          <q-td key="ingredientes" :props="props">
            <h1 v-if="props.row.ingredientes[0]">
              {{ props.row.ingredientes.length }}
            </h1>
            <h1 v-else class="text-red-500">Vacio</h1>
            <q-popup-edit
              v-model="props.row.ingredientes"
              anchor="bottom end"
              self="bottom end"
            >
              <h1 class="font-bold">INGREDIENTES:</h1>
              <div class="grid grid-cols-2 gap-3">
                <div
                  v-for="ingrediente in props.row.ingredientes"
                  :key="ingrediente.nombre"
                >
                  <div v-if="ingrediente._tipo === 'IngredienteProducto'">
                    <q-badge color="red" class="capitalize">
                      {{ ingrediente._tipo }} FIJO
                    </q-badge>
                    <h1>Producto: {{ ingrediente.producto.nombre }}</h1>
                    <h1>Cantidad: {{ ingrediente.cantidad }}</h1>
                  </div>
                </div>
              </div>
            </q-popup-edit>
          </q-td>
          <q-td key="catalogo" :props="props">
            <h1 v-if="props.row.catalogo && props.row.catalogo.nombre">
              {{ props.row.catalogo.nombre }}
            </h1>
          </q-td>
          <q-td key="precio" :props="props">
            {{ props.row.precio + ' Bs' }}
          </q-td>
          <q-td key="actions" :props="props">
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
              @click="() => irEdicionOfertas(props.row)"
            >
              <q-tooltip> Editar producto </q-tooltip></q-btn
            >
          </q-td>
        </q-tr>
      </template>
    </Table>
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
        info="Se debe modificar el nombre UNICAMENTE para corrigir su ortografia o mejorar su descriptividad, caso contrario toca crear un nuevo producto."
        :porDefecto="estado.datos_ofertaBasica.nombre"
        :rules="[useRules.requerido()]"
      />
      <!-- abreviacion -->
      <input-text
        label="Abreviación"
        @update="(v) => (estado.datos_ofertaBasica.abreviacion = v)"
        info="Se debe modificar el abreviacion UNICAMENTE para corrigir su ortografia o mejorar su descriptividad, caso contrario toca crear un nuevo producto."
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
        info="Por favor elija una foto del producto solo, que se distinga claramente ante un fondo claro y unido. Prefiera un formato cuadrado."
        icono="photo_camera"
        :rules="[]"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'cathering',
});
import { useOferta } from '@/modulos/ofertas/negocio/oferta.composable.js';
import { columnaOfertas } from '../utils/columns';
import Oferta from '@/assets/img/oferta.png';
import { storeOferta } from '@/modulos/ofertas/negocio/oferta.store.js';

const {
  estado,
  traerOfertas,
  traerCatalagos,
  ctrlCatalogoCambios,
  irEdicionOfertas,
  categoriaSelectOptions,
  crearOferta,
} = useOferta();
const ofertaStore = storeOferta();

onMounted(async () => {
  await traerOfertas();
  await traerCatalagos();
  estado.categoriaOpciones = categoriaSelectOptions(true);

  // ofertaStore.obtenerOfertas();
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
