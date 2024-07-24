<template>
  <q-form @submit.prevent="modificarOfertaProducto">
    <p>Entre los datos del producto en la oferta:</p>

    <!-- Producto -->
    <input-select
      label="Producto"
      @update="(v) => (estado.datos_productoDeOferta.producto = v)"
      :porDefecto="estado.datos_productoDeOferta.producto?.nombre"
      :rules="[useRules.requerido()]"
      :opciones="estado.productosOpciones"
      info="Seleccione el producto que se ofertara."
    />

    <!-- Producto marca -->
    <input-select
      label="Marca"
      @update="(v) => (estado.datos_productoDeOferta.marca = v)"
      :porDefecto="estado.datos_productoDeOferta.marca?.nombre"
      :rules="[useRules.requerido()]"
      :opciones="
        estado.datos_productoDeOferta.producto?.variedades?.map((variedad) => ({
          label: variedad.marca.nombre || 'Nombre no disponible',
          value: { _id: variedad.marca._id, nombre: variedad.marca.nombre },
          class: 'option',
        })) || []
      "
      info="Seleccione la marca del producto que se ofrecera."
    />

    <!-- cantidad -->
    <input-text
      label="Cantidad"
      tipo="number"
      @update="(v) => (estado.datos_productoDeOferta.cantidad = v as number)"
      :porDefecto="estado.datos_productoDeOferta.cantidad"
      :rules="[useRules.requerido()]"
      info="Ingrese la cantidad de producto que se ofertara."
    />
    <q-btn color="primary" label="Guardar" type="submit" no-caps />
  </q-form>
</template>

<script setup lang="ts">
import { useProductoTab } from './productosTab.composable';
import { storeAlmacen } from '@/modulos/almacen/almacen.store';

const { estado, store, productoSelectOptions, modificarOfertaProducto } =
  useProductoTab();
const productoStore = storeAlmacen();

if (store.oferta) {
  estado.datos_productoDeOferta = {
    producto: store.oferta?.ingredientes[0]?.producto,
    marca: store.oferta?.ingredientes[0]?.marca,
    cantidad: store.oferta?.ingredientes[0]?.cantidad,
  };
  // const { producto, marca, cantidad } = store.oferta.ingredientes[0];
  // Object.assign(estado.datos_productoDeOferta, { producto, marca, cantidad });
}

onMounted(async () => {
  estado.productos = await productoStore.getProductos();
  estado.productosOpciones = productoSelectOptions();
});
</script>

<style lang="scss" scoped></style>
~/modulos/ofertas/paginas/ofertas/ofertas.composable
