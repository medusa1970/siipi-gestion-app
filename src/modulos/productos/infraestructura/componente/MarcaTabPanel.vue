<template>
  <div>
    <p>Seleccione las diferentes marcas con que viene el producto.</p>

    <Table
      :rows="productoStore.producto.variedades"
      :columns="columnaMarca"
      style="padding: 0"
      badge
    >
      <template #select>
        <q-btn
          color="primary"
          icon="add"
          label="Registrar una marca"
          no-caps
          @click="
            () => {
              limpiarProductoMarca();
              estado.modal.show_crearProductoMarca = true;
              estado.modal.show_modificarProductoMarca = false;
            }
          "
        />
      </template>
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
          </q-td>
          <q-td key="marca" :props="props">
            {{ props.row.marca.nombre }}
          </q-td>
          <q-td key="min" :props="props">
            {{ props.row.cantidadMin }}
          </q-td>
          <q-td key="max" :props="props">
            {{ props.row.cantidadMax }}
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              color="orange"
              icon="edit"
              round
              dense
              padding="1px"
              size="10px"
              @click="modalModificarProductoMarca(props.row)"
            >
              <q-tooltip> Editar marca </q-tooltip></q-btn
            >
          </q-td>
        </q-tr>
      </template>
    </Table>
  </div>

  <!-- PRODUCTO MARCA -->
  <Dialog
    v-model="estado.modal.show_crearProductoMarca"
    :title="
      estado.modal.show_modificarProductoMarca
        ? 'Modificar marca'
        : 'Registrar marca'
    "
    :label-btn="
      estado.modal.show_modificarProductoMarca ? 'Modificar' : 'Crear'
    "
    :handle-submit="
      estado.modal.show_modificarProductoMarca
        ? modificarProductoMarca
        : crearProductoMarca
    "
  >
    <template #inputsDialog>
      <p>Se va registrar una marca para este producto.</p>

      <!-- input marca -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-select
            label="Marca *"
            required
            v-model="estado.datos_productoMarca.marca"
            :options="estado.marcas"
            option-label="nombre"
            class="w-full"
            map-options
            options-cover
            dense
            filled
            :disable="estado.modal.show_modificarProductoMarca"
          >
            <!--  
            fill-input
            emit-value
            use-input
            outlined
            input-debounce="0"
            hide-selected
            onfocus="this.select()" -->

            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" :class="scope.opt.class">
                <q-item-section>{{ scope.opt.nombre }}</q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <q-btn
          size="12px"
          icon="add"
          color="primary"
          round
          style="height: 16px"
          @click="
            () => {
              estado.marca.nombre = '';
              estado.modal.show_crearMarca = true;
            }
          "
        ></q-btn>
        <div>
          <BotonDetalle
            mensaje="Seleccione una marca entre todas las marcas que se registraron globalmente en la empresa. Si la marca que quiere agregar no existe, puede crearla via el boton [+]"
          />
        </div>
      </div>

      <!-- input imagen -->
      <div>
        <input-image
          label="Imagen"
          info="Por favor elija una foto del producto solo, que se distinga claramente ante un fondo claro y unido. Prefiera un formato cuadrado."
          @update="
            (v) =>
              (estado.datos_productoMarca.imagen = {
                data: v,
                mimetype: 'image/png',
              })
          "
          icono="photo_camera"
        />
      </div>

      <!-- input cantidadMin -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Stock minimo antes de hacer pedido *"
            required
            class="w-full"
            v-model.number="estado.datos_productoMarca.cantidadMin"
            type="text"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Es la cantidad en stock del producto debajo de la cual se alertará para avisar que se necesita hacer un nuevo pedido al proveedor."
          />
        </div>
      </div>

      <!-- input cantidadMax -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Cantidad max en un pedido *"
            required
            class="w-full"
            v-model.number="estado.datos_productoMarca.cantidadMax"
            type="text"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Es la cantidad maxima que un punto puede pedir a produccion, para evitar errores inecesarias."
          />
        </div>
      </div>
    </template>
  </Dialog>

  <!-- CREAR MARCA GLOBAL -->
  <Dialog
    v-model="estado.modal.show_crearMarca"
    title="Crear una marca"
    label-btn="Crear"
    :handle-submit="crearMarcaGlobal"
  >
    <template #inputsDialog>
      <p>
        La marca se creará al nivel global,
        <b>asegúrese que todavía no existe</b>.
      </p>

      <!-- nombre -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Nombre *"
            required
            class="w-full"
            v-model="estado.marca.nombre"
            type="text"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Entre el nombre de la marca que aparece en la
          etiqueta del producto. Si es un producto generico y sin marca, YA
          EXISTE una marca generica llamada 'sin marca'."
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { columnaMarca } from '@/modulos/productos/infraestructura/utils/columns';
import { useProductoDetalle } from '@/modulos/productos/negocio/productoDetalle.composable';
import { useProducto } from '@/modulos/productos/negocio/producto.composable';

const {
  estado,
  productoStore,
  buscarMarcas,
  crearMarcaGlobal,
  modificarProductoMarca,
  crearProductoMarca,
  limpiarProductoMarca,
  modalModificarProductoMarca,
} = useProductoDetalle();
const {
  estado: estadoProducto,
  categoriaSelectOptions,
  actProductosDB,
} = useProducto();
const { $socket } = useNuxtApp();

onMounted(async () => {
  estadoProducto.categoriaOptions = await categoriaSelectOptions();
  await buscarMarcas();

  $socket.on('cambiosProductos', async (data) => {
    console.log('first');
    await actProductosDB();
  });
});
</script>
