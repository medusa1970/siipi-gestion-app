<template>
  <NuxtLayout
    :name="authStore.getNegocio.tipo === 'PUNTO' ? 'punto' : 'cathering'"
    :titulo="'Catalogo ' + estado.catalogo?.nombre"
    :navegacion="[{ label: 'Ralizar pedido', to: 'realizarPedido' }]">
    <input-text
      label="Buscar"
      labelAdentro
      @update="(v) => (estado.filtros.buscarFiltro = v as string)"
      noSlot />

    <q-tabs v-model="panel" active-color="primary" indicator-color="primary">
      <q-tab
        v-for="item in rowsParaMostrar?.hijas"
        :key="item._id"
        :name="item._id"
        :label="item.nombre" />
    </q-tabs>
    <q-tab-panels animated v-model="panel">
      <q-tab-panel
        v-for="item in rowsParaMostrar?.hijas"
        :key="item._id"
        :name="item._id">
        <q-list>
          <q-expansion-item
            v-for="item2 in item.hijas"
            :key="item2._id"
            class="expansion2"
            switch-toggle-side
            default-opened>
            <template v-slot:header>
              {{ item2.nombre }}
            </template>
            <div v-for="oferta in item2.ofertas" class="oferta">
              <div
                v-show="
                  !estado.filtros.buscarFiltro ||
                  estado.filtros.buscarFiltro === '' ||
                  new RegExp(estado.filtros.buscarFiltro, 'i').test(
                    sinImportarAcentos(oferta.nombre)
                  )
                "
                class="card3"
                :key="oferta._id">
                <input
                  type="number"
                  @input="handleInputChange2($event, oferta)"
                  min="0" />
                {{ oferta.nombre }}
              </div>
            </div>
          </q-expansion-item>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useRealizarPedido2 } from './realizarPedido';

const { estado, authStore, rowsParaMostrar, handleInputChange2 } =
  useRealizarPedido2();
const panel = ref(null);

// opciones
const selectCatalogoFiltro = computed(() => {
  if (!estado.catalogo) return [];
  let options = [];
  for (const cat of estado.catalogo.hijas) {
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
.q-card {
  border: none;
}
.expansion1 {
  margin-top: 20px;
  background-color: black;
  padding: 0;
  color: white;
}
.expansion2 {
  background-color: gray;
  padding: 0;
}
.oferta {
  background-color: white;
  color: black;
  padding: 3px;
}
.oferta input {
  border: 1px solid gray;
  padding: 3px;
  width: 80px;
}

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
