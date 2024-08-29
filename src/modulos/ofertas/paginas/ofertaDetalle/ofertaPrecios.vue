<template>
  <tabla disableExpand :columns="columnsTabla" :rows="rowsTabla">
    <template #cell-actions="{ row }">
      <q-btn-group push @click="e => e.stopPropagation()">
        <q-btn
          @click="
            () => {
              estado.configEdit = row.cantidadMin ? row : props.ofertaCorriente;
              estado.modal.formModificarPrecio = true;
            }
          "
          icon="edit"
          class="p-1"
          color="black"
          size="sm" />
        <q-tooltip> Eliminar marca </q-tooltip>
        <q-btn
          v-if="row.cantidadMin > 1"
          icon="delete"
          class="p-1"
          color="red"
          size="sm"
          @click="borrarOfertaPrecio(row)" />
        <q-tooltip> Eliminar precio </q-tooltip>
      </q-btn-group>
    </template>
  </tabla>
  <div class="flex">
    <q-btn
      @click="() => (estado.modal.formCrearPrecio = true)"
      icon="add"
      label="Agregar precio por mayor"
      color="green"
      no-caps
      padding="4px 10px" />
  </div>
  <popup v-model="estado.modal.formCrearPrecio" titulo="Agregar un precio">
    <template #body>
      <formPrecio
        :preciosProveedor="estado.preciosProveedor"
        @crearObjeto="handlePrecioCreado" />
    </template>
  </popup>

  <popup
    v-model="estado.modal.formModificarPrecio"
    titulo="Modificar un precio">
    <template #body>
      <formPrecio
        :preciosProveedor="estado.preciosProveedor"
        :edicion="estado.configEdit"
        @modificarObjeto="handlePrecioModificado" />
    </template>
  </popup>
</template>

<script setup lang="ts">
import type { Precio } from '#gql';
import { areaInfo } from '../../oferta.definicion';
import { useOfertaDetalle } from './ofertaDetalle';
const { store } = useOfertaDetalle();

const props = defineProps({
  ofertaCorriente: null
});

// Rows para la tabla
const rowsTabla = computed(() => {
  let rows = [
    {
      _esOferta: true,
      cantidadMin: 1,
      precioConFactura: props.ofertaCorriente.precioConFactura,
      precioSinFactura: props.ofertaCorriente.precioSinFactura
    },
    ...(props.ofertaCorriente.preciosPorMayor ?? [])
  ];
  // TODO ORDENAR LOS PRECIOS
  return rows.sort((a, b) => a.cantidadMin - b.cantidadMin);
});

const estado = reactive({
  precios: [] as any[],
  // precio que se esta modificando, o oferta
  configEdit: null as Precio,
  preciosProveedor: [],
  modal: {
    formCrearPrecio: false,
    formModificarPrecio: false
  }
});

onMounted(async () => {
  await store.getOfertas();
  // busquemos precios de proveedores
  const ofertasProveedor = store.ofertas.filter(oferta => {
    // debe estar en el catalogo proveedor
    if (oferta.catalogo._id !== areaInfo.proveedores.catalogo) {
      return false;
    }
    // debe tener un y solo un ingrediente
    if (oferta.ingredientes.length !== 1) {
      return false;
    }
    // debe tener un producto
    if (!props.ofertaCorriente.ingredientes[0].producto) {
      return false;
    }
    // el producto debe ser el mismo que la oferta actual
    if (
      oferta.ingredientes[0].producto?._id !==
      props.ofertaCorriente.ingredientes[0].producto?._id
    ) {
      return false;
    }
    return true;
  });
  estado.preciosProveedor = ofertasProveedor.map(oferta => [
    oferta.precioSinFactura,
    oferta.precioConFactura
  ]);
});

const $q = useQuasar();
const borrarOfertaPrecio = async precio => {
  $q.dialog({
    title: `Eliminar este precio ?`,
    message: 'No se puede deshacer.',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    let oferta;
    try {
      oferta = await modificarUno(GqlModificarOfertas, {
        busqueda: props.ofertaCorriente._id,
        datos: {
          preciosPorMayor: {
            borrar: { _id: precio._id }
          }
        }
      });
    } catch (err) {
      errFailback(err);
      return;
    }
    NotifySucessCenter('Precio borrado correctamente');
    props.ofertaCorriente.preciosPorMayor = oferta.preciosPorMayor;
    await store.refreshOfertas();
  });
};

const handlePrecioCreado = async (precio, oferta) => {
  NotifySucessCenter('Precio creado correctamente');
  estado.modal.formCrearPrecio = false;
  await store.refreshOfertas();
};
const handlePrecioModificado = async (precio, oferta) => {
  NotifySucessCenter('Precio modificado correctamente');
  estado.modal.formModificarPrecio = false;
  await store.refreshOfertas();
};

// Columnas
const columnsTabla = [
  {
    name: 'cantidad',
    label: 'A partir de...',
    field: row => row.cantidadMin
  },
  {
    name: 'precioSinFactura',
    label: 'Precio sin factura',
    field: row => row.precioSinFactura,
    format: value => (value != null ? `${value} bs` : 'a ingresar')
  },
  {
    name: 'precioConFactura',
    label: 'Precio con factura',
    field: row => row.precioConFactura,
    format: value => (value != null ? `${value} bs` : 'a ingresar')
  },
  {
    name: 'actions',
    label: '',
    align: 'center',
    slot: true
  }
];
</script>
