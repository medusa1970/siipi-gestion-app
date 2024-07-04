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
    />

    <!-- cantidad -->
    <input-text
      label="Cantidad"
      @update="(v) => (estado.datos_productoDeOferta.cantidad = Number(v))"
      info="Se debe modificar el nombre UNICAMENTE para corrigir su ortografia o mejorar su descriptividad, caso contrario toca crear un nuevo producto."
      :porDefecto="estado.datos_productoDeOferta.cantidad"
      :rules="[useRules.requerido(), useRules.numero()]"
    />
    <q-btn color="primary" label="Guardar" type="submit" no-caps />
  </q-form>
</template>

<script setup>
import { useProductoTab } from '@/modulos/ofertas/negocio/productosTab.composable';

const {
  estado,
  traerProductos,
  productoSelectOptions,
  modificarOfertaProducto,
  ofertaStore,
} = useProductoTab();

if (ofertaStore.oferta) {
  estado.datos_productoDeOferta = {
    producto: ofertaStore.oferta.ingredientes[0].producto,
    marca: ofertaStore.oferta.ingredientes[0].marca,
    cantidad: ofertaStore.oferta.ingredientes[0].cantidad,
  };
  // const { producto, marca, cantidad } = ofertaStore.oferta.ingredientes[0];
  // Object.assign(estado.datos_productoDeOferta, { producto, marca, cantidad });
}

onMounted(async () => {
  await traerProductos();
  estado.productosOpciones = productoSelectOptions();
});
</script>

<style lang="scss" scoped></style>
