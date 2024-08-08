<template>
  <q-form @submit="formSubmit">
    <!-- cantidad -->
    <input-text
      label="Cantidad en unidades básicas"
      info="Info #"
      :tipo="
        // por unidad
        props.producto.medida._id === '665f746dd6b07c8d26ef9b6d'
          ? 'number'
          : 'decimal'
      "
      @update="(v) => (dataForm.cantidad = v as number)"
      :porDefecto="dataForm.cantidad"
      requerido
    />
    <!-- vencimiento -->
    <input-text
      v-if="props.producto.puedeVencer"
      label="Fecha de vencimiento"
      info="Info #"
      @update="(v) => (dataForm.vencimiento = new Date(v))"
      :porDefecto="dataForm.vencimiento?.toString()"
    />
    <!-- Bloque -->
    <input-select
      label="Bloque"
      :opciones="selectBloque"
      info="Info #"
      :porDefecto="dataForm.bloque"
      @update="(v) => (dataForm.bloque = v)"
      requerido
    />
    <!-- Marca -->
    <input-select
      label="Marca"
      :opciones="selectMarca"
      info="Info #"
      :porDefecto="dataForm.marca"
      @update="(v) => (dataForm.marca = v)"
      requerido
    />
    <!-- guardar -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import type { Producto } from "#gql";
import { useAlmacen } from "~/modulos/almacen/almacen.composable";
const { store } = useAlmacen();

// tipado
export type Lote = {
  cantidad: number;
  vencimiento?: Date;
  bloque: string;
  marca: string;
  id?: string;
};

// definicion de los emits
const emits = defineEmits(["crearLote"]);

// definicion de los props
const props = withDefaults(
  defineProps<{
    producto: Producto;
    edicion?: Lote;
  }>(),
  {
    edicion: null,
  },
);

// definicion del estado
const dataForm = reactive<Lote>({
  cantidad: props.edicion?.cantidad,
  vencimiento: props.edicion?.vencimiento,
  bloque: props.edicion?.bloque,
  marca: props.edicion?.marca,
  id: props.edicion?.id ?? new Date().toString(),
});

// opciones para los select
const selectMarca = computed(() => {
  return props.producto.variedades.map((variedad) => {
    return {
      label: variedad.marca.nombre,
      value: variedad.marca._id,
    };
  });
});
const selectBloque = computed(() => {
  if (!store.entidad) return [];
  return store.entidad.bloques.map((bloque) => {
    return {
      label: bloque.nombre,
      value: bloque._id,
    };
  });
});

// Inicializaciones
onMounted(async () => {
  await store.getEntidad();
});

// submision del formulario
const formSubmit = async () => {
  try {
    emits("crearLote", dataForm);
  } catch (err) {
    errFallBack(err);
    return;
  }
};
</script>
