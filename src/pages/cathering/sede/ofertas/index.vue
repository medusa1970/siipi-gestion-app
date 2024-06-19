<template>
  <div>
    <Navigation label="Ofertas" icon="folder" />
    <h1 class="text-lg font-extrabold uppercase text-center">
      Gestion de ofertas
    </h1>
    <Table :rows="estado.ofertas" :columns="columnsOfertas" badge dense>
      <!-- AGREGAR -->
      <template #dropdown>
        <!-- <code>{{ estado.catalogos?.hijas }}</code> -->
        <q-select
          v-model="estado.catalogoSeleccionado"
          :options="estado.catalogos?.hijas"
          option-label="nombre"
          label="Selecciona un catalogo"
          style="width: 170px"
          dense
          filled
          color="black"
          bg-color="orange-5"
          @update:model-value="handleSelectionChange"
        />
        <q-btn
          icon-right="add"
          color="green"
          label="Crear oferta"
          no-caps
          style="padding: 7px 15px; margin-left: 10px"
          @click="estado.modal.esOfertaBasicas = true"
        />
        <!-- <NuxtLink href="ofertas/detailOferta" class="ml-3">
          <q-btn
            icon-right="add"
            color="green"
            label="Crear oferta"
            no-caps
            style="padding: 7px 15px"
            @click="abrirAgregarOferta"
          />
        </NuxtLink> -->
      </template>
      <!-- BADGE -->
      <template #rows-badge="{ props }">
        <q-tr :props="props">
          <!-- <q-td key="creado" :props="props">
            <h1 v-if="props.row._creado">
              {{ fechaMes(props.row._creado) }}
            </h1>
          </q-td> -->
          <q-td key="imagen" :props="props" class="">
            <q-img
              v-if="props.row.imagen"
              :src="props.row.imagen.cloudinaryUrl"
              spinner-color="black"
              class="cell-image"
              width="40px"
              height="40px"
            />
            <q-img
              v-else
              :src="Oferta"
              spinner-color="black"
              class="cell-image"
              width="40px"
              height="40px"
            />
          </q-td>
          <q-td key="modificado" :props="props">
            <h1 v-if="props.row._modificado == null" class="text-green-800">
              Nuevo
            </h1>
            <h1 v-else>
              {{ fechaMes(props.row._modificado) }}
            </h1>
          </q-td>
          <q-td key="nombre" :props="props">
            <h1 v-if="props.row.nombre" class="tooltip">
              {{
                props.row.nombre.length > 30
                  ? props.row.nombre.slice(0, 30) + '...'
                  : props.row.nombre
              }}
              <span
                class="tooltiptext shadow-lg text-blue-500 font-semibold bg-white px-4 py-1"
                >{{ props.row.nombre }}</span
              >
            </h1>
          </q-td>
          <q-td key="ingredientes" :props="props">
            <h1 v-if="props.row.ingredientes[0]">
              {{ props.row.ingredientes.length }}
            </h1>
            <h1 v-else class="text-red-500">Vacio</h1>
            <q-popup-edit
              v-model="props.row.ingredientes"
              anchor="bottom end"
              self="bottom end"
            >
              <h1 class="font-bold">INGREDIENTES:</h1>
              <div class="grid grid-cols-2 gap-3">
                <div
                  v-for="ingrediente in props.row.ingredientes"
                  :key="ingrediente.nombre"
                >
                  <div v-if="ingrediente._tipo === 'IngredienteProducto'">
                    <q-badge color="red" class="capitalize">
                      {{ ingrediente._tipo }} FIJO
                    </q-badge>
                    <h1>Producto: {{ ingrediente.producto.nombre }}</h1>
                    <h1>Cantidad: {{ ingrediente.cantidad }}</h1>
                  </div>
                </div>
              </div>
            </q-popup-edit>
          </q-td>
          <q-td key="catalogo" :props="props">
            <h1 v-if="props.row.catalogo && props.row.catalogo.nombre">
              {{ props.row.catalogo.nombre }}
            </h1>
          </q-td>
          <q-td key="precio" :props="props">
            {{ props.row.precio + ' Bs' }}
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              color="primary"
              icon="visibility"
              round
              dense
              padding="3px"
              size="9px"
              @click="estado.modal.esDetalleOferta = true"
            >
              <q-tooltip> Ver informacion producto </q-tooltip>
            </q-btn>

            <q-btn
              color="orange"
              icon="edit"
              round
              dense
              padding="3px"
              size="9px"
              @click="irEditarProducto(props.row)"
            >
              <q-tooltip> Editar producto </q-tooltip></q-btn
            >
            <!-- <q-btn
              color="red"
              icon="delete"
              dense
              flat
              round
              size="12px"
              padding="2px"
              @click="borrarOferta(props.row)"
            /> -->
          </q-td>
        </q-tr>
      </template>
    </Table>
  </div>

  <!-- OFERTA DATOS BASICOS -->
  <Dialog2
    v-model="estado.modal.esOfertaBasicas"
    title="Crear oferta"
    label-btn="Crear"
  >
    <template #inputsDialog>
      <!--h1 class="text-center bg-gray-300 font-bold py-[2px]">DATOS BASICOS</h1-->
      <p>
        <b>Por favor asegúrese que la oferta todavía no existe</b> ayudándose
        del buscador.
      </p>

      <!-- nombre -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Nombre *"
            v-model="text"
            class="w-full"
            type="text"
            filled
            required
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Por favor antes de crear un producto, asegúrese que no existe todavá. Ayúdese del buscador de la tabla."
          />
        </div>
      </div>

      <!-- abreviacion -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Abreviacion *"
            v-model="text"
            class="w-full"
            type="text"
            filled
            required
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Por favor antes de crear un producto, asegúrese que no existe todavá. Ayúdese del buscador de la tabla."
          />
        </div>
      </div>

      <!-- Categoria -->
      <!-- <code>{{ estado.catalogoSeleccionado.hijas }}</code> -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-select
            label="Categoria *"
            v-model="text"
            :options="estado.optionsCategoria"
            class="w-full"
            map-options
            dense
            filled
            required
          >
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
                :class="scope.opt.class"
              >
                <q-item-section>{{ scope.opt.label }}</q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div>
          <BotonDetalle
            mensaje="La categoría existe solamente a fines de ubicar facilmente el producto en administracion. Para crear una nueva categoria, vaya al menu Logistica > Categorías."
          />
        </div>
      </div>

      <!-- Imagen -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <q-img
          style="width: 150px; height: 150px; object-fit: cover"
          v-if="imagePreview"
          :src="imagePreview"
        ></q-img>
        <div style="flex-grow: 1">
          <q-file
            class="w-full"
            v-model="imagen"
            label="Imagen *"
            accept=".jpg, .png, .jpge"
            max-total-size="560000"
            @rejected="onRejected"
            counter
            filled
            hint="Tamaño máximo de imagen 540KB"
            clearable
            dense
            required
          >
            <template v-slot:prepend>
              <q-icon name="photo_camera" @click.stop.prevent />
            </template>
          </q-file>
        </div>
        <div>
          <BotonDetalle
            mensaje="Por favor elija una foto del producto solo, que se distinga claramente ante un fondo claro y unido. Prefiera un formato cuadrado."
          />
        </div>
      </div>

      <!-- Comentario -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-input
            class="w-full"
            v-model="text"
            type="textarea"
            label="Comentario"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Agregue cualquier información adicional que sea útil registrar junto con el producto."
          />
        </div>
      </div>
    </template>
    <!-- <template #inputsDialog>
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">
        DATOS GENERALES
      </h1>

      <q-file
        v-model="imagen"
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
        v-if="imagePreview"
        style="width: 200px; height: 200px; margin: auto"
      >
        <q-img
          style="width: 100%; height: 100%; object-fit: cover"
          :src="imagePreview"
        ></q-img>
      </div>
      <q-input
        v-model="text"
        type="text"
        label="Nombre*"
        outlined
        dense
        clearable
        required
      />
      <q-input
        v-model="text"
        type="text"
        label="Abreviacion*"
        outlined
        dense
        clearable
        required
      />
      <q-select
        class="col-span-3"
        v-model="estado.oferta.catalogo"
        :options="estado.catalogos.hijas"
        label="Seleccionar catalogo"
        option-label="nombre"
        style="width: 100%; flex: 1 0 auto"
        outlined
        onfocus="this.select()"
        use-input
        hide-selected
        fill-input
        dense
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="bi-cart-plus" />
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No hay resultados
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <div class="select-container">
        <select
          id="two-level-select"
          class="border border-gray-400 rounded-[4px] shadow-sm text-base block w-full py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="" disabled selected>Selecciona una categoria</option>
          <optgroup
            v-for="categoria in estado.oferta.catalogo.hijas"
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
    </template> -->
  </Dialog2>

  <!-- OFERTA DATOS BASICOS -->
  <Dialog2
    v-model="estado.modal.esOfertaProductos"
    title="Crear oferta"
    label-btn="Crear"
  >
    <template #inputsDialog>
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">PRODUCTOS</h1>
      <!-- SECCIONES -->
      <q-input
        v-model="text"
        type="text"
        label="Precio"
        no-caps
        dense
        outlined
      />
      <q-btn
        color="orange-7"
        icon="add"
        label="Agregar producto"
        dense
        no-caps
        padding="2px 10px"
      />

      <div
        class="mt-2 border border-gray-400 rounded-md px-3 py-2 grid grid-cols-[1fr_auto]"
      >
        <section>
          <h1>Producto: Vasos 300ml</h1>
          <h1>Marca: BELEN</h1>
          <h1>Imagen: vaso-belen.png</h1>
          <h1>Cantidad: 300</h1>
        </section>
        <section class="flex flex-col justify-center items-center">
          <q-btn color="primary" icon="edit" flat rounded dense size="12px" />
          <q-btn color="red" icon="delete" flat rounded dense size="13px" />
        </section>
      </div>
    </template>
  </Dialog2>

  <!-- PRODUCTO OFERTA -->
  <Dialog2
    v-model="estado.modal.esDetalleOferta"
    title="Detalle oferta"
    no-btn=""
  >
    <template #inputsDialog>
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">
        DETALLE DE OFERTA
      </h1>
      <h1>MORINGA</h1>
      <h1>moringa siipi</h1>
    </template>
  </Dialog2>
</template>

<script setup>
definePageMeta({
  layout: 'cathering',
});
import { columnsOfertas } from '@/helpers/columns';
import { useOferta } from '@/composables/marca/useOferta';
import { onMounted, ref } from 'vue';
import { fechaMes } from '@/helpers/fecha';
// import {} from "@/as"
import Oferta from '@/assets/img/oferta.png';

const {
  estado,
  storeOferta,
  abrirEditarOferta,
  abrirAgregarOferta,
  borrarOferta,
  obtenerTodasOfertas,
  obtenerTodosProductos,
  obtenerTodoCatalagosIdNombre,
  handleSelectionChange,
  obtenerTodoCatalagos,
  mapeoCatalogos,
  irEditarProducto,
} = useOferta();

onMounted(() => {
  // obtenerTodasOfertas();
  // obtenerTodoCatalagosIdNombre();
  obtenerTodoCatalagos();
  mapeoCatalogos();
  // for (const cat of estado.catalogoSeleccionado.hijas) {
  //   optionsCategoria.value.push({
  //     label: `${cat.nombre} (${cat.hijas.length})`,
  //     value: cat._id,
  //     disable: true,
  //     class: 'title',
  //   });
  //   for (const subcat of cat.hijas) {
  //     optionsCategoria.value.push({
  //       label: subcat.nombre,
  //       value: subcat,
  //       class: 'option',
  //     });
  //   }
  // }
});
</script>
<style scoped>
/* Estilo base del checkbox */
.weekday {
  display: none !important;
}
input[type='checkbox'] + label {
  display: inline-block;
  border-radius: 50%;
  background: #dddddd;
  height: 37px;
  width: 37px;
  line-height: 37px;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
}
input[type='checkbox']:checked + label {
  background: #007bff;
  color: #ffffff;
}
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  text-align: center;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap; /* Prevent text from wrapping onto new lines */
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>
