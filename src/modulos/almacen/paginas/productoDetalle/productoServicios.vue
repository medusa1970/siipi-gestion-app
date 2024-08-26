<template>
  <Tabla
    :rows="rowsTabla"
    disableExpand
    :columns="[
      {
        name: 'proveedor',
        required: true,
        label: 'Proveedor',
        align: 'esestadotado',
        field: row => row.proveedor.nombre,
        sortable: true
      },
      {
        name: 'marca',
        required: true,
        label: 'Marca',
        align: 'center',
        field: row => row.marca.nombre,
        sortable: true
      },
      {
        name: 'identificativo',
        required: true,
        label: 'Identificativo',
        align: 'center',
        field: row => row.identificativo,
        sortable: true
      },
      {
        name: 'precioConFactura',
        required: true,
        label: 'Precio C/F',
        align: 'center',
        field: row => row.precioConFactura + ' Bs',
        sortable: true
      },
      {
        name: 'precioSinFactura',
        required: true,
        label: 'Precio S/F',
        align: 'center',
        field: row => row.precioSinFactura + ' Bs',
        sortable: true
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'right',
        slot: true
      }
    ]">
    <template #dropdown>
      <div class="flex">
        <input-text
          label="Buscar"
          labelAdentro
          @update="(v) => (estado.filtros.buscar = v as string)"
          class="col-span-1"
          noSlot />
        <q-btn
          @click="() => (estado.modal.formServicioCrear = true)"
          icon="add"
          color="green"
          no-caps
          padding="4px 10px" />
      </div>
    </template>
    <template #cell-actions="{ row }">
      <q-btn-group push @click="e => e.stopPropagation()">
        <q-btn
          @click="
            () => {
              estado.servicio = row;
              estado.entidadProveedorId = estado.servicio.proveedor._id;
              estado.modal.formServicioModificar = true;
            }
          "
          class="p-1"
          color="black"
          size="sm"
          icon="edit" />
        <btnAccion
          @click="
            () => {
              estado.servicio = row;
              estado.entidadProveedorId = estado.servicio.proveedor._id;
              borrarServicioDialog();
            }
          "
          color="red"
          icono="delete" />
      </q-btn-group>
    </template>
    <template #body-expand="{ row }">
      <pre>{{ row }}</pre>
    </template>
  </Tabla>

  <Popup
    v-model="estado.modal.formServicioModificar"
    titulo="Modificar el proveedor">
    <template #body>
      <formServicio
        :config="{
          proveedorId: estado.entidadProveedorId,
          producto: estado.producto
        }"
        :edicion="estado.servicio"
        @modificarObjeto="handleServicioModificado" />
    </template>
  </Popup>

  <Popup
    v-model="estado.modal.formServicioCrear"
    titulo="Registrar nuevo proveedor">
    <template #body>
      <formServicio
        :config="{
          producto: estado.producto
        }"
        @crearObjeto="handleServicioCreado" />
    </template>
  </Popup>
</template>

<script setup lang="ts">
import type { Entidad } from '#gql';
import type { Servicio } from '#gql';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
const { store, router } = useAlmacen();
import formServicio from '@/modulos/almacen/forms/formServicio.vue';
const props = defineProps({
  productoCorriente: null
});

const $q = useQuasar();
const borrarServicioDialog = () => {
  $q.dialog({
    message: '¿Estas seguro de borrar esto?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    borrarServicio();
  });
};

/**
 * Rows para la tabla
 */
const rowsTabla = computed(() => {
  let filtered = estado.servicios;
  if (!filtered) return [];
  if (estado.filtros.buscar != null) {
    const regex = new RegExp(`${estado.filtros.buscar}`, 'i');
    filtered = filtered.filter(servicio => {
      return regex.test(
        servicio.proveedor?.nombre +
          servicio.proveedor?.nombre
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') +
          servicio.marca.nombre +
          servicio.marca.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      );
    });
  }
  return filtered;
});

const estado = reactive({
  // el producto corriente
  producto: props.productoCorriente,

  // los servicios de este producto, cada uno con su proveedor
  servicios: [] as (Servicio & { proveedor: Entidad })[],
  // el servicio que se esta modificando
  entidadProveedorId: null as string, // la entidad del proveedor
  servicio: null as Servicio & { proveedor: Entidad },
  // los dialogs
  modal: {
    formServicioModificar: false,
    formServicioCrear: false
  },
  // config de los filtros de la tabla
  filtros: {
    buscar: ''
  }
});

// recupera toos los servicios del producto en store
const getServiciosProducto = async () => {
  let proveedores;
  try {
    proveedores = await buscarVarios(GqlBuscarEntidades_servicios, {
      busqueda: {
        tipo: ['PROVEEDOR'],
        servicios: {
          producto: estado.producto._id
        }
      },
      filtro: {
        servicios: {
          producto: estado.producto._id
        }
      }
    });
  } catch (err) {
    errFailback(err);
    return;
  }

  // juntamos todos los servicios
  let servicios = [];
  for (const proveedor of proveedores) {
    // asignamos a cada servicio su proveedor
    const serviciosConProveedores = proveedor.servicios.map(servicio => {
      Object.assign(servicio, { proveedor: proveedor });
      // para evitar recursividad que bota un error
      delete servicio.proveedor.servicios;
      return servicio;
    });
    // agragamos todo a la lista
    servicios = [...servicios, ...serviciosConProveedores];
  }
  estado.servicios = servicios;
  return servicios;
};

const handleServicioCreado = (servicio, proveedor) => {
  NotifySucessCenter('Proveedor creado éxitosamente');
  Object.assign(servicio, { proveedor });
  delete servicio.proveedor.servicios;
  estado.servicios.push(servicio);
  estado.modal.formServicioCrear = false;
};

const handleServicioModificado = (servicio, proveedor) => {
  NotifySucessCenter('Proveedor modificado éxitosamente');
  Object.assign(servicio, { proveedor });
  delete servicio.proveedor.servicios;
  estado.servicios = estado.servicios.map(s =>
    s._id === servicio._id ? servicio : s
  );
  estado.modal.formServicioModificar = false;
};

onMounted(() => {
  getServiciosProducto();
});

const borrarServicio = async () => {
  try {
    const servicioBorrado = await buscarUno(GqlModificarEntidades_basico, {
      busqueda: estado.entidadProveedorId,
      datos: {
        servicios: {
          borrar: {
            _id: estado.servicio._id
          }
        }
      }
    });
    if (servicioBorrado) {
      NotifySucessCenter('Se borró éxitosamente');
      estado.servicios = estado.servicios.filter(
        e => e._id !== servicioBorrado._id
      );
    }
  } catch (err) {
    errFailback(err);
    return;
  }
};
</script>

<style lang="scss" scoped></style>
