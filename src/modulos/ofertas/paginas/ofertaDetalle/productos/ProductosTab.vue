<template>
  <q-form @submit.prevent="submitForm">
    <!-- Producto -->
    <input-select
      label="Producto"
      @update="(v) => (estado.dataForm.producto = v as string)"
      :porDefecto="estado.dataForm.producto"
      requerido
      :opciones="estado.productosOpciones"
      info="Info #53" />

    <!-- {{ estado.dataForm.marca ?? 0 }} -->
    <!-- Producto marca -->
    <input-select
      label="Marca"
      @update="(v) => (estado.dataForm.marca = v as string)"
      :porDefecto="estado.dataForm.marca"
      :watch="estado.dataForm.marca"
      requerido
      :opciones="selectVariedad"
      info="Info #54" />

    <!-- autcompletado tipo empaque -->
    <input-select
      label="Empaque preseleccionado"
      class="flex-grow"
      style="margin-right: 16px"
      info="Info #48"
      :opciones="selectEmpaque"
      @update="v => prellenarEmpaque(v)"
      :watch="estado.resetEmpaque"
      color="grey-6" />

    <!-- cantidad -->
    <input-text
      label="Cantidad"
      tipo="number"
      @update="(v) => (estado.dataForm.cantidad = v as number)"
      :porDefecto="estado.dataForm.cantidad"
      :watch="estado.dataForm.cantidad"
      requerido
      info="Info #55" />
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
    producto: store.oferta?.ingredientes[0]?.producto?._id,
    marca: store.oferta?.ingredientes[0]?.marca?._id,
    cantidad: store.oferta?.ingredientes[0]?.cantidad
  };
  // const { producto, marca, cantidad } = store.oferta.ingredientes[0];
  // Object.assign(estado.dataForm, { producto, marca, cantidad });
}

const producto = computed(() => {
  if (!almacen.store.productos) return null;
  return almacen.store.productos.find(p => {
    return p._id === estado.dataForm.producto;
  });
});

const selectVariedad = computed(() => {
  if (!producto.value?.variedades) return [];
  return producto.value.variedades.map(variedad => ({
    value: variedad.marca._id,
    label: variedad.marca.nombre
  }));
});
watch(
  () => estado.dataForm.producto,
  () => {
    if (!estado.dataForm.producto) {
      estado.dataForm.marca = null;
    }
  }
);

// Prellenar el empaque con seleccionar un tipo de empaque
const prellenarEmpaque = async empaque => {
  console.log(empaque);
  const emp = producto.value?.empaques.find(e => e._id === empaque);
  if (!emp) return;
  //
  estado.dataForm.cantidad = emp.cantidad;
  console.log('CANTIDAD', estado.dataForm.cantidad);
  estado.resetEmpaque = empaque;
  estado.nombreEmpaque = emp.nombre;
  await setTimeout(() => {
    estado.resetEmpaque = null;
  }, 1500);
};

const selectEmpaque = computed(() => {
  if (!estado.dataForm.marca || !producto.value?.empaques) return [];
  return producto.value.empaques
    .filter(empaque => empaque.marca._id === estado.dataForm.marca)
    .map(empaque => ({
      value: empaque._id,
      label: empaque.nombre
    }));
});

onMounted(async () => {
  const productos = await almacen.store.getProductos();
  estado.productosOpciones = productos
    // .filter((p) => !almacen.productoIncompleto(p))
    .map(p => {
      return {
        value: p._id,
        label: p.nombre
      };
    });
});
</script>

<style lang="scss" scoped></style>
