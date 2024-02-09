<template>
  <div>
    <Navigation label="Productos" icon="list_alt" />
    <q-btn
      color="primary"
      icon="check"
      label="ver categorias"
      outline
      @click="$router.push('productos/categorias')"
      style="margin-bottom: 20px"
    />
    <Table badge :rows="estado.productos" :columns="columnsProductos" dense>
      <template #dropdown>
        <q-btn
          icon-right="add"
          color="green"
          label="Agregar producto"
          no-caps
          style="padding: 7px 15px"
          @click="modalAgregarProducto()"
        />
      </template>
      <!-- BADGE -->
      <template #rows-badge="{ props }">
        <q-tr :props="props">
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
          <q-td key="categoria" :props="props" class="flex gap-1">
            {{ props.row.categoria && props.row.categoria.nombre }}
            <p
              class="text-blue-400 underline cursor-pointer"
              @click="cambiarCategoria(props.row)"
            >
              Editar
            </p>
            <!-- {{ props.row.categoria }} -->
            <!-- NOMBRE DE CATEGORIA -->
            <!-- <div class="flex gap-1">
              <div v-for="(p, index) in props.row.tags" :key="index">
                <q-badge color="green" class="capitalize">
                  {{ p }}
                </q-badge>
              </div>
            </div> -->
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              color="primary"
              icon="edit"
              round
              dense
              flat
              @click="navegarDetalleProducto(props.row)"
            />
            <q-btn
              color="red"
              icon="delete"
              round
              dense
              flat
              @click="borrarProducto(props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </Table>
  </div>
  <!-- AGREGAR CATEGORIA -->
  <Dialog
    v-model="estado.modal.isAddCategory"
    title="Categoria"
    :handle-submit="guardarCategoria"
  >
    <template #inputsDialog>
      <div class="row items-center" style="width: 100%">
        <q-select
          v-model="estado.categoriaFija.categoria"
          :options="estado.categorias.hijas"
          label="Seleccionar categoria"
          option-label="nombre"
          style="width: 100%; flex: 1 0 auto"
          dense
          onfocus="this.select()"
          filled
        >
          <template v-slot:append>
            <q-icon
              style="margin: 0"
              name="close"
              @click.stop.prevent="estado.inputCategoria = ''"
              class="cursor-pointer q-mr-md"
            />
          </template>
          <template v-slot:prepend>
            <q-icon name="category" />
          </template>
        </q-select>
        <q-select
          v-model="estado.categoriaFija.hijas"
          :options="estado.categoriaFija.categoria.hijas"
          label="Seleccionar categoria"
          option-label="nombre"
          style="width: 100%; flex: 1 0 auto; margin-top: 10px"
          dense
          onfocus="this.select()"
          filled
        >
          <template v-slot:append>
            <q-icon
              style="margin: 0"
              name="close"
              @click.stop.prevent="estado.categoriaFija.hijas = ''"
              class="cursor-pointer q-mr-md"
            />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No hay resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
definePageMeta({
  layout: 'sede',
});
import { onMounted } from 'vue';
import { useProducts } from '@/composables/sede/useProducts';
import { columnsProductos } from '~/helpers/columns';

const {
  estado,
  tags,
  getAllProductos,
  navegarDetalleProducto,
  modalAgregarProducto,
  borrarProducto,
  cambiarCategoria,
  guardarCategoria,
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
</style>
