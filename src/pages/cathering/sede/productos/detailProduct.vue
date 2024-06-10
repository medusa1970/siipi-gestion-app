<template>
  <Navigation
    label="Productos"
    icon="list_alt"
    :label2="producto.datosBasicos.nombre"
    href="/cathering/sede/productos"
  />

  <!--
      TITLE
      -->

  <h1 class="text-lg font-extrabold uppercase text-center">
    {{ producto.datosBasicos.nombre }}
  </h1>

  <!--
    TABS
    -->

  <q-tabs
    v-model="estado.tab"
    inline-label
    outside-arrows
    mobile-arrows
    class="bg-grey-7 text-white shadow-2"
    align="justify"
    no-caps
  >
    <div class="!flex h-full">
      <q-btn icon="arrow_back" flat />
      <!-- <q-btn icon="apps_outage" flat /> -->
    </div>
    <q-tab name="datosBasicos" icon="storefront" label="Datos basicos" />
    <q-tab name="marcas" icon="group" label="Marcas Existentes" />
    <q-tab name="medidas" icon="folder_copy" label="Medidas & Empaques" />
    <q-tab name="proveedores" icon="query_stats" label="Proveedores" />
  </q-tabs>
  <q-tab-panels
    v-model="estado.tab"
    animated
    style="height: calc(100vh - 115px)"
  >
    <q-tab-panel name="datosBasicos" animated>
      <div class="grid grid-cols-2">
        <div class="flex flex-col">
          <!-- nombre -->
          <h1 class="font-bold text-xs" style="margin-top: 10px">NOMBRE:</h1>
          <div class="flex">
            <q-input
              style="width: 85%"
              v-model="producto.datosBasicos.nombre"
              type="text"
              filled
              required
              clearable
            />
            <BotonDetalle
              mensaje="SOLO modifiquen el nombre en caso de deber corrigir su ortografia."
            />
          </div>

          <!-- Categoria -->
          <h1 class="font-bold text-xs" style="margin-top: 10px">CATEGORIA:</h1>
          <div class="flex">
            <div class="select-container" style="width: 85%">
              <select
                id="two-level-select"
                class="border border-gray-400 rounded-[4px] shadow-sm text-base block w-full py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                v-model="producto.datosBasicos.categoria"
              >
                <option value="" disabled selected>
                  Selecciona una categoria
                </option>
                <optgroup
                  v-for="categoria in estado.categorias.hijas"
                  :key="categoria"
                  :label="`${categoria.nombre} ( ${categoria.hijas.length} )`"
                >
                  <option
                    v-for="subCategoria in categoria.hijas"
                    :key="subCategoria"
                    :value="subCategoria"
                  >
                    {{ subCategoria.nombre }}
                  </option>
                </optgroup>
              </select>
            </div>
            <BotonDetalle
              mensaje="La categoría sirve solo a fines de ubicar facilmente el producto en administracion. Para crear una nueva categoria, vaya al menu Logistica > Categorías."
            />
          </div>

          <!-- Comentario -->
          <h1 class="font-bold text-xs" style="margin-top: 10px">
            COMENTARIO:
          </h1>
          <div class="flex">
            <q-input
              style="width: 85%"
              v-model="producto.datosBasicos.comentario"
              type="text"
              filled
            />
            <BotonDetalle
              mensaje="Entre cualquier información adicional que sea útil registrar junto con el producto."
            />
          </div>

          <!-- Imagen -->
          <h1 class="font-bold text-xs" style="margin-top: 10px">IMAGEN:</h1>
          <div class="flex">
            <q-file
              style="width: 85%"
              v-model="imagen"
              label="Seleccionar imagen"
              accept=".jpg, .png, .jpge"
              max-total-size="560000"
              @rejected="onRejected"
              counter
              filled
              hint="Tamaño máximo de imagen 540KB"
              clearable
              dense
            >
              <template v-slot:prepend>
                <q-icon name="cloud_upload" @click.stop.prevent />
              </template>
            </q-file>
            <BotonDetalle mensaje="" />
          </div>
        </div>

        <div class="col-span-1 !p-0">
          <q-card style="width: 100%; height: 400px; margin: auto">
            <q-img
              style="width: 100%; height: 100%; object-fit: cover"
              :src="imagePreview"
              ><div class="absolute-bottom">
                <div class="text-h6 text-center">IMAGEN</div>
              </div></q-img
            >
          </q-card>
        </div>
      </div>
      <q-btn
        color="primary"
        label="Editar informacion"
        no-caps
        class="block mx-auto mt-5"
        @click="editarProductoBasico"
      />
    </q-tab-panel>
    <q-tab-panel name="marcas" animated>
      <!-- <code>{{ useProduct.producto.variedades }}</code> -->
      <h1 class="font-extrabold text-xs">MARCAS:</h1>
      <Table
        :rows="useProduct.producto.variedades"
        :columns="marcas"
        style="border: 1px solid gray"
        badge
      >
        <template #dropdown>
          <q-btn
            color="primary"
            icon="add"
            label="Agregar marca"
            no-caps
            @click="estado.modal.esCrearMarcaProducto = true"
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
              <!-- <q-img
              v-else
              :src="Oferta"
              spinner-color="black"
              class="cell-image"
              width="40px"
              height="40px"
            /> -->
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
                color="primary"
                icon="edit"
                dense
                flat
                round
                size="12px"
                padding="2px"
              />
              <q-btn
                color="red"
                icon="delete"
                dense
                flat
                round
                size="12px"
                padding="2px"
              />
            </q-td>
          </q-tr>
        </template>
      </Table>
    </q-tab-panel>
    <q-tab-panel name="medidas" animated>
      <div class="flex flex-col mt-3 mb-3">
        <h1 class="font-extrabold text-xs">MEDIDAS BASICAS:</h1>

        <div class="!flex flex-row w-full gap-3 items-center">
          <q-select
            color="primary"
            v-model="estado.medidaProducto.medida"
            :options="estado.medidas"
            label="Seleccionar medida basica"
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
                @click.stop.prevent="estado.medidaProducto.medida = ''"
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
          <q-btn
            size="12px"
            icon="add"
            color="primary"
            round
            style="height: 16px"
            @click="estado.modal.esCrearMedida = true"
          ></q-btn>
        </div>
      </div>

      <h1 class="font-extrabold text-xs">EMPAQUES:</h1>
      <Table
        :rows="useProduct.producto.empaques"
        :columns="empaques"
        style="border: 1px solid gray"
      >
        <template #dropdown>
          <q-btn
            color="primary"
            icon="add"
            label="Agregar empaques"
            no-caps
            @click="estado.modal.isAddEmpaque = true"
          />
        </template>

        <template #body-cell-actions="{ props }">
          <q-td :props="props">
            <q-btn color="primary" icon="edit" dense flat round size="13px" />
            <q-btn color="red" icon="delete" dense flat round size="13px" />
          </q-td>
        </template>
      </Table>
    </q-tab-panel>

    <q-tab-panel name="proveedores" animated>
      <h1 class="font-extrabold text-xs">PROVEEDORES:</h1>

      <Table :columns="proveedores" style="border: 1px solid gray">
        <template #dropdown>
          <q-btn
            color="primary"
            icon="add"
            label="Agregar proveedores"
            no-caps
            @click="estado.modal.isAddProveedor = true"
          />
        </template>
      </Table>
    </q-tab-panel>
  </q-tab-panels>

  <!-- DIALOG -->
  <Dialog
    v-model="estado.dialog.isAddPresentation"
    :title="
      estado.dialog.isEditPresentation
        ? 'Editar presentacion'
        : 'Agregar presentacion'
    "
    :handle-submit="
      estado.dialog.isEditPresentation
        ? modificarPresentacion
        : agregarPresentacion
    "
  >
    <template #inputsDialog>
      <div class="flex flex-col gap-2">
        <q-input
          v-model="estado.presentacion.nombre"
          type="text"
          label="Nombre"
          outlined
          dense
        />
        <q-input
          v-model.number="estado.presentacion.cantidad"
          type="number"
          label="cantidad"
          outlined
          dense
        />
      </div>
    </template>
  </Dialog>

  <!-- PRODUCTO MARCA -->
  <Dialog2
    v-model="estado.modal.esCrearMarcaProducto"
    title="Agregar marca"
    label-btn="Crear"
    :handle-submit="editarProductoMarca"
  >
    <template #inputsDialog>
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">MARCA</h1>

      <div class="flex flex-col gap-2 mt-3">
        <div class="!flex flex-row w-full gap-3 items-center">
          <q-select
            color="primary"
            v-model="estado.marcaProducto.marca"
            :options="estado.marcas"
            label="Seleccionar marca"
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
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="branding_watermark" />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-btn
            size="12px"
            icon="add"
            color="primary"
            round
            style="height: 16px"
            @click="estado.modal.esCrearMarca = true"
          ></q-btn>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <q-input
            v-model="estado.marcaProducto.minimo"
            type="text"
            label="Minimo"
            outlined
            dense
            clearable
            required
          />
          <q-input
            v-model="estado.marcaProducto.maximo"
            type="text"
            label="Maximo"
            outlined
            dense
            clearable
            required
          />
        </div>
        <q-file
          v-model="imagenMarca"
          label="Seleccionar imagen"
          accept=".jpg, .png, .jpge"
          max-total-size="560000"
          @rejected="onRejected"
          counter
          outlined
          dense
          hint="Tamaño máximo de imagen 540KB"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" @click.stop.prevent />
          </template>
        </q-file>
        <div
          v-if="imagePreviewMarca"
          style="width: 200px; height: 200px; margin: auto"
        >
          <q-img
            style="width: 100%; height: 100%; object-fit: cover"
            :src="imagePreviewMarca"
          ></q-img>
        </div>
      </div>
    </template>
  </Dialog2>

  <!-- PRODUCTO MEDIDA & EMPAQUE  -->
  <Dialog2
    v-model="estado.modal.isAddEmpaque"
    title="Agregar empaque"
    label-btn="Crear"
    :handle-submit="editarProductoMedidaEmpaque"
  >
    <template #inputsDialog>
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">Empaque</h1>

      <h1 class="font-bold text-xs mt-2">MARCA:</h1>
      <q-select
        color="primary"
        v-model="estado.medidaProducto.marca"
        :options="useProduct.producto.variedades"
        label="Seleccionar marca"
        :option-label="(option) => option.marca?.nombre"
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
            @click.stop.prevent="brandSelected = ''"
            class="cursor-pointer q-mr-md"
          />
        </template>
        <template v-slot:prepend>
          <q-icon name="branding_watermark" />
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No hay resultados
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <h1 class="font-bold text-xs mt-2">EMPAQUE:</h1>
      <div class="!flex flex-row w-full gap-3 items-center">
        <q-select
          color="primary"
          v-model="estado.medidaProducto.empaque"
          :options="estado.medidaProducto.medida.tipoEmpaques"
          label="Seleccionar empaque"
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
          :disable="estado.medidaProducto.medida.nombre === ''"
          required
        >
          <template v-slot:append>
            <q-icon
              style="margin: 0"
              name="close"
              @click.stop.prevent="estado.medidaProducto.empaque = ''"
              class="cursor-pointer q-mr-md"
            />
          </template>
          <template v-slot:prepend>
            <q-icon name="bi-box2" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No hay resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-btn
          size="12px"
          icon="add"
          color="primary"
          round
          style="height: 16px"
          @click="estado.modal.esCrearEmpaque = true"
        ></q-btn>
      </div>

      <h1 class="font-bold text-xs mt-2">ABREVIACION:</h1>
      <q-input
        v-model="estado.medidaProducto.empaque.abreviacion"
        type="text"
        label="Abreviacion"
        outlined
        dense
        clearable
        required
      />

      <h1 class="font-bold text-xs mt-2">CANTIDAD:</h1>
      <q-input
        v-model.number="estado.medidaProducto.cantidad"
        type="text"
        label="Cantidad"
        outlined
        dense
        clearable
        required
      />
    </template>
  </Dialog2>

  <!-- PRODUCTO PROVEEDOR -->
  <Dialog2
    v-model="estado.modal.isAddProveedor"
    title="Agregar proveedores"
    label-btn="Crear"
  >
    <template #inputsDialog>
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">PROVEEDORES</h1>

      <h1 class="font-bold text-xs mt-2">MARCA:</h1>
      <q-select
        color="primary"
        v-model="estado.medidaProducto.marca"
        :options="useProduct.producto.variedades"
        label="Seleccionar marca"
        :option-label="(option) => option.marca?.nombre"
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
            @click.stop.prevent="brandSelected = ''"
            class="cursor-pointer q-mr-md"
          />
        </template>
        <template v-slot:prepend>
          <q-icon name="branding_watermark" />
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No hay resultados
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <h1 class="font-bold text-xs mt-2">PROVEEDOR:</h1>
      <div class="!flex flex-row w-full gap-3 items-center">
        <q-select
          color="primary"
          v-model="brandSelected"
          :options="estado.proveedores"
          label="Seleccionar proveedor"
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
              @click.stop.prevent="brandSelected = ''"
              class="cursor-pointer q-mr-md"
            />
          </template>
          <template v-slot:prepend>
            <q-icon name="branding_watermark" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No hay resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-btn
          size="12px"
          icon="add"
          color="primary"
          round
          style="height: 16px"
          @click="estado.modal.esCrearProveedor = true"
        ></q-btn>
      </div>

      <h1 class="font-bold text-xs mt-2">IDENTIFICATIVO:</h1>
      <q-input
        v-model="text"
        type="text"
        label="Identificativo"
        outlined
        dense
        clearable
        required
      />

      <h1 class="font-bold text-xs mt-2">PRECIO BASE:</h1>
      <div class="grid grid-cols-2 gap-2">
        <q-input
          v-model.number="text"
          type="text"
          label="Precio con factura"
          outlined
          dense
          clearable
          required
        />
        <q-input
          v-model.number="text"
          type="text"
          label="Precio sin factura"
          outlined
          dense
          clearable
          required
        />
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
            v-for="(precio, index) in estado.productoProveedor.precios"
            :key="index"
            class="[&>td]:border [&>td]:border-gray-400"
          >
            <td class="whitespace-nowrap text-center">{{ precio.cantidad }}</td>
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
  </Dialog2>

  <!-- CREAR MARCA -->
  <Dialog2
    v-model="estado.modal.esCrearMarca"
    title="Crear Marca"
    label-btn="Crear"
    :handle-submit="crearMarca"
  >
    <template #inputsDialog>
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">CREAR MARCA</h1>

      <div class="flex flex-col gap-2 mt-3">
        <q-input
          v-model="estado.marcaProducto.marca.nombre"
          type="text"
          label="Nombre marca"
          outlined
          dense
          clearable
          required
        />
      </div>
    </template>
  </Dialog2>

  <!-- CREAR MEDIDA -->
  <Dialog2
    v-model="estado.modal.esCrearMedida"
    title="Crear medida"
    label-btn="Crear"
    :handle-submit="crearMedida"
  >
    <template #inputsDialog>
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">CREAR MEDIDA</h1>

      <div class="flex flex-col gap-2 mt-3">
        <q-input
          v-model="estado.dataMedida.nombre"
          type="text"
          label="Nombre marca"
          outlined
          dense
          clearable
          required
        />
      </div>
    </template>
  </Dialog2>

  <!-- CREAR EMPAQUE -->
  <Dialog2
    v-model="estado.modal.esCrearEmpaque"
    title="Crear Empaque"
    label-btn="Crear"
    :handle-submit="crearEmpaque"
  >
    <template #inputsDialog>
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">CREAR EMPAQUE</h1>

      <div class="flex flex-col gap-2 mt-3">
        <q-input
          v-model="estado.dataEmpaque.nombre"
          type="text"
          label="Nombre empaque"
          outlined
          dense
          clearable
          required
        />
        <q-input
          v-model="estado.dataEmpaque.abreviacion"
          type="text"
          label="Abreviacion"
          outlined
          dense
          clearable
          required
        />
      </div>
    </template>
  </Dialog2>

  <!-- CREAR PROVEEDOR ENTIDAD -->
  <Dialog2
    v-model="estado.modal.esCrearProveedor"
    title="Crear proveedor"
    label-btn="Crear"
    :handle-submit="crearProveedor"
  >
    <template #inputsDialog>
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">
        CREAR PROVEEDOR
      </h1>

      <div class="flex flex-col gap-2 mt-3">
        <q-input
          v-model="estado.dataProveedor.nombre"
          type="text"
          label="Nombre proveedor"
          outlined
          dense
          clearable
          required
        />
        <q-input
          v-model="estado.dataProveedor.descripcion"
          type="text"
          label="Descripcion"
          outlined
          dense
          clearable
          required
        />
      </div>
    </template>
  </Dialog2>

  <!-- CREAR PROVEEDOR ENTIDAD -->
  <Dialog2
    v-model="estado.modal.esCrearPrecio"
    title="Agregar precio"
    label-btn="Crear"
    :handle-submit="agregarPrecio"
  >
    <template #inputsDialog>
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">AGREGAR PRECIO</h1>

      <div class="flex flex-col gap-2 mt-3">
        <q-input
          v-model.number="estado.dataPrecio.cantidad"
          type="text"
          label="Cantidad"
          outlined
          dense
          clearable
          required
        />
        <q-input
          v-model.number="estado.dataPrecio.precioConFactura"
          type="text"
          label="Precio con factura"
          outlined
          dense
          clearable
          required
        />
        <q-input
          v-model.number="estado.dataPrecio.precioSinFactura"
          type="text"
          label="Precio sin factura"
          outlined
          dense
          clearable
          required
        />
      </div>
    </template>
  </Dialog2>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useProducts } from '@/composables/sede/useProducts';
import { marcas, proveedores, empaques } from '~/helpers/columns';

const {
  tags,
  agregarProducto,
  editProductBasicInfo,
  estado,
  useProduct,
  modalAgregarPresentacion,
  agregarPresentacion,
  modalEditarPresentacion,
  modificarPresentacion,
  borrarPresentacion,
  getCategoria,
  imagen,
  imagePreview,
  selectedFile,
  producto,
  editarDatosBasicos,
  nombre,
  editarProductoBasico,
  buscarMarcas,
  crearMarca,
  imagenMarca,
  imagePreviewMarca,
  editarProductoMarca,
  getAllProductos,
  buscarMedidas,
  crearMedida,
  crearEmpaque,
  editarProductoMedidaEmpaque,
  buscarProveedores,
  crearProveedor,
  agregarPrecio,
} = useProducts();

definePageMeta({
  layout: 'cathering',
});

if (useProduct.producto) {
  producto.productoID = useProduct.producto._id;
  // Object.assign(producto.datosBasicos, useProduct.producto);
  producto.datosBasicos = useProduct.producto;
  imagePreview.value = useProduct.producto.imagen?.cloudinaryUrl;
}

const imageSrc = ref(
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8EgZkQGSD3pNxbv7Rh6RVWvXT2oDaZxf_bg&usqp=CAU',
);
const uploader = ref(null);

const pickFiles = () => {
  uploader.value.pickFiles();
};

const onAdded = (files) => {
  console.log(files);
  const reader = new FileReader();
  reader.onload = (e) => {
    console.log(reader);
    imageSrc.value = e.target.result;
  };
  reader.readAsDataURL(files[0]);
};

onMounted(() => {
  getCategoria();
  buscarMarcas();
  buscarMedidas();
  buscarProveedores();
  // getAllProductos();
});
</script>

<style scoped>
.q-tab {
  padding: 0 10px;
  margin-bottom: 0px;
  /* border: 2px solid red; */
}
</style>
