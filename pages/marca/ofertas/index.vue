<template>
  <div>
    <Navigation label="Ofertas" icon="folder" />
    <Table :rows="estado.ofertas" :columns="columnsOfertas" badge dense>
      <!-- AGREGAR -->
      <template #dropdown>
        <NuxtLink href="ofertas/detailOferta">
          <q-btn
            icon-right="add"
            color="green"
            label="Agregar oferta"
            no-caps
            style="padding: 7px 15px"
            @click="abrirAgregarOferta"
          />
        </NuxtLink>
      </template>
      <!-- BADGE -->
      <template #rows-badge="{ props }">
        <q-tr :props="props">
          <q-td key="nombre" :props="props">
            {{ props.row.nombre }}
          </q-td>
          <q-td key="ingredientes" :props="props">
            <!-- <code>{{ props.row.ingredientes }}</code> -->
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
                  <!-- <h1>{{ ingrediente }}</h1> -->
                  <div v-if="ingrediente._tipo === 'IngredienteEleccion'">
                    <q-badge color="green" class="capitalize">
                      {{ ingrediente._tipo }}
                    </q-badge>
                    <span class="flex gap-2">
                      <p>Grupo: {{ ingrediente.nombre }}</p>
                    </span>
                    <span class="flex gap-2"
                      ><h1>CantidadMin: {{ ingrediente.cantidadMin }}</h1>
                      <h1>CantidadMax: {{ ingrediente.cantidadMax }}</h1></span
                    >
                    <h1>PRODUCTOS:</h1>
                    <span class="grid grid-cols-2">
                      <div
                        v-for="item in ingrediente.items"
                        :key="item.producto"
                        class="px-2"
                      >
                        <h1>Id: {{ item.producto._id }}</h1>
                        <h1>Cantidad: {{ item.cantidad }}</h1>
                        <h1>Precio Adc: {{ item.costoAdicional }}Bs</h1>
                      </div>
                    </span>
                  </div>
                  <div v-if="ingrediente._tipo === 'IngredienteProducto'">
                    <q-badge color="red" class="capitalize">
                      {{ ingrediente._tipo }} FIJO
                    </q-badge>
                    <h1>Producto: {{ ingrediente.producto.nombre }}</h1>
                    <h1>Cantidad: {{ ingrediente.cantidad }}</h1>
                  </div>

                  <!-- <span class="flex gap-2 leading-none">
                    <p>Vencimiento:</p>
                    <q-badge color="red" class="capitalize">
                      {{ formatDate(lote.vencimiento) }}
                    </q-badge>
                  </span>
                  <span class="flex gap-2">
                    <p>Bloque:</p>
                    <q-badge color="green" class="capitalize">
                      {{ lote.bloque }}
                    </q-badge> </span
                  ><span class="flex gap-2">
                    <p>Cantidad:</p>
                    <q-badge color="orange" class="capitalize">
                      {{ lote.cantidad }}
                    </q-badge>
                  </span> -->
                </div>
              </div>
            </q-popup-edit>
          </q-td>
          <q-td key="preparados" :props="props">
            <span v-if="props.row.preparados">
              <h1 class="text-red-500" v-if="props.row.preparados.length === 0">
                Vacio
              </h1>
              <h1 v-if="props.row.preparados.length > 0">
                {{ props.row.preparados.length }}
              </h1>
            </span>
          </q-td>
          <q-td key="grupos" :props="props">
            <div v-for="(grupo, index) in props.row.grupos" :key="index">
              <q-badge color="green">
                {{ grupo }}
              </q-badge>
            </div>
          </q-td>
          <q-td key="precio" :props="props">
            {{ props.row.precio + ' Bs' }}
          </q-td>
          <q-td key="ocultar" :props="props">
            <q-toggle v-model="props.row.ocultar" />
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
            <q-btn color="red" icon="delete" dense flat round size="13px" />
            <!-- <q-btn color="red" icon="more_horiz" flat round>
              <q-menu
                transition-show="rotate"
                transition-hide="rotate"
                anchor="top start"
                self="top right"
              >
                <q-list dense style="min-width: 100px">
                  <q-item clickable v-close-popup class="test">
                    <q-icon name="edit" size="20px" color="blue" />
                    <q-item-section class="font-bold">Editar</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup class="test">
                    <q-icon name="delete" size="20px" color="red" />
                    <q-item-section class="font-bold">Eliminar</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn> -->
          </q-td>
        </q-tr>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { columnsOfertas } from '@/helpers/columns';
import { useOferta } from '@/composables/marca/useOferta';

const { estado, storeOferta, abrirEditarOferta, abrirAgregarOferta } =
  useOferta();
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
