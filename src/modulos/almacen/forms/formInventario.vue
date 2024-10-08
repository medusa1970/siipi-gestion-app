<template>
  <p>
    Agregue todos los lotes según su
    <span v-if="producto.puedeVencer"> vencimiento, </span>marca y ubicacion en
    la tienda.
  </p>
  <br />
  <q-form @submit="formSubmit">
    <div class="text-center"></div>
    <div class="flex">
      <q-card class="mr-3 mb-3" v-for="lote in estado.lotes" :key="lote.id">
        <q-btn
          @click="
            () => {
              estado.loteEdicion = lote;
              showModal.modificarLote = true;
            }
          "
          icon="edit"
          class="p-1"
          color="black"
          size="sm" />
        <q-btn
          icon="delete"
          class="p-1"
          color="red"
          size="sm"
          @click="borrarLote(lote)" />
        <ul>
          <li>cantidad: {{ lote.cantidad }}</li>
          <li>marca: {{ getMarca(lote).nombre }}</li>
          <li v-if="producto.puedeVencer">
            vencimiento:
            {{
              lote.vencimiento != null
                ? new Date(lote.vencimiento).toLocaleString().split(' ')[0]
                : null
            }}
          </li>
          <li>bloque: {{ getBloque(lote).nombre }}</li>
        </ul>
      </q-card>
    </div>
    <div class="text-center">
      <q-btn
        label="Agregar Lote"
        color="orange"
        @click="showModal.crearLote = true" />
      <q-btn
        v-if="estado.lotes.length > 0"
        label="Guardar"
        color="green"
        type="submit" />
    </div>
  </q-form>

  <Popup v-model="showModal.verificar" titulo="Error de inventario">
    <template #body>
      <p v-if="estado.puedeGuardar">
        Todavía hay una diferencia, pero si está seguro, puede confirmar el
        inventario.
      </p>
      <p v-else>
        Los datos que ha entrado no corresponden con el stock en el sistema. Por
        favor confirme las cantidades y fecha de vencimiento.
      </p>

      <div class="text-center mt-3">
        <q-btn label="Modificar" color="green" @click="sumbitReintentar" />
        <q-btn
          v-if="estado.puedeGuardar"
          label="Confirmar"
          color="orange"
          @click="submitConfirmar" />
      </div>
    </template>
  </Popup>
  <Popup v-model="showModal.crearLote" titulo="Agregar un lote">
    <template #body>
      <formInventarioLote :producto @crearLote="handleCrearLote" />
    </template>
  </Popup>
  <Popup v-model="showModal.modificarLote" titulo="Modificar un lote">
    <template #body>
      <formInventarioLote
        :edicion="estado.loteEdicion"
        :producto
        @crearLote="handleModificarLote" />
    </template>
  </Popup>
</template>

<script setup lang="ts">
// imports
import type { Inventario, Producto, Bloque } from '#gql';
import formInventarioLote, {
  type Lote
} from '@/modulos/almacen/forms/formInventarioLote.vue';
import { useAuthStore } from '~/modulos/main/useAuthStore';
const authStore = useAuthStore();
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
import type { Marca } from '#gql';
const { store } = useAlmacen();
const $q = useQuasar();

// definicion de los emits
const emits = defineEmits(['hacerInventario']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    producto: Producto;
  }>(),
  {}
);

// definicion del estado
const estado = reactive({
  dataForm: {},
  lotes: [] as Lote[],
  loteEdicion: null,
  puedeGuardar: false
});
const showModal = reactive({
  crearLote: false,
  modificarLote: false,
  verificar: false
});

// Inicializaciones
onMounted(async () => {
  await store.getEntidad();
});

// submision del formulario
const formSubmit = async () => {
  return mandar(false);
};
const mandar = async (guardar = false) => {
  // debe haber por lo menos un lote
  if (estado.lotes.length === 0) {
    console.log('debe haber por lo menos un lote');
    return false;
  }

  // mandamos el inventario
  let inventario: Inventario = null;
  try {
    inventario = await buscarUno(GqlHacerInventario, {
      busqueda: authStore.negocio._id,
      guardar,
      datos: {
        producto: props.producto._id,
        lotes: estado.lotes.map(lote => {
          delete lote.id;
          return lote;
        }),
        reporte: 'se hizo'
      }
    });
    if (!guardar && inventario.diferencias.length > 0) {
      showModal.verificar = true;
      return;
    }
  } catch (err) {
    errFailback(err);
    return;
  }
  store.refreshProblemas();
  store.refreshEntidad();
  emits('hacerInventario', inventario);
};

// Lote >> InventarioLote
const getMarca = (lote: Lote): Marca =>
  props.producto.variedades.find(v => v.marca._id === lote.marca).marca;
const getBloque = (lote: Lote): Bloque =>
  store.entidad.bloques.find(b => b._id === lote.bloque);

// lote creado
const handleCrearLote = async lote => {
  showModal.crearLote = false;
  estado.lotes.push(lote);
};

// lote modificado
const handleModificarLote = async modificado => {
  showModal.modificarLote = false;
  estado.lotes = estado.lotes.map(lote =>
    lote.id === modificado.id ? modificado : lote
  );
};

// lote creado
const submitConfirmar = () => {
  showModal.verificar = false;
  mandar(true);
};

// lote creado
const sumbitReintentar = () => {
  estado.puedeGuardar = true;
  showModal.verificar = false;
};

// lote borrar
const borrarLote = async loteBorrar => {
  $q.dialog({
    message: '¿Estas seguro de borrar este lote?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    estado.lotes = estado.lotes.filter(lote => loteBorrar.id !== lote.id);
  });
};
</script>
