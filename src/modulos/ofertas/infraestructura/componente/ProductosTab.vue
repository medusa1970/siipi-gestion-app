<template>
  <q-form @submit.prevent="modificarOfertaProducto">
    <p>Entre los datos del producto en la oferta:</p>

    <!-- Producto -->
    <input-select
      label="Producto"
      @update="
        (v) => {
          estado.datos_productoDeOferta.producto = v;
        }
      "
      :porDefecto="estado.datos_productoDeOferta.producto?.nombre"
      :rules="[useRules.requerido()]"
      :opciones="estado.productosOpciones"
      info="Seleccione el producto que se ofertara."
    />

    <!-- Producto marca -->
    <input-select
      label="Marca"
      @update="
        (v) => {
          estado.datos_productoDeOferta.marca = v;
        }
      "
      :porDefecto="estado.datos_productoDeOferta.marca?.nombre"
      :rules="[useRules.requerido()]"
      :opciones="
        estado.datos_productoDeOferta.producto?.variedades?.map((variedad) => ({
          label: variedad.marca.nombre || 'Nombre no disponible',
          value: { _id: variedad.marca._id, nombre: variedad.marca.nombre },
          class: 'option',
        })) || []
      "
      info="Seleccione la marca del producto que se ofertara."
    />

    <!-- cantidad -->
    <input-text
      label="Cantidad"
      @update="(v) => (estado.datos_productoDeOferta.cantidad = Number(v))"
      :porDefecto="estado.datos_productoDeOferta.cantidad"
      :rules="[useRules.requerido(), useRules.numero()]"
      info="Ingrese la cantidad de producto que se ofertara."
    />
    <q-btn color="primary" label="Guardar" type="submit" no-caps />
  </q-form>
</template>

<script setup lang="ts">
import { useProductoTab } from '@/modulos/ofertas/negocio/productosTab.composable';
import { useOferta } from '@/modulos/ofertas/negocio/oferta.composable';

const { estado, productoSelectOptions, modificarOfertaProducto, ofertaStore } =
  useProductoTab();
const { actOfertasDB } = useOferta();
const { $socket } = useNuxtApp();
import { storeProducto } from '@/modulos/productos/negocio/producto.store';
const productoStore = storeProducto();

if (ofertaStore.oferta) {
  estado.datos_productoDeOferta = {
    //@ts-expect-error
    producto: ofertaStore.oferta?.ingredientes[0]?.producto,
    marca: ofertaStore.oferta?.ingredientes[0]?.marca,
    cantidad: ofertaStore.oferta?.ingredientes[0]?.cantidad,
  };
  // const { producto, marca, cantidad } = ofertaStore.oferta.ingredientes[0];
  // Object.assign(estado.datos_productoDeOferta, { producto, marca, cantidad });
}

onMounted(async () => {
  estado.productos = await productoStore.getProductos();
  estado.productosOpciones = productoSelectOptions();

  $socket.on('cambiosOfertas', async (data) => {
    console.log('first');
    await actOfertasDB();
  });
});
onBeforeUnmount(() => {
  $socket.off('cambiosOfertas');
});
</script>

<style lang="scss" scoped></style>
