<template>
  <p>
    La medida básica es la forma en que se maneja el producto (por peso, unidad,
    etc).
  </p>

  <!-- 
      Agregar / modificar medida basica, en caso que no existe o que no haya empaques
  -->
  <div
    v-if="
      !productoStore.producto.empaques ||
      productoStore.producto.empaques.length === 0
    "
  >
    <!-- No se podrá agregar empaque si la medida basica no esta registrada -->
    <div v-if="!productoStore.producto.medida">
      <p>
        Para poder agregar empaques, primero debes definir la medida basica.
      </p>
    </div>

    <!-- Deshabilitado si ya hay empaques -->
    <input-select
      label="Medida basica"
      :opciones="
        estado.medidas.map((medida) => ({
          value: medida._id,
          label: medida.nombre,
        }))
      "
      @update="(v) => (estado.datos_productoMedida.medida = v)"
      :porDefecto="productoStore.producto.medida?._id"
      :rules="[useRules.requerido()]"
      :dialog="agregarMedidaComp"
      @payload="handlePayloadMedida"
    />

    <!-- deshabilitado si ya hay empaques-->
    <div class="!flex justify-center">
      <q-btn
        v-if="
          !productoStore.producto.empaques ||
          productoStore.producto.empaques.length === 0
        "
        class="display-block mx-auto mt-1"
        color="primary"
        label="Guardar medida basica"
        dense
        no-caps
        padding="3px 20px"
        @click="guardarMedidaBasicaProducto"
      />
    </div>
  </div>

  <!-- 
      Agregar empaques, en caso de que ya exista la medida basica
  -->

  <div v-if="productoStore.producto.medida">
    <br />

    <p>
      Los empaques son la formas que llegan en producto en el almacén, por
      ejemplo en tira o paquete de tal o tal marca.
    </p>

    <Table :rows="productoStore.producto.empaques" :columns="columnaEmpaques">
      <template #dropdown>
        <q-btn
          color="primary"
          icon="add"
          label="Agregar empaque"
          no-caps
          @click="
            () => {
              estado.modal.show_modificarProductoEmpaque = false;
              estado.modal.show_crearProductoEmpaque = true;
            }
          "
        />
      </template>

      <template #body-cell-actions="{ props }">
        <q-td :props="props" class="font-bold text-red-500">
          <q-btn
            color="orange"
            icon="edit"
            round
            dense
            padding="1px"
            size="10px"
            @click="modalModificarProductoEmpaque(props.row)"
          >
            <q-tooltip> Editar empaque </q-tooltip></q-btn
          >
          <q-btn
            color="red"
            icon="delete"
            round
            dense
            padding="1px"
            size="10px"
            @click="borrarProductoEmpaque(props.row)"
          >
            <q-tooltip> borrar empaque </q-tooltip></q-btn
          >
        </q-td>
      </template>
    </Table>
  </div>

  <!-- 
    MEDIDA & EMPAQUE PRODUCTO
  -->
  <Dialog
    v-model="estado.modal.show_crearProductoEmpaque"
    :title="
      estado.modal.show_modificarProductoEmpaque
        ? 'Modificar empaque'
        : 'Agregar empaque'
    "
    :label-btn="
      estado.modal.show_modificarProductoEmpaque ? 'Modificar' : 'Crear'
    "
    :handle-submit="
      estado.modal.show_modificarProductoEmpaque
        ? modificarProductoEmpaque
        : crearProductoEmpaque
    "
  >
    <template #inputsDialog>
      <p>Registren las diferentes presentaciones.</p>

      <input-select
        label="Marca"
        info="Seleccione una marca entre las que ya se registraron para este producto. Si la marca que desea ingresar no existe, agregue la primero en la zona MARCAS."
        :opciones="
          productoStore.producto.variedades.map((variedad) => ({
            value: variedad.marca._id,
            label: variedad.marca.nombre,
          }))
        "
        @update="(v) => (estado.datos_productoMedida.empaque.marca = v)"
        :rules="[useRules.requerido()]"
        :porDefecto="
          estado.modal.show_modificarProductoEmpaque
            ? estado.datos_productoMedida.empaque.marca
            : null
        "
        :dialog="agregarVariedadComp"
        :dialogParam="productoStore.producto._id"
        @payload="handlePayloadVariedad"
      />

      <div v-if="!estado.modal.show_modificarProductoEmpaque">
        <p>
          Si desea, seleccione un modelo de empaque
          <br />para prellenar el formulario:
        </p>
        <input-select
          label="Empaques preseleccionados"
          info="La medida básica viene con nombres de empaque predefinidos, seleccione uno o creelo si no existe."
          :opciones="selectTipoEmpaque"
          @update="(v) => prellenarEmpaque(v)"
          :watch="estado.resetEmpaque"
          :dialog="agregarTipoEmpaqueComp"
          :dialog-param="productoStore.producto.medida._id"
          @payload="handlePayloadTipoEmpaque"
        />
      </div>

      <input-text
        label="Empaque"
        @update="(v) => (estado.datos_productoMedida.empaque.nombre = v)"
        info="Nombre del empaque"
        :rules="[useRules.requerido()]"
        :porDefecto="
          estado.modal.show_modificarProductoEmpaque
            ? estado.datos_productoMedida.empaque.nombre
            : null
        "
        :watch="estado.datos_productoMedida.empaque.nombre"
      />

      <input-text
        label="Abreviacion"
        @update="(v) => (estado.datos_productoMedida.empaque.abreviacion = v)"
        info="La abreviacion debe tener entre 1 o 3 caracteres idealmente, por ejemplo TIR, DL, 12a, etc..."
        :rules="[useRules.requerido()]"
        :porDefecto="
          estado.modal.show_modificarProductoEmpaque
            ? estado.datos_productoMedida.empaque.abreviacion
            : null
        "
        :watch="estado.datos_productoMedida.empaque.abreviacion"
      />

      <input-text
        label="Cantidad en unidades básicas"
        @update="
          (v) => (estado.datos_productoMedida.empaque.cantidad = Number(v))
        "
        info="Es la cantidad en stock del producto debajo de la cual se alertará para avisar que se necesita hacer un nuevo pedido al proveedor."
        :rules="[useRules.requerido(), useRules.numero()]"
        :porDefecto="
          estado.modal.show_modificarProductoEmpaque
            ? '' + estado.datos_productoMedida.empaque.cantidad
            : null
        "
        :watch="'' + estado.datos_productoMedida.empaque.cantidad"
      />
    </template>
  </Dialog>

  <!-- <clg :v="estado" /> -->
</template>

<script setup lang="ts">
const x = ref('#');
import { useDetalleMedida } from '@/modulos/productos/negocio/detalle/medida.composable';
import { columnaEmpaques } from '@/modulos/productos/infraestructura/utils/columns';
import agregarVariedadComp from '~/modulos/productos/infraestructura/selects/agregarVariedad.vue';
import agregarMedidaComp from '~/modulos/productos/infraestructura/selects/agregarMedida.vue';
import agregarTipoEmpaqueComp from '~/modulos/productos/infraestructura/selects/agregarTipoEmpaque.vue';
import { toSelect } from '~/components/input/input.service';
import { useProducto } from '@/modulos/productos/negocio/producto.composable';

const {
  estado,
  productoStore,
  buscarMedidas,
  guardarMedidaBasicaProducto,
  crearProductoEmpaque,
  modificarProductoEmpaque,
  modalModificarProductoEmpaque,
  prellenarEmpaque,
  borrarProductoEmpaque,
} = useDetalleMedida();
const { actProductosDB } = useProducto();

const selectTipoEmpaque = ref([]);
const { $socket } = useNuxtApp();

const handlePayloadVariedad = (payload: any) => {
  productoStore.producto.variedades.push(payload);
};

const handlePayloadMedida = (payload: any) => {};

const handlePayloadTipoEmpaque = (payload: any) => {
  productoStore.producto.medida.tipoEmpaques.push(payload);
  selectTipoEmpaque.value = toSelect(
    productoStore.producto.medida.tipoEmpaques,
  );
  prellenarEmpaque(payload._id);
};
onMounted(async () => {
  await buscarMedidas();
  selectTipoEmpaque.value = toSelect(
    productoStore.producto.medida.tipoEmpaques,
  );
  $socket.on('cambiosProductos', async (data) => {
    console.log('first');
    await actProductosDB();
  });
});

onBeforeUnmount(() => {
  $socket.off('cambiosProductos');
});
</script>
