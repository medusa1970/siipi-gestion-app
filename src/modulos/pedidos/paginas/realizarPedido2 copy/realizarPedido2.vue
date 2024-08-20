<template>
  <NuxtLayout
    :name="authStore.getNegocio.tipo === 'PUNTO' ? 'punto' : 'cathering'"
    :titulo="'Catalogo ' + estado.catalogoSeleccionado?.nombre"
    :navegacion="[{ label: 'Ralizar pedido', to: 'realizarPedido2' }]">
    <Tabla
      :rows="rowsParaMostrar"
      :columns="columnsTabla"
      :paginacion="9"
      disableExpand>
      <!-- AGREGAR -->

      <template #dropdown>
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
            @update="v => (estado.filtros.buscarFiltro = v)"
            noSlot />

          <input-select
            label="Catalogo"
            labelAdentro
            :opciones="selectCatalogoFiltro"
            @update="v => (estado.filtros.catalogo = v)"
            noSlot />

          <!-- <input-checkbox
            label="Seleccionados ya"
            labelAdentro
            @update="v => (estado.filtros.seleccionados = v)"
            noSlot /> -->
        </div>
      </template>

      <template #cell-acciones="{ row }">
        <input type="number" @input="handleInputChange2($event, row)" min="0" />
      </template>
      <template #cell-nombre="{ val, row }">
        {{ row.nombre }}
      </template>
    </Tabla>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Catalogo } from '#gql';
import { apiPedido } from '../../API/pedidos.api';
import { useRealizarPedido2 } from './realizarPedido2';

const {
  estado,
  storePedidos,
  storeOfertas,
  authStore,
  router,
  handleInputChange2,
  ofertaIncompleta
} = useRealizarPedido2();

// opciones
const selectCatalogoFiltro = computed(() => {
  if (!estado.catalogoSeleccionado) return [];
  let options = [];
  for (const cat of estado.catalogoSeleccionado.hijas) {
    const idsHijas = [];
    const hijas = [];
    for (const subcat of cat.hijas) {
      hijas.push({
        label: subcat.nombre,
        value: [subcat._id],
        class: 'option'
      });
      idsHijas.push(subcat._id);
    }
    options.push({
      label: cat.nombre,
      value: [...idsHijas, cat._id]
    });
    options = [...options, ...hijas];
  }

  return options;
});

const rowsParaMostrar = computed(() => {
  let filtered = estado.ofertas;
  if (!filtered) return [];

  // filtro por catalogo
  if (estado.filtros.catalogo) {
    filtered = filtered.filter(oferta =>
      estado.filtros.catalogo.includes(oferta.catalogo._id)
    );
  }

  // filtro textual
  if (estado.filtros.buscarFiltro != null) {
    filtered = filtered.filter(oferta => {
      const regex = new RegExp(`${estado.filtros.buscarFiltro}`, 'i');
      return regex.test(
        oferta.nombre +
          oferta.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      );
    });
  }
  return filtered;
});

onMounted(async () => {
  const ofertasSt = await storeOfertas.getOfertas();
  const indexedOfertas = {};
  for (const oferta of ofertasSt) {
    Object.assign(indexedOfertas, { [oferta._id]: oferta });
  }
  const catalogoArbol = (await apiPedido.pedido_leerMenu(
    authStore.negocio._id,
    authStore.token
  )) as Catalogo;

  estado.catalogoSeleccionado = catalogoArbol;
  let ofertas = [];
  const f = catalogo => {
    ofertas = [
      ...ofertas,
      ...catalogo.ofertas.map(oferta => indexedOfertas[oferta._id])
    ];
    for (const hija of catalogo.hijas ?? []) {
      f(hija);
    }
  };
  f(catalogoArbol);
  estado.ofertas = ofertas.filter(oferta => !ofertaIncompleta(oferta));
});

// configuracion de la tabla
const columnsTabla = ref([
  {
    name: 'acciones',
    label: 'Accion',
    align: 'center',
    slot: true
  },
  {
    name: 'nombre',
    required: true,
    slot: true,
    label: 'Nombre',
    align: 'left',
    field: (row: any) => row.nombre,
    sortable: true
  }
]);
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
