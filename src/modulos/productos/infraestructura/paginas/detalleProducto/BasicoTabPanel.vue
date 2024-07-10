<template>
  <div>
    <q-form @submit="modificarProductoBasico">
      <p>Entre los datos basicos del producto:</p>
      <!-- nombre -->
      <input-text
        label="Nombre"
        @update="(v) => (estado.datos_modificarProductoBasico.nombre = v)"
        info="Se debe modificar el nombre UNICAMENTE para corrigir su ortografia o mejorar su descriptividad, caso contrario toca crear un nuevo producto."
        :porDefecto="productoStore.producto.nombre"
        :rules="[useRules.requerido()]"
      />

      <!-- Categoria -->
      <input-select
        label="Categoria"
        info="La categoría existe solamente a fines de ubicar facilmente el producto en administracion. Para crear una nueva categoria, vaya al menu Logistica > Categorías."
        @update="(v) => (estado.datos_modificarProductoBasico.categoria = v)"
        :porDefecto="productoStore.producto.categoria._id"
        :rules="[useRules.requerido()]"
        :opciones="estado.categoriasParaSelect"
        :dialog="agregarCategoriaComp"
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
      />

      <!-- Comentario -->
      <input-text
        label="comentario"
        tipo="textarea"
        @update="(v) => (estado.datos_modificarProductoBasico.comentario = v)"
        :porDefecto="productoStore.producto.comentario"
        info="Agregue cualquier información adicional que sea útil registrar junto con el producto."
      />

      <q-btn color="primary" label="Guardar" type="submit" no-caps />
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { useDetalleBasico } from '@/modulos/productos/negocio/detalle/basico.composable';
import { useProducto } from '@/modulos/productos/negocio/producto.composable';
import { UrlToBase64Image } from '~/components/input/input.service';
import agregarCategoriaComp from '~/modulos/productos/infraestructura/selects/agregarCategoria.vue';
const router = useRouter();
const { estado, authStore, productoStore, modificarProductoBasico } =
  useDetalleBasico();
const { categoriaSelectOptions, actProductosDB } = useProducto();
const { $socket } = useNuxtApp();

// Verificacion de permisos
if (!authStore.checkPermisos(['ALMACEN', 'ADQUISICION', 'TODO'])) {
  console.log('No tiene el acceso para esta pagina');
}
const soloAlmacen = ref(authStore.checkPermisos(['ALMACEN']));
const soloAdquisicion = ref(authStore.checkPermisos(['ADQUISICION']));
const soloAlmacenAdquisicion = ref(
  authStore.checkPermisos(['ADQUISICION', 'ALMACEN']),
);

// inicializacion del formulario modif
for (const key in estado.datos_modificarProductoBasico) {
  estado.datos_modificarProductoBasico[key] =
    key === 'categoria'
      ? productoStore.producto[key]._id
      : productoStore.producto[key];
}

onMounted(async () => {
  // recuperamos las categorias
  estado.categoriasParaSelect = await categoriaSelectOptions(true);

  // recuperamos la imagen desde la url
  if (productoStore.producto.imagen?.cloudinaryUrl) {
    await UrlToBase64Image(
      productoStore.producto.imagen?.cloudinaryUrl,
      (base64Data) => {
        estado.modProductoBasicoImagen = base64Data;
      },
    );
  } else {
    estado.modProductoBasicoImagen = null;
  }

  // sockets
  $socket.on('cambiosProductos', async (data) => {
    await actProductosDB();
  });
});

onBeforeUnmount(() => {
  $socket.off('cambiosProductos');
});
</script>

<style lang="scss" scoped></style>
