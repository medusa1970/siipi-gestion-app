<template>
  <div>
    <p>
      La medida básica es la forma en que se maneja el producto (por peso,
      unidad, etc).
    </p>
    <div class="flex flex-col mt-3 mb-3">
      <div
        v-if="
          !productoStore.producto.empaques ||
          (productoStore.producto.empaques &&
            productoStore.producto.empaques.length === 0)
        "
      >
        <div v-if="!estado.datos_productoMedida.medida">
          <p>
            Para poder agregar empaques, primero debes definir la medida basica.
          </p>
        </div>

        <div
          class="flex"
          style="justify-content: space-between; margin: 10px 0"
        >
          <div style="flex-grow: 1">
            <q-select
              label="Medida basica"
              v-model="estado.datos_productoMedida.medida"
              :options="estado.medidas"
              option-label="nombre"
              emit-value
              use-input
              outlined
              dense
              input-debounce="0"
              hide-selected
              fill-input
              onfocus="this.select()"
              class="w-full"
            >
              <template v-slot:append>
                <q-icon
                  style="margin: 0"
                  name="close"
                  @click.stop.prevent="estado.datos_productoMedida.medida = ''"
                  class="cursor-pointer q-mr-md"
                />
              </template>
              <template v-slot:prepend>
                <q-icon name="straighten" />
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

          <div>
            <q-btn
              size="12px"
              icon="add"
              color="primary"
              round
              style="height: 16px"
              @click="estado.modal.show_crearMedida = true"
            ></q-btn>
          </div>

          <div>
            <BotonDetalle
              mensaje="Seleccione una marca entre todas que se registraron globalmente en la empresa. Si la marca que quiere agregar no existe, puede crearla via el boton [+]"
            />
          </div>

          <div class="!flex flex-row w-full gap-3 items-center">
            <q-btn
              v-if="
                productoStore.producto.empaques &&
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
      </div>
      <div v-else>
        <div style="flex-grow: 1">
          <q-select
            label="Medida basica"
            v-model="estado.datos_productoMedida.medida"
            :options="estado.medidas"
            option-label="nombre"
            emit-value
            use-input
            outlined
            dense
            disable
            input-debounce="0"
            hide-selected
            fill-input
            onfocus="this.select()"
            class="w-full"
          >
            <template v-slot:append>
              <q-icon
                style="margin: 0"
                name="close"
                @click.stop.prevent="estado.datos_productoMedida.medida = ''"
                class="cursor-pointer q-mr-md"
              />
            </template>
            <template v-slot:prepend>
              <q-icon name="straighten" />
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
      </div>

      <div v-if="estado.datos_productoMedida.medida">
        <br />

        <p>
          Los empaques son la formas que llegan en producto en el almacén, por
          ejemplo en tira o paquete de tal o tal marca.
        </p>
        <div v-if="productoStore.producto.variedades?.length === 0">
          <p>
            Para poder agregar empaques, primero debes agregar por lo menos una
            marca al producto.
          </p>
        </div>
        <Table
          :rows="productoStore.producto.empaques"
          :columns="columnaEmpaques"
        >
          <template #select>
            <q-btn
              color="primary"
              icon="add"
              label="Agregar empaque"
              no-caps
              :disable="productoStore.producto.variedades?.length === 0"
              @click="
                () => {
                  limpiarProductoEmpaque();
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
            </q-td>
          </template>
        </Table>
      </div>
    </div>
  </div>

  <!-- CREAR MEDIDA -->
  <Dialog
    v-model="estado.modal.show_crearMedida"
    title="Crear medida"
    label-btn="Crear"
    :handle-submit="crearMedidaGlobal"
  >
    <template #inputsDialog>
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">CREAR MEDIDA</h1>

      <div class="flex flex-col gap-2 mt-3">
        <q-input
          label="Nombre *"
          required
          v-model="estado.medida.nombre"
          type="text"
          outlined
          dense
          clearable
        />
      </div>
    </template>
  </Dialog>

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
      <p>
        Registren las diferentes presentaciones. El formulario se prellena de
        forma automatica al seleccionar un empaque pero puede cambiar los
        valores.
      </p>

      <!-- input marca -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-select
            label="Marca *"
            required
            filled
            class="w-full"
            v-model="estado.datos_productoMedida.marca"
            :options="
              productoStore.producto.variedades.map(
                (variedad) => variedad.marca,
              )
            "
            option-label="nombre"
            map-options
            dense
          >
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
                :class="scope.opt.class"
              >
                <q-item-section>{{ scope.opt.nombre }}</q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div>
          <BotonDetalle
            mensaje="Seleccione una marca entre las que ya se registraron para este producto. Si la marca que desea ingresar no existe, agregue la primero en la zona MARCAS."
          />
        </div>
      </div>

      <!-- input empaque -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-select
            label="Empaque *"
            required
            filled
            class="w-full"
            v-model="estado.datos_productoMedida.empaque"
            :options="estado.datos_productoMedida.medida.tipoEmpaques"
            option-label="nombre"
            map-options
            dense
            :disable="
              estado.datos_productoMedida.medida.nombre === ''
              // || estado.modal.esEditarEmpaque
            "
          >
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
                :class="scope.opt.class"
              >
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
          @click="estado.modal.show_crearEmpaque = true"
        ></q-btn>
        <div>
          <BotonDetalle
            mensaje="La medida básica viene con nombres de empaque predefinidos, seleccione uno o creelo si no existe."
          />
        </div>
      </div>

      <!-- abreviacion -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Abreviacion *"
            required
            class="w-full"
            v-model="estado.datos_productoMedida.empaque.abreviacion"
            type="text"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="La abreviacion debe tener entre 1 o 3 caracteres idealmente, por ejemplo TIR, DL, 12a, etc..."
          />
        </div>
      </div>

      <!-- input cantidad -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Cantidad en unidades básicas *"
            required
            class="w-full"
            v-model.number="estado.datos_productoMedida.empaque.cantidad"
            type="text"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Es la cantidad de unidades básicas que entran en este empaque, dependiendo de lo que se configuró : cantidades de unidades en una caja, o de mililitros/gramos en una bolsa, etc..."
          />
        </div>
      </div>
    </template>
  </Dialog>

  <!-- CREAR EMPAQUE GLOBAL-->
  <Dialog
    v-model="estado.modal.show_crearEmpaque"
    title="Crear nombre de empaque"
    label-btn="Crear"
    :handle-submit="crearEmpaqueGlobal"
  >
    <template #inputsDialog>
      <p>
        Registra un nombre de empaque que se podrá reutilizar para registrar
        empaques de productos.
      </p>

      <!-- nombre -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Nombre *"
            required
            class="w-full"
            v-model="estado.empaque.nombre"
            type="text"
            filled
            dense
          />
        </div>
      </div>

      <!-- abreviacion -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Abreviacion *"
            required
            class="w-full"
            v-model="estado.empaque.abreviacion"
            type="text"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="La abreviacion debe tener entre 1 o 3 caracteres idealmente, por ejemplo TIR, DL, 12a, etc..."
          />
        </div>
      </div>

      <!-- abreviacion -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-input
            class="w-full"
            v-model.number="estado.empaque.cantidad"
            type="number"
            label="cantidad en unidades basicas"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="La cantidad de unidades básicas del tipo de empaque (opcional) ; solo sirve para prellenar el formulario al crear un empaque del producto."
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { columnaEmpaques } from '@/modulos/productos/infraestructura/utils/columns';
import { useProductoDetalle } from '@/modulos/productos/negocio/productoDetalle.composable';

const {
  estado,
  productoStore,
  buscarMedidas,
  crearMedidaGlobal,
  guardarMedidaBasicaProducto,
  crearProductoEmpaque,
  modificarProductoEmpaque,
  limpiarProductoEmpaque,
  modalModificarProductoEmpaque,
  crearEmpaqueGlobal,
} = useProductoDetalle();

if (productoStore.producto) {
  estado.datos_productoMedida.medida = productoStore.producto.medida;
}

onMounted(async () => {
  await buscarMedidas();
});
</script>
