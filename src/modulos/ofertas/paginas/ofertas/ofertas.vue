<template>
  <NuxtLayout
    :name="authStore.getNegocio.tipo === 'PUNTO' ? 'punto' : 'cathering'"
    :titulo="'Catalogo ' + estado.catalogoSeleccionado?.nombre"
    :navegacion="[
      {
        label: 'Ofertas ' + estado.catalogoSeleccionado?.nombre,
        to: 'ofertas',
        params: {
          id: params.id
        }
      }
    ]">
    <div>
      <q-btn
        icon="add"
        label="Oferta básica"
        color="green"
        no-caps
        @click="() => (estado.modal.show_crearOfertaBasico = true)" />

      <q-btn
        icon="add"
        label="Oferta avanzada"
        color="green"
        no-caps
        class="ml-2"
        @click="() => (estado.modal.show_crearOfertaSimple = true)" />
    </div>
    <Tabla :rows="rowsParaMostrar" :columns="columnaOfertas" :paginacion="9">
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
            @update="v => (estado.filtros.catalogoSeleccionado = v)"
            :porDefecto="estado.filtros.catalogoSeleccionado"
            noSlot />
          <input-select
            label="Estado"
            labelAdentro
            @update="v => (estado.filtros.completud = v)"
            :opciones="[
              { value: 'soloCompletos', label: 'solo completas' },
              { value: 'soloIncompletos', label: 'solo incompletas' }
            ]"
            noSlot />
        </div>
      </template>

      <template #cell-estado="{ row }">
        {{ fechaMes(row._modificado ?? row._creado) }}
        <br />
        <q-badge v-if="!ofertaIncompleta(row)" color="green">
          completo
        </q-badge>
        <q-badge v-else color="orange"> incompleto </q-badge>
      </template>

      <template #cell-nombre="{ val, row }">
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
            <q-badge color="darkblue" class="mr-1 mb-1 lowercase">
              {{ ingrediente.producto.nombre }} /
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

      <!-- <template #cell-catalogo="{ val, row }">
        <h1>{{ val.nombre }}</h1>
      </template> -->

      <template #cell-acciones="{ val, row }">
        <q-btn-group push @click="e => e.stopPropagation()">
          <btnAccion
            icono="edit black"
            @click="
              e => {
                e.stopPropagation();
                store.oferta = row;
                goTo(router, 'oferta', { id: row._id });
              }
            " />
        </q-btn-group>
      </template>

      <template #body-expand="{ row }">
        <div
          style="
            display: grid;
            grid-gap: 16px;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          ">
          <!-- IMAGEN -->
          <div>
            <q-img
              v-if="row.imagen?.cloudinaryUrl"
              :src="row.imagen?.cloudinaryUrl"
              spinner-color="primary"
              spinner-size="82px"
              class="w-full h-auto object-cover" />
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
              ><h1 class="font-bold text-xs">CATALOGO:</h1>
              <p>{{ row.catalogo.nombre }}</p></span
            >
            <span class="flex gap-2 items-center"
              ><h1 class="font-bold text-xs">DESCRIPCION:</h1>
              <p>{{ row.descripcion }}</p></span
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
  </NuxtLayout>

  <Popup v-model="estado.modal.show_crearOfertaBasico" titulo="Nueva Oferta">
    <template #body>
      <formOfertaBasico
        :catalogo="params.id as string"
        @crearObjeto="handleOfertaBasicaCreada" />
    </template>
  </Popup>

  <Popup v-model="estado.modal.show_crearOfertaSimple" titulo="Nueva Oferta">
    <template #body>
      <formOfertaProducto
        :catalogo="params.id as string"
        @crearObjeto="handleOfertaSimpleCreada" />
    </template>
  </Popup>
</template>

<script setup lang="ts">
import { useOferta } from './ofertas.composable';
const {
  estado,
  store,
  authStore,
  router,
  ofertaIncompleta,
  handleOfertaBasicaCreada,
  handleOfertaSimpleCreada
} = useOferta();

import { columnaOfertas } from './columns';
import formOfertaBasico from '@/modulos/ofertas/forms/formOfertaBasico.vue';
import formOfertaProducto from '@/modulos/ofertas/forms/formOfertaProducto.vue';
const { params } = useRoute();

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
  let filtered = store.ofertas;
  if (!filtered) return [];

  filtered = filtered.filter(oferta => {
    const incompleto = ofertaIncompleta(oferta);
    if (oferta._id === '6201c1c8df85a46e2f0b9542') console.log(incompleto);
    // catalogo seleccionado en parametro de pagina
    if (!estado.catFiltroGlobal.includes(oferta.catalogo._id)) return false;

    // solo ofertas completas?
    if (estado.filtros.completud === 'soloCompletos' && incompleto)
      return false;

    // solo ofertas incompletas?
    if (estado.filtros.completud === 'soloIncompletos' && !incompleto)
      return false;

    // catalogo seleccionado
    if (
      estado.filtros.catalogoSeleccionado &&
      !estado.filtros.catalogoSeleccionado.includes(oferta.catalogo._id)
    )
      return false;

    // busqueda textual
    if (estado.filtros.buscarFiltro) {
      const regex = new RegExp(`${estado.filtros.buscarFiltro}`, 'i');
      if (
        !regex.test(
          oferta.nombre +
            oferta.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        )
      )
        return false;
    }

    return true;
  });

  return filtered;
});

onMounted(async () => {
  // catalogo seleccionado en la url
  estado.ofertas = await store.getOfertas();
  estado.catalogoSeleccionado = await store.getCatalogoArbol(
    params.id as string
  );
  if (!estado.catalogoSeleccionado) {
    goTo(router, '404');
  }
  store.catalogoRaiz = {
    id: params.id as string,
    nombre: estado.catalogoSeleccionado.nombre
  };

  // filtrar segun el catalogo en param url
  const f = cat => {
    estado.catFiltroGlobal.push(cat._id);
    for (const subCat of cat.hijas ?? []) {
      f(subCat);
    }
  };
  f(estado.catalogoSeleccionado);
});

// sockets
const { $socket } = useNuxtApp();
onBeforeMount(() => {
  $socket.on('cambiosOfertas', async (data: any) => {
    await store.refreshOfertas();
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
