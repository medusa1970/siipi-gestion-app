<template>
  <div>
    <Navigation label="Ofertas" icon="folder" />
    <h1 class="text-lg font-extrabold uppercase text-center">
      Gestion de ofertas
    </h1>
    <Table :rows="estado.ofertas" :columns="columnaOfertas" badge dense>
      <!-- AGREGAR -->
      <template #dropdown>
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
              dense
              flat
              round
              size="12px"
              padding="2px"
            >
              <q-tooltip> Ver informacion de oferta </q-tooltip>
            </q-btn>
            <q-btn
              color="primary"
              icon="edit"
              dense
              flat
              round
              size="12px"
              padding="2px"
            />
            <q-btn
              color="red"
              icon="delete"
              dense
              flat
              round
              size="12px"
              padding="2px"
            />
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
  >
    <template #inputsDialog>
      <!-- Imagen -->
      <input-image
        label="Imagen"
        info="Por favor elija una foto del producto solo, que se distinga claramente ante un fondo claro y unido. Prefiera un formato cuadrado."
        @update="
          (v) =>
            (estado.datos_ofertaBasica.imagen = {
              data: v,
              mimetype: 'image/png',
            })
        "
        icono="photo_camera"
      />

      <!-- Nombre -->
      <input-text
        label="Nombre"
        info="Por favor antes de crear un producto, asegúrese que no existe todavá. Ayúdese del buscador de la tabla."
        @update="(v) => (estado.datos_ofertaBasica.nombre = v)"
        requerido
      />

      <!-- Abreviacion -->
      <input-text
        label="Abreviación"
        info="Por favor antes de crear un producto, asegúrese que no existe todavá. Ayúdese del buscador de la tabla."
        @update="(v) => (estado.datos_ofertaBasica.abreviacion = v)"
        requerido
      />

      <!-- Catalogo -->
      <!-- <div>
        <input-dropdown
          label="Catalogo"
          :options="text"
          info="La categoría existe solamente a fines de ubicar facilmente el producto en administracion. Para crear una nueva categoria, vaya al menu Logistica > Categorías."
          @update="(v) => (estado.datos_ofertaBasica.catalogo = v)"
          requerido
        />
      </div> -->
      <!-- <q-select
        class="col-span-3"
        v-model="estado.oferta.catalogo"
        :options="estado.catalogos.hijas"
        label="Seleccionar catalogo"
        option-label="nombre"
        style="width: 100%; flex: 1 0 auto"
        outlined
        onfocus="this.select()"
        use-input
        hide-selected
        fill-input
        dense
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="bi-cart-plus" />
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No hay resultados
            </q-item-section>
          </q-item>
        </template>
      </q-select> -->
      <!-- <code>{{ estado.oferta.catalogo.hijas }}</code> -->
      <!-- <div class="select-container">
        <select
          id="two-level-select"
          class="border border-gray-400 rounded-[4px] shadow-sm text-base block w-full py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="" disabled selected>Selecciona una categoria</option>
          <optgroup
            v-for="categoria in estado.oferta.catalogo.hijas"
            :key="categoria"
            :label="`${categoria.nombre} ( ${categoria.hijas.length} )`"
          >
            <option
              v-for="subCategoria in categoria.hijas"
              :key="subCategoria"
              :value="subCategoria"
            >
              {{ subCategoria.nombre }}
            </option>
          </optgroup>
        </select>
      </div> -->
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

const { estado, traerOfertas, traerCatalagos } = useOferta();
const ofertaStore = storeOferta();

onMounted(async () => {
  await traerOfertas();
  await traerCatalagos();

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
