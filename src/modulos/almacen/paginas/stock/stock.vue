<template>
  <NuxtLayout
    :name="authStore.getNegocio.tipo === 'PUNTO' ? 'punto' : 'cathering'"
    titulo="Gestion de stock"
    :navegacion="[{ label: 'Stock', to: 'stock' }]">
    <Tabla
      :rows="rowsParaMostrar"
      :columns="[
        {
          name: 'imagen',
          label: 'Imagen',
          imagen: true,
          align: 'left',
          field: row => row.producto.imagen?.cloudinaryUrl
        },
        {
          name: 'producto',
          required: true,
          slot: true,
          label: 'Producto',
          align: 'left',
          field: row => row.producto.nombre,
          sortable: true
        },
        // {
        //   name: 'cantidad',
        //   slot: true,
        //   label: 'Cantidad',
        //   align: 'left',
        //   field: (row) => row.producto.nombre,
        //   sortable: true,
        // },
        {
          name: 'alertaCantidad',
          slot: true,
          required: true,
          label: 'Cantidad',
          align: 'center',
          field: row => row.cantidadTotal,
          sortable: true
        },
        {
          name: 'alertaVencimiento',
          slot: true,
          required: true,
          label: 'Vencimiento',
          align: 'center',
          field: row => row.dias,
          sortable: true
        },
        {
          name: 'alertaInventario',
          required: true,
          slot: true,
          label: 'Inventario',
          align: 'center',
          field: row => row.diasHastaProximoInventario,
          sortable: true
        },
        {
          name: 'actions',
          label: 'Acciones',
          align: 'right',
          slot: true
        }
      ]"
      :defaultImage="ProductoImage">
      <template #dropdown>
        <div id="radiosAlertas">
          <q-radio
            label="Todos"
            v-model="estado.filtros.alerta"
            color="orange"
            no-caps
            val="" />
          <q-radio
            label="Stock bajo"
            v-model="estado.filtros.alerta"
            color="orange"
            no-caps
            val="cantidad" />
          <q-radio
            color="orange"
            no-caps
            label="Por vencer"
            v-model="estado.filtros.alerta"
            val="vencimiento" />
          <q-radio
            color="orange"
            no-caps
            label="Inventariar"
            v-model="estado.filtros.alerta"
            val="inventario" />
        </div>

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
            @update="(v) => (estado.filtros.buscar = v as string)"
            noSlot />
          <input-select
            label="Categoria"
            labelAdentro
            @update="v => (estado.filtros.categoriaSeleccionada = v)"
            :opciones="selectCategoriaFiltro"
            noSlot />
          <input-select
            label="Marca"
            labelAdentro
            @update="v => (estado.filtros.marcaSeleccionada = v)"
            :opciones="selectMarcaFiltro"
            noSlot />
        </div>
      </template>
      <template #cell-producto="{ val, row }">
        {{ row.producto.nombre }}
        <br />
        <q-badge
          v-for="marca in row.marcas"
          :key="marca._id"
          :color="
            marca.alertaCantidad === 2
              ? 'red'
              : marca.alertaCantidad === 1
              ? 'orange'
              : 'green'
          "
          class="mr-1 lowercase"
          >{{ marca.marca.nombre }} ({{ marca.cantidadTotal }})
        </q-badge>
      </template>

      <template #cell-cantidad="{ val, row }">
        Total :
        <br />
        {{ row.cantidadTotal }} {{ row.producto.medida.abreviacion }}
      </template>

      <!-- Alerta cantidad -->
      <template #cell-alertaCantidad="{ val, row }">
        <div v-if="row.alertaCantidad === 2">
          <q-icon name="report" color="red" size="sm" />
        </div>
        <div v-else-if="row.alertaCantidad === 1">
          <q-icon name="report" color="orange" size="sm" />
        </div>
        <div>{{ row.cantidadTotal }} {{ row.producto.medida.abreviacion }}</div>
      </template>

      <!-- Alerta Vencimiento -->
      <template #cell-alertaVencimiento="{ row }">
        <div v-if="row.alertaVencimiento === 1">
          <q-icon name="report" color="orange" size="sm" />
        </div>
        <div v-else-if="row.alertaVencimiento === 2">
          <q-icon name="report" color="red" size="sm" />
        </div>
        <div>
          {{
            !row.producto.puedeVencer
              ? '-'
              : row.vencimientoAvisoSuave === 0
              ? 'Sin alerta'
              : row.diasHastaProximoVencimiento < 0
              ? `Vencido desde ${-row.diasHastaProximoVencimiento} días`
              : row.diasHastaProximoVencimiento > 0
              ? `Vence en ${row.diasHastaProximoVencimiento} días`
              : 'Vence hoy'
          }}
        </div>
      </template>

      <!-- alerta Inventario -->
      <template #cell-alertaInventario="{ val, row }">
        <!-- <div v-if="row.stock.lotes.find((l) => !l.bloque)">
        <q-icon name="report" color="blue" size="sm" />
      </div> -->

        <div v-if="row.stock.lotes.filter(lote => !lote.bloque).length > 0">
          <q-icon name="report" color="blue" size="sm" />
          <div>Pedido recibido</div>
        </div>
        <div v-else-if="row.alertaInventario > 0">
          <q-icon
            name="report"
            :color="[null, 'orange', 'red', 'blue'][row.alertaInventario]"
            size="sm" />
          <div v-if="row.diasHastaProximoInventario != null">
            {{
              row.diasHastaProximoInventario < 0
                ? `Atrasado ${-row.diasHastaProximoInventario} días`
                : row.diasHastaProximoInventario >= 2
                ? `Toca en ${row.diasHastaProximoInventario} días`
                : row.diasHastaProximoInventario === 1
                ? `Toca mañana`
                : 'Toca hoy'
            }}
          </div>
        </div>
        <div v-else>-</div>
      </template>

      <template #cell-actions="{ row }">
        <q-btn-group push @click="e => e.stopPropagation()">
          <q-btn
            class="p-1"
            color="orange"
            size="sm"
            icon="shopping_cart"
            @click="" />
          <q-btn
            class="p-1"
            color="green"
            size="sm"
            icon="list_alt"
            @click="
              {
                producto = row.stock.producto;
                estado.modal.formInventario = true;
              }
            " />
          <q-btn
            v-if="authStore.getNegocio.tipo !== 'PUNTO'"
            class="p-1"
            color="black"
            size="sm"
            icon="edit"
            @click="goTo(router, 'producto', { id: row.producto._id })" />
        </q-btn-group>
      </template>

      <template #body-expand="{ row }">
        <p>
          <b>Ultimo inventario :</b>
          <span v-if="row.fechaUltimoInventario == null"> Nunca </span>
          <span v-else-if="row.diasDesdeUltimoInventario === 0"> hoy</span>
          <span v-else>
            hace {{ row.diasDesdeUltimoInventario }} día{{
              row.diasDesdeUltimoInventario > 1 ? 's' : ''
            }}
          </span>
        </p>
        <div class="flex">
          <!--q-card
            class="mr-3 mb-3"
            v-for="marca in row.marcas"
            :key="marca._id"
          >
            <q-card-section class="bg-blue-100">
              <p>{{ marca.marca.nombre }}</p>
              <p>total: {{ marca.cantidadTotal }}</p>
              <p>alertaC: {{ marca.alertaCantidad }}</p>
              <p>alertaV: {{ marca.alertaVencimiento }}</p>
              <p>alertaI: {{ marca.alertaInventario }}</p>
              <p>dias: {{ marca.diasVencimiento }}</p>
              <p>limitC: {{ marca.cantidadLimite }}</p>
            </q-card-section>
          </q-card-->
          <q-card
            class="mr-3 mb-3"
            v-for="lote in row.stock.lotes"
            :key="lote._id">
            <q-card-section>
              <p>{{ lote.marca.nombre }}</p>
              <p
                v-if="row.producto.puedeVencer"
                :class="lote.alertaVencimiento > 0 ? 'text-red-500 ' : ''">
                Vencimiento:
                {{ lote.vencimiento ? fechaMes(lote.vencimiento) : '-' }}
              </p>
              <p>Cantidad: {{ lote.cantidad }}</p>
              <p v-if="lote.bloque">
                Bloque: {{ getBloque(lote.bloque)?.nombre }}
              </p>
              <p v-else class="text-red-500">Sin bloque</p>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </Tabla>
  </NuxtLayout>

  <Popup v-model="estado.modal.formInventario" titulo="Hacer un inventario">
    <template #body>
      <formInventario :producto @hacerInventario="handleInventario" />
    </template>
  </Popup>
</template>

<script setup lang="ts">
import { useStock } from './stock.composable';
const {
  estado,
  authStore,
  router,
  handleInventario,
  selectCategoriaFiltro,
  selectMarcaFiltro,
  getBloque,
  rowsParaMostrar
} = useStock();

import formInventario from '@/modulos/almacen/forms/formInventario.vue';
import ProductoImage from '@/assets/img/noHayProducto.png';

// producto seleccionado al hacer click en una accion
const producto = ref(null);
</script>
