<template>
  <div>
    <p>Proveedores</p>

    <Table
      :rows="estado.serviciosProducto"
      :columns="[
        {
          name: 'proveedor',
          required: true,
          label: 'Proveedor',
          align: 'left',
          field: (row) => row.proveedor.nombre,
          sortable: true,
        },
        {
          name: 'marca',
          required: true,
          label: 'Marca',
          align: 'center',
          field: (row) => row.marca.nombre,
          sortable: true,
        },
        {
          name: 'identificativo',
          required: true,
          label: 'Identificativo',
          align: 'center',
          field: (row) => row.identificativo,
          sortable: true,
        },
        {
          name: 'precioConFactura',
          required: true,
          label: 'Precio C/F',
          align: 'center',
          field: (row) => row.precioConFactura + 'Bs',
          sortable: true,
        },
        {
          name: 'precioSinFactura',
          required: true,
          label: 'Precio S/F',
          align: 'center',
          field: (row) => row.precioSinFactura + 'Bs',
          sortable: true,
        },
        {
          name: 'actions',
          label: 'Acciones',
          align: 'right',
        },
      ]"
    >
      <template #dropdown>
        <q-btn
          color="primary"
          icon="add"
          label="Agregar proveedores"
          no-caps
          @click="
            () => {
              // limpiarProductoProveedor();
              estado.modal.show_modificarServicioProducto = false;
              estado.modal.show_crearServicioProducto = true;
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
            @click="modalModificarServicioProducto(props.row)"
          >
            <q-tooltip> Editar proveedor </q-tooltip></q-btn
          >
        </q-td>
      </template>
    </Table>
  </div>

  <!-- PRODUCTO PROVEEDOR -->
  <Dialog
    v-model="estado.modal.show_crearServicioProducto"
    :title="
      estado.modal.show_modificarServicioProducto
        ? 'Modificar proveedor'
        : 'Agregar proveedor'
    "
    :label-btn="
      estado.modal.show_modificarServicioProducto ? 'Modificar' : 'Crear'
    "
    :handle-submit="
      estado.modal.show_modificarServicioProducto
        ? modificarServicioProducto
        : crearServicioProducto
    "
  >
    <template #inputsDialog>
      <div v-if="!estado.modal.show_modificarServicioProducto">
        <p>Se va registrar un proveedor para este producto.</p>
      </div>
      <input-select
        label="Proveedor"
        v-if="!estado.modal.show_modificarServicioProducto"
        info="Elija un proveedor o crealo si no existe con el boton [+]"
        :opciones="estado.proveedoresParaSelect"
        @update="(v) => (estado.datos_servicioProducto.proveedor = v)"
        :porDefecto="
          estado.modal.show_modificarServicioProducto
            ? estado.datos_servicioProducto.proveedor
            : null
        "
        :disable="estado.modal.show_modificarServicioProducto"
        :rules="
          estado.modal.show_modificarServicioProducto
            ? []
            : [useRules.requerido()]
        "
      />

      <input-select
        label="Marca"
        v-if="!estado.modal.show_modificarServicioProducto"
        mensaje="Seleccione la marca que vende este proveedor. Si la marca no existe, agregue la en la zona MARCAS."
        :opciones="
          productoStore.producto.variedades.map((variedad) => ({
            value: variedad.marca._id,
            label: variedad.marca.nombre,
          }))
        "
        @update="(v) => (estado.datos_servicioProducto.marca = v)"
        :porDefecto="
          estado.modal.show_modificarServicioProducto
            ? estado.datos_servicioProducto.proveedor
            : null
        "
        :rules="
          estado.modal.show_modificarServicioProducto
            ? []
            : [useRules.requerido()]
        "
      />

      <input-text
        label="Identificativo"
        @update="(v) => estado.datos_servicioProducto.identificativo"
        info="La referencia del producto en el catalogo y las facturas del proveedor."
      />

      <input-text
        label="Precio sin factura"
        @update="
          (v) => (estado.datos_servicioProducto.precioSinFactura = Number(v))
        "
        info="Use el punto '.' como separador de decimales."
        :rules="[useRules.requerido(), useRules.numero()]"
        :porDefecto="
          '' + (estado.datos_servicioProducto.precioSinFactura ?? '')
        "
      />

      <input-text
        label="Precio con factura"
        @update="
          (v) => (estado.datos_servicioProducto.precioConFactura = Number(v))
        "
        info="Use el punto '.' como separador de decimales."
        :rules="[useRules.requerido(), useRules.numero()]"
        :porDefecto="
          '' + (estado.datos_servicioProducto.precioConFactura ?? '')
        "
      />

      <!-- <div class="flex justify-between items-center mt-2 mb-1">
        <h1 class="font-bold text-xs">PRECIOS POR MAYOR:</h1>
        <q-btn
          color="primary"
          label="Agregar precio"
          dense
          no-caps
          padding="1px 6px"
          @click="estado.modal.esCrearPrecio = true"
        />
      </div>

      <table class="min-w-full bg-white rounded-sm overflow-hidden">
        <thead class="bg-teal-700 text-white">
          <tr class="[&>th]:py-1">
            <th class="text-center text-xs uppercase tracking-wider">
              Cantidad
            </th>
            <th class="text-center text-xs uppercase tracking-wider">
              Precio C/F
            </th>
            <th class="text-center text-xs uppercase tracking-wider">
              Precio S/F
            </th>
            <th class="text-center text-xs uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="(precio, index) in estado.datos_servicioProducto.precios"
            :key="index"
            class="[&>td]:border [&>td]:border-gray-400"
          >
            <td class="whitespace-nowrap text-center">
              {{ precio.cantidadMin }}
            </td>
            <td class="whitespace-nowrap text-center">
              {{ precio.precioConFactura }}
            </td>
            <td class="whitespace-nowrap text-center">
              {{ precio.precioSinFactura }}
            </td>
            <td class="whitespace-nowrap text-center">
              <q-btn color="primary" icon="edit" dense size="10px" flat />
              <q-btn color="red" icon="delete" dense size="10px" flat />
            </td>
          </tr>
        </tbody>
      </table>-->
    </template>
  </Dialog>

  <!-- CREAR PROVEEDOR ENTIDAD -->
  <Dialog
    v-model="estado.modal.show_crearProveedor"
    title="Crear proveedor"
    label-btn="Crear"
    :handle-submit="crearProveedorGlobal"
  >
    <template #inputsDialog>
      <p>Se agregará un proveedor a la lista global de proveedores.</p>
      <!-- nombre -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Nombre *"
            required
            v-model="estado.proveedor.nombre"
            type="text"
            class="w-full"
            filled
            dense
          />
        </div>
      </div>

      <!-- descripcion -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Descripcion *"
            required
            v-model="estado.proveedor.descripcion"
            type="text"
            class="w-full"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="La categoría existe solamente a fines de ubicar facilmente el producto en administracion. Para crear una nueva categoria, vaya al menu Logistica > Categorías."
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { useDetalleProveedores } from '@/modulos/productos/negocio/detalle/proveedores.composable';
const {
  estado,
  productoStore,
  buscarProveedores,
  crearServicioProducto,
  modalModificarServicioProducto,
  modificarServicioProducto,
  crearProveedorGlobal,
  buscarServiciosProducto,
} = useDetalleProveedores();

onMounted(async () => {
  await buscarProveedores();
  await buscarServiciosProducto();
  console.log(estado.serviciosProducto[0]);
  estado.proveedoresParaSelect = estado.proveedores.map((proveedor) => {
    return {
      label: proveedor.nombre,
      value: proveedor._id,
    };
  });
  productoStore.producto.variedades.map((variedad) => ({
    _id: variedad.marca._id,
    nombre: variedad.marca.nombre,
  }));
});
</script>
