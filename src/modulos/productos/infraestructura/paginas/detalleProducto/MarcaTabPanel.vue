<template>
  <div>
    <p>Seleccione las diferentes marcas con que viene el producto.</p>

    <Table
      :rows="productoStore.producto.variedades"
      :columns="columnaMarca"
      style="padding: 0"
      badge
    >
      <template #dropdown>
        <q-btn
          color="primary"
          icon="add"
          label="Registrar una marca"
          no-caps
          @click="
            () => {
              // limpiarProductoMarca();
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
    :close-manual="estado.modal.show_modificarProductoMarca"
    :handle-close="cerrarLimpiarModificarMarca"
  >
    <template #inputsDialog>
      <div v-if="estado.modal.show_modificarProductoMarca"></div>
      <div v-else="estado.modal.show_modificarProductoMarca">
        <p></p>
      </div>

      <!-- Marca -->
      <input-select
        label="Marca"
        v-if="!estado.modal.show_modificarProductoMarca"
        :opciones="estado.marcasParaSelect"
        info="Seleccione una marca entre todas las marcas que se registraron globalmente en la empresa. Si la marca que quiere agregar no existe, puede crearla via el boton [+]"
        @update="(v) => (estado.datos_productoMarca.marca = v)"
        :porDefecto="estado.datos_productoMarca.marca"
        :error="estado.errorMarca"
        :rules="[useRules.requerido()]"
        :dialog="agregarMarcaComp"
        @payload="handlePayloadMarca"
      />

      <!-- Imagen -->
      <input-image
        label="Imagen"
        @update="
          (base64Data, mimetype) =>
            (estado.datos_productoMarca.imagen = base64Data
              ? { data: base64Data, mimetype: mimetype }
              : null)
        "
        info="Por favor elija una foto del producto solo, que se distinga claramente ante un fondo claro y unido. Prefiera un formato cuadrado."
        icono="photo_camera"
      />

      <!-- Stock minimo -->
      <input-text
        label="Stock minimo antes de hacer pedido"
        @update="(v) => (estado.datos_productoMarca.cantidadMin = Number(v))"
        info="Es la cantidad en stock del producto debajo de la cual se alertará para avisar que se necesita hacer un nuevo pedido al proveedor."
        :rules="[useRules.requerido(), useRules.numero()]"
        :porDefecto="'' + (estado.datos_productoMarca.cantidadMin ?? '')"
      />

      <!-- Cantidad max en un pedido -->
      <input-text
        label="Cantidad max en un pedido"
        @update="(v) => (estado.datos_productoMarca.cantidadMax = Number(v))"
        info="Es la cantidad maxima que un punto puede pedir a produccion, para evitar errores inecesarias."
        :rules="[useRules.requerido(), useRules.numero()]"
        :porDefecto="'' + (estado.datos_productoMarca.cantidadMax ?? '')"
      />
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
import agregarMarcaComp from '~/modulos/productos/infraestructura/selects/agregarMarca.vue';
import { useDetalleMarcas } from '@/modulos/productos/negocio/detalle/marcas.composable';
import { columnaMarca } from '@/modulos/productos/infraestructura/utils/columns';
import { useProducto } from '@/modulos/productos/negocio/producto.composable';
import { toSelect } from '~/components/input/input.service';

const {
  estado,
  productoStore,
  buscarMarcas,
  crearMarcaGlobal,
  modificarProductoMarca,
  crearProductoMarca,
  modalModificarProductoMarca,
  cerrarLimpiarModificarMarca,
} = useDetalleMarcas();

const handlePayloadMarca = (payload) => {
  estado.marcas.push(payload);
  estado.marcasParaSelect = toSelect(estado.marcas);
};

const { estado: estadoProducto, actProductosDB } = useProducto();
const { $socket } = useNuxtApp();

onMounted(async () => {
  await buscarMarcas();
  estado.marcasParaSelect = toSelect(estado.marcas);
  $socket.on('cambiosProductos', async (data) => {
    await actProductosDB();
  });
});
</script>
