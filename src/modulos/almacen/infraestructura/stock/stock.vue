<template>
  <Navigation2
    :nav="[
      {
        label: 'stock',
        to: 'stock',
      },
    ]"
    titulo="Gestion de stock"
  />

  <Table
    :rows="rowsParaMostrar"
    :columns="[
      {
        name: 'imagen',
        label: 'Imagen',
        imagen: true,
        align: 'left',
        field: (row) => row.producto.imagen?.cloudinaryUrl,
      },
      {
        name: 'producto',
        required: true,
        slot: true,
        label: 'Producto',
        align: 'left',
        field: (row) => row.producto.nombre,
        sortable: true,
      },
      {
        name: 'alertaCantidad',
        slot: true,
        required: true,
        label: 'Cantidad',
        align: 'center',
        field: (row) => row.cantidadTotal,
        sortable: true,
      },
      {
        name: 'alertaVencimiento',
        slot: true,
        required: true,
        label: 'Vencimiento',
        align: 'center',
        field: (row) => row.dias,
        sortable: true,
      },
      {
        name: 'alertI',
        slot: true,
        required: true,
        label: 'Inventario',
        align: 'center',
        field: (row) => row.alertaInventario,
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'right',
        slot: true,
      },
    ]"
    :defaultImage="ProductoImage"
  >
    <template #dropdown>
      <div id="radiosAlertas">
        <q-radio
          label="Todos"
          v-model="estado.filtros.alerta"
          color="orange"
          no-caps
          val=""
        />
        <q-radio
          label="Stock bajo"
          v-model="estado.filtros.alerta"
          color="orange"
          no-caps
          val="cantidad"
        />
        <q-radio
          color="orange"
          no-caps
          label="Por vencer"
          v-model="estado.filtros.alerta"
          val="vencimiento"
        />
        <q-radio
          color="orange"
          no-caps
          label="Inventariar"
          v-model="estado.filtros.alerta"
          val="inventario"
        />
      </div>

      <div class="flex w-full">
        <input-text
          clase="w-1/3"
          label="Buscar"
          @update="(v) => (estado.filtros.buscarFiltro = v)"
          porDefecto=""
          noSlot
        />
        <input-select
          clase="w-1/3"
          label="Categoria"
          @update="(v) => (estado.filtros.categoriaSeleccionada = v)"
          :opciones="estado.listaCategorias"
          noSlot
        />
        <input-select
          clase="w-1/3"
          label="Marca"
          @update="(v) => (estado.filtros.marcaSeleccionada = v)"
          :opciones="estado.listaMarcas"
          noSlot
        />
      </div>
    </template>
    <template #body-cell-producto="{ val, row }">
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

    <template #body-cell-cantidad="{ val, row }">
      Total :
      <br />
      {{ row.cantidadTotal }} {{ row.producto.medida.abreviacion }}
    </template>

    <template #body-cell-alertaVencimiento="{ row }">
      <div v-if="row.alertaVencimiento > 0">
        <q-icon
          name="report"
          :color="row.alertaVencimiento === 2 ? 'red' : 'orange'"
          size="sm"
        />
        <br />
      </div>
      {{
        row.diasVencimiento < 0
          ? `hace ${-row.diasVencimiento} días`
          : row.diasVencimiento > 0
          ? `en ${row.diasVencimiento} días`
          : 'hoy'
      }}
    </template>

    <template #body-cell-alertaCantidad="{ val, row }">
      <div v-if="row.alertaCantidad">
        <div v-if="row.alertaCantidad === 2">
          <q-icon name="report" color="red" size="sm" />
        </div>
        <div v-else-if="row.alertaCantidad === 1">
          <q-icon name="report" color="orange" size="sm" />
        </div>
      </div>
      {{ row.cantidadTotal }} {{ row.producto.medida.abreviacion }}
    </template>
    <template #body-cell-alertI="{ val, row }">
      <div v-if="val">
        <q-icon name="report" color="red" size="sm" />
      </div>
    </template>

    <template #body-cell-actions="{ row }">
      <q-btn-group
        push
        @click="
          (e) => {
            e.stopPropagation();
          }
        "
      >
        <q-btn
          class="p-1"
          color="orange"
          size="sm"
          icon="shopping_cart"
          @click=""
        />
        <q-btn class="p-1" color="green" size="sm" icon="list_alt" @click="" />
        <q-btn
          class="p-1"
          color="black"
          size="sm"
          icon="edit"
          @click="goTo(router, 'producto', { id: row.producto._id })"
        />
      </q-btn-group>
    </template>

    <template #body-expand="{ row }">
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
          :key="lote._id"
        >
          <q-card-section>
            <p>{{ lote.marca.nombre }}</p>
            <p :class="lote.alertaVencimiento > 0 ? 'text-red-500 ' : ''">
              Vencimiento: {{ fechaMes(lote.vencimiento) }}
            </p>
            <p>Cantidad: {{ lote.cantidad }}</p>
            <p>Bloque: {{ lote.bloque }}</p>
            <!--p>alerta: {{ lote.alertaVencimiento }}</p>
              <p>dias: {{ lote.diasVencimiento }}</p>
              <p>limitV: {{ row.producto.vencimientoLimite }}</p-->
          </q-card-section>
        </q-card>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
// Layout y metadata
definePageMeta({
  layout: 'cathering',
});

// imports y inicializaciones
import ProductoImage from '@/assets/img/producto.png';
import { useStock } from './stock.composable';
import { useAlmacen } from '@/modulos/almacen/negocio/almacen.composable';
import Table from '@/components/input/Table.vue';
import { ref } from 'vue';
const router = useRouter();
const almacen = useAlmacen();
const {
  estado,
  store,
  service,
  getCategoriaList,
  obtenerTodoStock,
  categoriaSelectOptionsFiltro,
} = useStock();

const rowsParaMostrar = computed(() => {
  let filtered = estado.stocks;
  // filtro por alertas
  if (estado.filtros.alerta === 'cantidad') {
    filtered = filtered.filter((stock) => stock.alertaCantidad > 0);
  }
  if (estado.filtros.alerta === 'vencimiento') {
    filtered = filtered.filter((stock) => stock.alertaVencimiento > 0);
  }
  if (estado.filtros.alerta === 'inventario') {
    filtered = filtered.filter((stock) => stock.alertaInventariar > 0);
  }
  // filtro por categoria
  if (
    estado.filtros.categoriaSeleccionada != null &&
    estado.filtros.categoriaSeleccionada !== ''
  ) {
    filtered = filtered.filter((stock) =>
      getCategoriaList(estado.filtros.categoriaSeleccionada).includes(
        stock.producto.categoria._id,
      ),
    );
  }
  // filtro por marca
  if (
    estado.filtros.marcaSeleccionada != null &&
    estado.filtros.marcaSeleccionada !== ''
  ) {
    filtered = filtered.filter((stock) =>
      Object.keys(stock.marcas).includes(estado.filtros.marcaSeleccionada),
    );
  }
  // filtro por buscar que no discrimine maiusculas de minusculas y acentos
  if (estado.filtros.buscarFiltro != null) {
    filtered = filtered.filter((stock) => {
      const regex = new RegExp(`${estado.filtros.buscarFiltro}`, 'i');
      return regex.test(
        stock.producto.nombre +
          stock.producto.nombre
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''),
      );
    });
  }
  return filtered;
});

// Reactives y inicializaciones
onMounted(async () => {
  await obtenerTodoStock();
  estado.listaCategorias = await categoriaSelectOptionsFiltro();
  estado.listaMarcas = quitarDuplicados(
    estado.stocks.reduce((accumulator, currentValue) => {
      const opciones = Object.values(currentValue.marcas).map((marca) => {
        return { label: marca.marca.nombre, value: marca.marca._id };
      });
      return [...accumulator, ...opciones];
    }, []),
    (a, b) => a.value === b.value,
  );
});
</script>

<style scoped>
#radiosAlertas {
  font-size: 12px;
  margin: auto;
}
</style>
