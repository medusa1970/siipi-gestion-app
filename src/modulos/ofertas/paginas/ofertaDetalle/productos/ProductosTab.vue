<template>
  <q-form @submit.prevent="submitForm">
    <p>Entre los datos del producto en la oferta:</p>

    <!-- Producto -->
    <input-select
      label="Producto"
      @update="(v) => (estado.dataForm.producto = v as string)"
      :porDefecto="estado.dataForm.producto?.nombre"
      :rules="[useRules.requerido()]"
      :opciones="estado.productosOpciones"
      info="Seleccione el producto que se ofertara."
    />

    <!-- Producto marca -->
    <input-select
      label="Marca"
      @update="(v) => (estado.dataForm.marca = v as string)"
      :porDefecto="estado.dataForm.marca"
      :watch="estado.dataForm.marca"
      :rules="[useRules.requerido()]"
      :opciones="selectVariedad"
      info="Seleccione la marca del producto que se ofrecera."
    />

    <!-- cantidad -->
    <input-text
      label="Cantidad"
      tipo="number"
      @update="(v) => (estado.dataForm.cantidad = v as number)"
      :porDefecto="estado.dataForm.cantidad"
      :rules="[useRules.requerido()]"
      info="Ingrese la cantidad de producto que se ofertara."
    />
    <q-btn color="primary" label="Guardar" type="submit" no-caps />
  </q-form>
</template>

<script setup lang="ts">
import { useAlmacen } from '@/modulos/almacen/almacen.composable';
const almacen = useAlmacen();
import { useProductoTab } from './productosTab.composable';
const { estado, store, submitForm } = useProductoTab();

if (store.oferta) {
  estado.dataForm = {
    producto: store.oferta?.ingredientes[0]?.producto,
    marca: store.oferta?.ingredientes[0]?.marca,
    cantidad: store.oferta?.ingredientes[0]?.cantidad,
  };
  // const { producto, marca, cantidad } = store.oferta.ingredientes[0];
  // Object.assign(estado.dataForm, { producto, marca, cantidad });
}

const producto = computed(() => {
  if (!almacen.store.productos) return null;
  return almacen.store.productos.find((p) => {
    return p._id === estado.dataForm.producto;
  });
});

const selectVariedad = computed(() => {
  if (!producto.value?.variedades) return [];
  return producto.value.variedades.map((variedad) => ({
    value: variedad.marca._id,
    label: variedad.marca.nombre,
  }));
});
watch(producto, () => {
  if (!producto) {
    estado.dataForm.marca = null;
  }
});

onMounted(async () => {
  const productos = await almacen.store.getProductos();
  estado.productosOpciones = productos
    // .filter((p) => !almacen.productoIncompleto(p))
    .map((p) => {
      return {
        value: p._id,
        label: p.nombre,
      };
    });
});
</script>

<style lang="scss" scoped></style>
