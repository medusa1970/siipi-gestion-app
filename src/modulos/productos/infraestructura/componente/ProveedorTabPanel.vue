<template>
  <div>
    <p>Proveedores</p>

    <Table :rows="estado.proveedoresProducto" :columns="columnaProveedores">
      <template #dropdown>
        <q-btn
          color="primary"
          icon="add"
          label="Agregar proveedores"
          no-caps
          @click="
            () => {
              limpiarProductoProveedor();
              estado.modal.show_modificarProductoProveedor = false;
              estado.modal.show_crearProductoProveedor = true;
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
            @click="modalModificarProductoProveedor(props.row)"
          >
            <q-tooltip> Editar proveedor </q-tooltip></q-btn
          >
        </q-td>
      </template>
    </Table>
  </div>

  <!-- PRODUCTO PROVEEDOR -->
  <Dialog
    v-model="estado.modal.show_crearProductoProveedor"
    :title="
      estado.modal.show_modificarProductoProveedor
        ? 'Modificar proveedor'
        : 'Agregar proveedor'
    "
    :label-btn="
      estado.modal.show_modificarProductoProveedor ? 'Modificar' : 'Crear'
    "
    :handle-submit="
      estado.modal.show_modificarProductoProveedor
        ? modificarProveedorProducto
        : crearProductoProveedor
    "
  >
    <template #inputsDialog>
      <p>Se va registrar un proveedor para este producto.</p>

      <!-- proveedor -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-select
            label="Proveedor *"
            required
            v-model="estado.datos_productoProveedor.proveedor"
            :options="estado.proveedores"
            option-label="nombre"
            class="w-full"
            emit-value
            dense
            filled
            :disable="estado.modal.show_modificarProductoProveedor"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <q-btn
          v-if="!estado.modal.show_modificarProductoProveedor"
          size="12px"
          icon="add"
          color="primary"
          round
          style="height: 16px"
          @click="estado.modal.show_crearProveedor = true"
        ></q-btn>
        <div>
          <BotonDetalle
            mensaje="Elija un proveedor o crealo si no existe con el boton [+]"
          />
        </div>
      </div>

      <!-- marca -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-select
            label="Marca *"
            required
            v-model="estado.datos_productoProveedor.marca"
            :options="
              productoStore.producto.variedades.map((variedad) => ({
                _id: variedad.marca._id,
                nombre: variedad.marca.nombre,
              }))
            "
            :option-label="(option) => option.nombre"
            emit-value
            class="w-full"
            dense
            filled
            :disable="estado.modal.show_modificarProductoProveedor"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div>
          <BotonDetalle
            mensaje="Seleccione la marca que vende este proveedor. Si la marca no existe, agregue la en la zona MARCAS."
          />
        </div>
      </div>

      <!-- input Identificativo -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Identificativo"
            v-model="estado.datos_productoProveedor.identificativo"
            type="text"
            class="w-full"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="La referencia del producto en el catalogo y las facturas del proveedor."
          />
        </div>
      </div>

      <!-- Sin factura -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Precio sin factura *"
            v-model.number="estado.datos_productoProveedor.precioSinFactura"
            type="text"
            class="w-full"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Use el punto '.' como separador de decimales."
          />
        </div>
      </div>

      <!-- Con factura -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Precio con factura"
            v-model.number="estado.datos_productoProveedor.precioConFactura"
            type="text"
            class="w-full"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Use el punto '.' como separador de decimales."
          />
        </div>
      </div>

      <div class="flex justify-between items-center mt-2 mb-1">
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
            v-for="(precio, index) in estado.datos_productoProveedor.precios"
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
      </table>
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
import { columnaProveedores } from '@/modulos/productos/infraestructura/utils/columns';
import { useProductoDetalle } from '@/modulos/productos/negocio/productoDetalle.composable';

const {
  estado,
  productoStore,
  buscarProveedores,
  buscarProveedoresProducto,
  limpiarProductoProveedor,
  crearProductoProveedor,
  modalModificarProductoProveedor,
  modificarProveedorProducto,
  crearProveedorGlobal,
} = useProductoDetalle();

// if (productoStore.producto) {
//   estado.datos_productoMedida.medida = productoStore.producto.medida;
// }

onMounted(async () => {
  await buscarProveedores();
  await buscarProveedoresProducto();
});
</script>
