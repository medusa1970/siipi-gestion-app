<template>
  <div>
    <Navigation label="Ofertas" icon="folder" />
    <h1 class="text-lg font-extrabold uppercase text-center">
      Gestion de ofertas
    </h1>
    <Table :rows="estado.ofertas" :columns="columnsOfertas" badge dense>
      <!-- AGREGAR -->
      <template #dropdown>
        <!-- <code>{{ estado.catalogos?.hijas }}</code> -->
        <q-select
          v-model="estado.catalogoSeleccionado"
          :options="estado.catalogos?.hijas"
          option-label="nombre"
          label="Selecciona un catalogo"
          style="width: 170px"
          dense
          filled
          color="black"
          bg-color="orange-5"
          @update:model-value="handleSelectionChange"
        />
        <NuxtLink href="ofertas/detailOferta" class="ml-3">
          <q-btn
            icon-right="add"
            color="green"
            label="Crear oferta"
            no-caps
            style="padding: 7px 15px"
            @click="abrirAgregarOferta"
          />
        </NuxtLink>
      </template>
      <!-- BADGE -->
      <template #rows-badge="{ props }">
        <q-tr :props="props">
          <q-td key="creado" :props="props">
            <h1 v-if="props.row._creado">
              {{ fechaMes(props.row._creado) }}
            </h1>
          </q-td>
          <q-td key="modificado" :props="props">
            <h1 v-if="props.row._modificado == null" class="text-green-800">
              Nuevo
            </h1>
            <h1 v-else>
              {{ fechaMes(props.row._modificado) }}
            </h1>
          </q-td>
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
          <q-td key="nombre" :props="props">
            <h1 v-if="props.row.nombre">
              {{ props.row.nombre }}
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
              icon="edit"
              dense
              flat
              round
              size="13px"
              @click="abrirEditarOferta(props.row)"
            />
            <q-btn
              color="red"
              icon="delete"
              dense
              flat
              round
              size="13px"
              @click="borrarOferta(props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </Table>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'sede',
});
import { columnsOfertas } from '@/helpers/columns';
import { useOferta } from '@/composables/marca/useOferta';
import { onMounted, ref } from 'vue';
import { fechaMes } from '@/helpers/fecha';
// import {} from "@/as"
import Oferta from '@/assets/img/oferta.png';

const {
  estado,
  storeOferta,
  abrirEditarOferta,
  abrirAgregarOferta,
  borrarOferta,
  obtenerTodasofertas,
  obtenerTodosProductos,
  obtenerTodoCatalagosIdNombre,
  handleSelectionChange,
} = useOferta();

onMounted(() => {
  // obtenerTodasofertas();
  obtenerTodoCatalagosIdNombre();
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
</style>
