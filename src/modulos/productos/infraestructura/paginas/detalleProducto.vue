<template>
  <Navigation
    label="Productos"
    icon="list_alt"
    :label2="productoStore.producto.nombre"
    href="/cathering/productos"
  />

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
    <q-tab name="datosBasicos" icon="storefront" label="Datos basicos" />
    <q-tab v-if="soloAlmacen" name="marcas" icon="group" label="Marcas" />
    <q-tab
      v-if="soloAlmacenAdquisicion"
      name="medidas"
      icon="folder_copy"
      label="Medidas & Empaques"
    />
    <q-tab
      v-if="soloAdquisicion"
      name="proveedores"
      icon="query_stats"
      label="Proveedores"
    />
    <q-tab name="acciones" icon="delete" label="Borrar" />
  </q-tabs>

  <q-tab-panels
    v-model="estado.tab"
    animated
    style="height: calc(100vh - 115px)"
  >
    <!-- 
    DATOS BASICOS 
  -->

    <q-tab-panel name="datosBasicos" animated>
      <p>Entre los datos basicos del producto:</p>
      <!-- nombre -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Nombre *"
            required
            v-model="estado.datos_modificarProductoBasico.nombre"
            type="text"
            class="w-full"
            filled
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Se debe modificar el nombre UNICAMENTE para corrigir su ortografia o mejorar su descriptividad, caso contrario toca crear un nuevo producto."
          />
        </div>
      </div>

      <!-- Categoria -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-select
            label="Categoria*"
            required
            v-model="estado.datos_modificarProductoBasico.categoria"
            :options="estadoProducto.categoriaOptions"
            option-label="nombre"
            filled
            options-cover
            id="two-level-select"
            class="w-full"
            map-options
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
      <div>
        <input-image
          label="Imagen"
          info="Por favor elija una foto del producto solo, que se distinga claramente ante un fondo claro y unido. Prefiera un formato cuadrado."
          @update="
            (v) =>
              (estado.datos_modificarProductoBasico.imagen = {
                data: v,
                mimetype: 'image/png',
              })
          "
          icono="photo_camera"
        />
      </div>

      <!-- Comentario -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-input
            class="w-full"
            v-model="estado.datos_modificarProductoBasico.comentario"
            type="textarea"
            label="Comentario"
            filled
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Agregue cualquier información adicional que sea útil registrar junto con el producto."
          />
        </div>
      </div>

      <!--div class="flex gap-4 justify-center">
        <q-btn
          color="secondary"
          label="Cancelar"
          no-caps
          @click="cancelarEdicionProductoBasico"
        /-->
      <q-btn
        color="primary"
        label="Guardar"
        no-caps
        @click="modificarProductoBasico"
      />
    </q-tab-panel>

    <!-- 
    MARCAS 
  -->
    <q-tab-panel name="marcas" animated>
      <MarcaTabPanel />
    </q-tab-panel>

    <!-- 
    MEDIDAS 
  -->

    <q-tab-panel name="medidas" animated>
      <MedidaTabPanel />
    </q-tab-panel>

    <!-- 
    PROVEEDORES 
  -->

    <q-tab-panel name="proveedores" animated>
      <ProveedorTabPanel />
    </q-tab-panel>

    <!-- 
    ACCIONES BORRAR 
  -->

    <q-tab-panel name="acciones" animated>
      <p>Indica el motivo por cual desea borrar este producto:</p>

      <!-- Comentario -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-input
            class="w-full"
            v-model="estado.motivoEliminacion"
            type="textarea"
            label="Motivo"
            filled
          />
        </div>
        <div>
          <BotonDetalle mensaje="Se avisará el jefe de logistica." />
        </div>
      </div>
      <q-btn
        color="primary"
        label="Confirmar"
        :disable="estado.motivoEliminacion === ''"
        no-caps
        @click="borrarProducto()"
      />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useProductoDetalle } from '@/modulos/productos/negocio/productoDetalle.composable';
import { useProducto } from '@/modulos/productos/negocio/producto.composable';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';
import MarcaTabPanel from '@/modulos/productos/infraestructura/componente/MarcaTabPanel.vue';
import MedidaTabPanel from '@/modulos/productos/infraestructura/componente/MedidaTabPanel.vue';
import ProveedorTabPanel from '@/modulos/productos/infraestructura/componente/ProveedorTabPanel.vue';

// Verificacion de permisos
const authStore = useAuthStore();
if (!authStore.checkPermisos(['ALMACEN', 'ADQUISICION', 'TODO'])) {
  console.log('No tiene el acceso para esta pagina');
}

const soloAlmacen = ref(authStore.checkPermisos(['ALMACEN']));
const soloAdquisicion = ref(authStore.checkPermisos(['ADQUISICION']));
const soloAlmacenAdquisicion = ref(
  authStore.checkPermisos(['ADQUISICION', 'ALMACEN']),
);

definePageMeta({
  layout: 'cathering',
});

const { estado, modificarProductoBasico, productoStore, borrarProducto } =
  useProductoDetalle();
const {
  estado: estadoProducto,
  categoriaSelectOptions,
  actProductosDB,
} = useProducto();

const options = ref([]);
const showTable = ref(false); //estado.medidaProducto.medida;

// const fnGuardarMedidaBasica = () => {
//   guardarMedidaBasica();
//   showTable.value = true;
// };

if (productoStore.producto) {
  // @ts-expect-error
  estado.datos_modificarProductoBasico = productoStore.producto;
  console.log(estado.datos_modificarProductoBasico);
  // estado.datos_productoMedida.medida = productoStore.producto.medida;
  // console.log(estado.datos_productoMedida.medida);
  // imagePreview.value = useProducto.producto.imagen?.cloudinaryUrl;
  // console.log(estado.datos_modificarProductoBasico);
}

const { $socket } = useNuxtApp();
onMounted(async () => {
  // await getCategoria();

  // estadoProducto.categoriaOptions = await categoriaSelectOptions();

  // buscarMarcas();
  // buscarMedidas();
  // buscarProveedores();
  // buscarProveedoresProducto();

  // estadoInicial.datosBasicos.nombre = estado.datos_modificarProductoBasico.nombre;
  // estadoInicial.datosBasicos.categoria = estado.datos_modificarProductoBasico.categoria;
  // estadoInicial.datosBasicos.comentario = estado.datos_modificarProductoBasico.comentario;
  $socket.on('cambiosProductos', async (data) => {
    console.log('first');
    await actProductosDB();
  });
});

onBeforeUnmount(() => {
  $socket.off('cambiosProductos');
});
</script>

<style scoped>
.q-tab {
  padding: 0 10px;
  margin-bottom: 0px;
  /* border: 2px solid red; */
}
</style>
