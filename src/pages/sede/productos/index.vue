<template>
  <div>
    <Navigation label="Productos" icon="list_alt" />
    <span class="flex gap-2">
      <h1 class="font-bold text-xl">Gestion de productos</h1>
      <!-- <q-btn
        color="primary"
        icon="bi-eye"
        rounded
        dense
        size="12px"
        @click="$router.push('productos/categorias')"
        ><q-tooltip>Ver cataegorias</q-tooltip></q-btn
      > -->
    </span>
    <Table badge :rows="estado.productos" :columns="columnsProductos" dense>
      <template #dropdown>
        <NuxtLink to="productos/detailProduct">
          <q-btn
            v-if="$q.platform.is.desktop"
            icon-right="add"
            color="green"
            label="Agregar producto"
            no-caps
            style="font-size: 14.5px"
            padding="4px 10px"
            @click="modalAgregarProducto()"
          />
          <q-btn
            v-if="$q.platform.is.mobile"
            color="green"
            label="Agregar producto"
            no-caps
            style="font-size: 14.5px"
            padding="4px 10px"
            @click="modalAgregarProducto()"
          />
        </NuxtLink>
      </template>
      <!-- BADGE -->
      <template #rows-badge="{ props }">
        <q-tr :props="props" @dblclick="ControladorFila(props)">
          <q-td key="creado" :props="props">
            {{ fechaMes(props.row._creado) }}
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
              :src="Producto"
              spinner-color="black"
              class="cell-image"
              width="40px"
              height="40px"
            />
          </q-td>
          <q-td key="nombre" :props="props">
            {{ props.row.nombre }}
          </q-td>
          <q-td key="comentario" :props="props">
            {{ props.row.comentario }}
          </q-td>
          <q-td key="presentacionBasica" :props="props">
            {{ props.row.presentacionBasica }}
          </q-td>
          <q-td key="presentaciones" :props="props">
            <div class="flex gap-1">
              <div v-for="(p, index) in props.row.presentaciones" :key="index">
                <q-badge color="blue" class="capitalize">
                  {{ p.nombre }}
                </q-badge>
              </div>
            </div>
          </q-td>
          <q-td key="categoria" :props="props">
            {{ props.row.categoria && props.row.categoria.nombre }}
            <!-- <p
              class="text-blue-400 underline cursor-pointer"
              @click="cambiarCategoria(props.row)"
            >
              Editar
            </p> -->
          </q-td>
          <q-td key="actions" :props="props">
            <NuxtLink to="ofertas/detailOferta">
              <q-btn
                color="green"
                icon="add"
                round
                dense
                flat
                padding="3px"
                size="12px"
                @click="navegarCrearOferta(props.row)"
                ><q-tooltip> Crear oferta </q-tooltip></q-btn
              >
            </NuxtLink>
            <NuxtLink to="productos/detailProduct">
              <q-btn
                color="primary"
                icon="edit"
                round
                dense
                flat
                padding="3px"
                size="10px"
                @click="navegarDetalleProducto(props.row)"
              />
            </NuxtLink>
            <q-btn
              color="red"
              icon="delete"
              round
              dense
              flat
              padding="3px"
              size="11px"
              @click="borrarProducto(props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </Table>
  </div>

  <!-- DIALOG DOUBLECLICK -->
  <q-dialog persistent v-model="isDoubleClick">
    <q-card style="width: 200px" class="px-3 py-1">
      <div class="flex justify-between items-center">
        <h1 class="text-md font-bold truncate-7">{{ row.nombre }}</h1>
        <q-btn icon="close" flat round dense v-close-popup />
      </div>

      <div class="flex gap-2 mb-3 mt-2 justify-center">
        <q-btn
          color="primary"
          label="Editar"
          no-caps
          style="font-size: 14px; width: 70px"
          padding="4px 10px"
          @click="navegarDetalleProducto(row)"
        />
        <q-btn
          color="red"
          label="Eliminar"
          no-caps
          style="font-size: 14px; width: 70px"
          padding="4px 10px"
          @click="borrarProducto(row)"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
definePageMeta({
  layout: 'sede',
});
import { ref, onMounted } from 'vue';
import { useProducts } from '@/composables/sede/useProducts';
import { columnsProductos } from '~/helpers/columns';
import { fechaMes } from '@/helpers/fecha';
import Producto from '@/assets/img/producto.png';

const isDoubleClick = ref(false);
const row = ref('');

const ControladorFila = (props) => {
  row.value = props.row;
  isDoubleClick.value = true;
};

const {
  estado,
  tags,
  getAllProductos,
  navegarDetalleProducto,
  modalAgregarProducto,
  borrarProducto,
  cambiarCategoria,
  guardarCategoria,
  navegarCrearOferta,
} = useProducts();

onMounted(() => {
  getAllProductos();
});
</script>

<style scoped>
.prove {
  border: 1px solid red;
}
.table-cell-image {
  display: flex;
  justify-content: center;
  padding: 5px 0;
}
.cell-image {
  width: 70px;
  height: 70px;
}
.q-poput-edit {
  min-width: 400px !important;
}
.truncate-7 {
  display: inline-block;
  width: 15ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: uppercase;
}
</style>
