<template>
  <q-form @submit="formSubmit">
    <!-- Produit -->
    <input-select2
      label="Producto"
      info="Info."
      :opciones="estado.productoOpciones"
      :porDefecto="estado.dataForm.producto"
      @update="(v) => (estado.dataForm.producto = v)"
      :rules="[useRules.requerido()]"
    />

    <!-- Marca -->
    <input-select2
      label="Marca"
      info="Info."
      :opciones="estado.variedadOpciones"
      :porDefecto="estado.dataForm.marca"
      @update="(v) => (estado.dataForm.marca = v)"
      :watch="estado.dataForm.marca"
      :rules="[useRules.requerido()]"
    />

    <p></p>
    <div class="flex">
      <input-select2
        style="width: 40%"
        label="Empaque preseleccionado"
        :opciones="estado.empaqueOpciones"
        @update="(v) => prellenarEmpaque(v)"
        :watch="estado.resetEmpaque"
      />
      <input-text2
        style="width: 50%"
        label="Cantidad"
        info="Si desea elija un empaque, o sino entre directamente a la cantidad."
        :porDefecto="estado.dataForm.cantidad"
        @update="(v) => (estado.dataForm.cantidad = Number(v))"
        :watch="estado.dataForm.cantidad"
        :rules="[useRules.requerido(), useRules.numero()]"
      />
    </div>

    <!-- nombre -->
    <input-text2
      label="Nombre"
      info="Info."
      :porDefecto="estado.dataForm.nombre"
      @update="(v) => (estado.dataForm.nombre = v)"
      :rules="[useRules.requerido()]"
      :error="estado.errorNombre"
      :watch="estado.dataForm.nombre"
    />

    <!-- abreviacion -->
    <input-text2
      label="Abreviacion"
      info="Info."
      :porDefecto="estado.dataForm.abreviacion"
      @update="(v) => (estado.dataForm.abreviacion = v)"
      :rules="[useRules.requerido()]"
      :watch="estado.dataForm.abreviacion"
      :error="estado.errorAbreviacion"
    />

    <!-- Catalogo -->
    <input-select2
      label="Catalogo"
      info="Info."
      :opciones="estado.catalogoOpciones"
      :porDefecto="estado.dataForm.catalogo"
      @update="(v) => (estado.dataForm.catalogo = v)"
      :rules="[useRules.requerido()]"
    />

    <!-- Imagen -->
    <input-image2
      label="Imagen"
      info="Info."
      @update="
        (base64Data, mimetype) =>
          (estado.dataForm.imagen = base64Data
            ? { data: base64Data, mimetype: mimetype }
            : null)
      "
      icono="photo_camera"
    />

    <!-- Precios -->
    <input-text2
      label="Precio con factura"
      info="Info."
      :porDefecto="estado.dataForm.precioConFactura"
      @update="(v) => (estado.dataForm.precioConFactura = Number(v))"
      :rules="[useRules.numero()]"
    />
    <input-text2
      label="precio sin factura"
      info="Info."
      :porDefecto="estado.dataForm.precioSinFactura"
      @update="(v) => (estado.dataForm.precioSinFactura = Number(v))"
      :rules="[useRules.numero()]"
    />

    <!-- Submit -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import type { Oferta } from '#gql';
import { useAlmacen } from '~/modulos2/almacen/almacen.composable';
import { ofertaAbreviacion } from '../utils/oferta-utils';
const { store } = useAlmacen();

// definicion de los emits
const emits = defineEmits(['crearObjeto', 'modificarObjeto']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    config?: { productoId?: string };
  }>(),
  {},
);

// datos por defecto del formulario
const initForm = {
  producto: props.config.productoId ?? '',
  marca: '',
  cantidad: '',
  nombre: '',
  abreviacion: '',
  precioConFactura: '',
  precioSinFactura: '',
  imagen: '',
};

// definicion del estado
const estado = reactive({
  // valor de los inputs
  dataForm: clone(initForm),
  //mensajes de error del formulario
  errorNombre: '',
  errorAbreviacion: '',
  // producto seleccionado
  producto: null,
  // opciones para seleccion
  productoOpciones: [],
  catalogoOpciones: [],
  variedadOpciones: [],
  empaqueOpciones: [],
  // para el empaque
  resetEmpaque: '',
  // nombre de la oferta para constuirla dinamicamente
  nombreOfertaPartes: {
    producto: '',
    marca: '',
    empaque: '',
    empaqueAbreviacion: '',
    cantidad: '',
  },
});

// Inicializaciones
onMounted(async () => {
  estado.productoOpciones = store.productos.map((p) => {
    return {
      value: p._id,
      label: p.nombre,
    };
  });
  const arbol = await store.getCatalogoArbol();
  estado.catalogoOpciones = arbol.hijas.map((c) => {
    return {
      value: c._id,
      label: c.nombre,
    };
  });
});

// ponemos al dia la lista de variedades cuando cambia el producto en el select
watch(
  () => estado.dataForm.producto,
  () => {
    // producto
    estado.producto = store.productos.find((p) => {
      return p._id === estado.dataForm.producto;
    });
    if (!estado.producto) {
      return;
    }
    estado.nombreOfertaPartes.producto = estado.producto.nombre;
    // marca
    estado.variedadOpciones = estado.producto.variedades.map((variedad) => ({
      value: variedad.marca._id,
      label: variedad.marca.nombre,
    }));
    estado.dataForm.marca = null;
  },
  { immediate: true },
);

watch(
  () => estado.dataForm.marca,
  () => {
    // si se reinicializo la marca, reinicializemos tambien el empaque
    if (estado.dataForm.marca === null) {
      estado.dataForm.empaque = null;
      return;
    }
    // recuperamos el nombre de la marca
    // HACK en vez de llamar la base de datos leemos directamente en las opciones
    estado.nombreOfertaPartes.marca = estado.variedadOpciones.find(
      (opcion) => opcion.value === estado.dataForm.marca,
    ).label;
    // recuperamos los nuevos empaques del producto con esta marca...
    const empaques = estado.producto.empaques.filter(
      (empaque) => empaque.marca._id === estado.dataForm.marca,
    );
    // ... y lo transformamos en opcionSelect
    estado.empaqueOpciones = empaques.map((empaque) => {
      return {
        value: empaque,
        label: empaque.nombre,
      };
    });
  },
  { immediate: true },
);

watch(
  () => estado.dataForm.cantidad,
  () => {
    estado.nombreOfertaPartes.cantidad = estado.dataForm.cantidad;
  },
  { immediate: true },
);

watch(
  () => estado.dataForm.nombre,
  () => {
    estado.dataForm.abreviacion = ofertaAbreviacion(estado.dataForm.nombre);
  },
  { immediate: true },
);

// constuccion dinmica del nombre de la oferta
watch(
  () => [
    estado.nombreOfertaPartes.producto,
    estado.nombreOfertaPartes.marca,
    estado.nombreOfertaPartes.empaque,
    estado.nombreOfertaPartes.cantidad,
  ],
  () => {
    const p = estado.nombreOfertaPartes;
    const u = estado.producto?.medida.abreviacion;
    estado.dataForm.nombre = `${p.producto} ${p.marca} ${p.empaque} ${
      p.cantidad
    } ${p.cantidad !== '' ? u : ''}`.trim();
    estado.dataForm.abreviacion = ofertaAbreviacion(estado.dataForm.nombre);
  },
  { immediate: true },
);

// Prellenar el empaque con seleccionar un tipo de empaque
const prellenarEmpaque = async (empaque) => {
  estado.resetEmpaque = 'Eligido ' + (empaque.nombre ?? '');
  estado.dataForm.cantidad = empaque.cantidad;
  estado.nombreOfertaPartes.cantidad = empaque.cantidad;
  estado.nombreOfertaPartes.empaque = empaque.nombre;
  estado.nombreOfertaPartes.empaqueAbreviacion = empaque.abreviacion;
  await setTimeout(() => {
    estado.resetEmpaque = null;
  }, 1500);
};

// submision del formulario
const formSubmit = async () => {};
</script>
