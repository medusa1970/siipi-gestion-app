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
      <q-form @submit="modificarProductoBasico">
        <p>Entre los datos basicos del producto:</p>
        <!-- nombre -->
        <input-text
          label="Nombre"
          @update="(v) => (estado.datos_modificarProductoBasico.nombre = v)"
          info="Se debe modificar el nombre UNICAMENTE para corrigir su ortografia o mejorar su descriptividad, caso contrario toca crear un nuevo producto."
          :porDefecto="estado.datos_modificarProductoBasico.nombre"
          :rules="[useRules.requerido()]"
        />

        <!-- Categoria -->
        <input-select
          label="Categoria"
          @update="
            (v) => {
              estado.datos_modificarProductoBasico.categoria = v;
              console.log(v);
            }
          "
          :porDefecto="estado.datos_modificarProductoBasico.categoria"
          :rules="[useRules.requerido()]"
          :opciones="estadoProducto.categoriaOptions"
        />

        <!-- Imagen -->
        <input-image
          label="Imagen"
          @update="
            (base64Data, mimetype) =>
              (estado.datos_modificarProductoBasico.imagen = base64Data
                ? { data: base64Data, mimetype: mimetype }
                : null)
          "
          :key="estado.modProductoBasicoImagen"
          :dataPreview="estado.modProductoBasicoImagen"
          info="Por favor elija una foto del producto solo, que se distinga claramente ante un fondo claro y unido. Prefiera un formato cuadrado."
          icono="photo_camera"
          :rules="[]"
        />

        <!-- Comentario -->
        <input-text
          tipo="textarea"
          label="comentario"
          info="Agregue cualquier información adicional que sea útil registrar junto con el producto."
          :porDefecto="estado.datos_modificarProductoBasico.comentario"
          @update="(v) => (estado.datos_modificarProductoBasico.comentario = v)"
        />

        <q-btn color="primary" label="Guardar" type="submit" no-caps />
      </q-form>
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
import { UrlToBase64Image } from '~/components/input/input.service';

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
  if (estado.datos_modificarProductoBasico.categoria) {
    estado.datos_modificarProductoBasico.categoria =
      estado.datos_modificarProductoBasico.categoria;
  }
}

const { $socket } = useNuxtApp();
onMounted(async () => {
  // recuperamos las categorias
  estadoProducto.categoriaOptions = await categoriaSelectOptions(true);

  // recuperamos la imagen desde la url
  await UrlToBase64Image(
    productoStore.producto.imagen?.cloudinaryUrl,
    (base64Data) => {
      estado.modProductoBasicoImagen = base64Data;
    },
  );

  // sockets
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
