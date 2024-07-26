<template>
  <!-- <div class="importante">
    <div class="icon">
      <q-icon name="engineering" color="black" size="30px" />
    </div>
    <div class="texto">
      En construccion todavia! <br />Mañana por la mañanita se podrá guardar las
      ofertas por aquí.
    </div>
  </div> -->
  <q-form @submit="formSubmit">
    <!-- Produit -->
    <input-select
      label="Producto"
      info="Info."
      :opciones="selectProducto"
      :porDefecto="estado.dataForm.producto"
      @update="(v) => (estado.dataForm.producto = v)"
      :rules="[useRules.requerido()]"
      :color="estado.dataForm.producto && 'orange-2'"
      filled
    />

    <!-- Marca -->
    <input-select
      label="Marca"
      info="Info."
      :opciones="selectVariedad"
      :porDefecto="estado.dataForm.marca"
      @update="(v) => (estado.dataForm.marca = v)"
      :rules="[useRules.requerido()]"
      :watch="estado.dataForm.marca"
    />

    <p></p>
    <div class="flex">
      <input-select
        style="width: 40%"
        label="Empaque preseleccionado"
        info="Info."
        :opciones="selectEmpaque"
        @update="(v) => prellenarEmpaque(v)"
        :watch="estado.resetEmpaque"
        color="grey-5"
        filled
      />
      <input-text
        style="width: 40%"
        tipo="number"
        label="Cantidad"
        info="Si desea elija un empaque, o sino entre directamente la cantidad."
        :porDefecto="estado.dataForm.cantidad"
        @update="(v) => (estado.dataForm.cantidad = v)"
        :rules="[useRules.requerido()]"
        :watch="estado.dataForm.cantidad"
      />
    </div>

    <!-- nombre -->
    <input-text
      label="Nombre"
      info="Info."
      @update="(v) => (estado.dataForm.nombre = v)"
      :rules="[useRules.requerido()]"
      :porDefecto="estado.dataForm.nombre"
      :watch="estado.dataForm.nombre"
      :error="estado.errorNombre"
    />

    <!-- abreviacion -->
    <input-text
      label="Abreviacion"
      info="Info."
      @update="(v) => (estado.dataForm.abreviacion = v)"
      :rules="[useRules.requerido()]"
      :porDefecto="estado.dataForm.abreviacion"
      :watch="estado.dataForm.abreviacion"
      :error="estado.errorAbreviacion"
    />

    <!-- descripcion -->
    <input-text
      label="Descripcion"
      info="Info."
      autogrow
      :porDefecto="estado.dataForm.descripcion"
      @update="(v) => (estado.dataForm.descripcion = v)"
    />
    <!-- Catalogo -->
    <input-select
      label="Catalogo"
      info="Info."
      :opciones="selectCatalogo"
      :porDefecto="estado.dataForm.catalogo"
      @update="(v) => (estado.dataForm.catalogo = v)"
      :rules="[useRules.requerido()]"
      :color="estado.dataForm.catalogo && 'orange-2'"
      filled
    />

    <!-- Imagen -->
    <input-image
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
    <input-text
      label="Precio con factura"
      tipo="number"
      info="Info."
      :porDefecto="estado.dataForm.precioConFactura"
      @update="(v) => (estado.dataForm.precioConFactura = v)"
      :rules="[useRules.requerido()]"
    />
    <input-text
      label="Precio sin factura"
      tipo="number"
      info="Info."
      :porDefecto="estado.dataForm.precioSinFactura"
      @update="(v) => (estado.dataForm.precioSinFactura = v)"
      :rules="[useRules.requerido()]"
    />

    <!-- Submit -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
import { useOfertas } from '~/modulos/ofertas/ofertas.composable';
const { store, ofertaAbreviacion } = useOfertas();
const { store: storeAlmacen, productoIncompleto } = useAlmacen();

// definicion de los emits
const emits = defineEmits(['crearObjeto', 'modificarObjeto']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    config?: { productoId?: string };
  }>(),
  {},
);

// producto seleccionado
const producto = computed(() => {
  if (!storeAlmacen.productos) return null;
  return storeAlmacen.productos.find((p) => {
    return p._id === estado.dataForm.producto;
  });
});

const selectProducto = computed(() => {
  if (!storeAlmacen.productos) return [];
  return storeAlmacen.productos
    .filter((p) => !productoIncompleto(p))
    .map((p) => {
      return {
        value: p._id,
        label: p.nombre,
      };
    });
});

const selectCatalogo = computed(() => {
  if (!store.catalogoArbol) return [];
  let options = [];
  for (const cat of store.catalogoArbol.hijas) {
    const idsHijas = [];
    const hijas = [];
    for (const subcat of cat.hijas) {
      hijas.push({
        label: subcat.nombre,
        value: subcat._id,
        class: 'option',
      });
      idsHijas.push(subcat._id);
    }
    if (cat.nombre !== 'CATALOGO PROVEEDORES')
      options.push({
        label: cat.nombre,
        value: cat._id,
        disable: true,
        class: 'title',
      });
    options = [...options, ...hijas];
  }
  return options;
});

const selectVariedad = computed(() => {
  if (!producto.value) return [];
  return producto.value.variedades.map((variedad) => ({
    value: variedad.marca._id,
    label: variedad.marca.nombre,
  }));
});

const selectEmpaque = computed(() => {
  if (!estado.dataForm.marca || !producto.value?.empaques) return [];
  return producto.value.empaques
    .filter((empaque) => empaque.marca._id === estado.dataForm.marca)
    .map((empaque) => ({
      value: empaque._id,
      label: empaque.nombre,
    }));
});

// datos por defecto del formulario
const initForm = {
  producto: props.config?.productoId,
  marca: null,
  cantidad: null,
  nombre: null,
  abreviacion: null,
  descripcion: null,
  catalogo: null,
  precioConFactura: null,
  precioSinFactura: null,
  imagen: null,
};

// definicion del estado
const estado = reactive({
  // valor de los inputs
  dataForm: clone(initForm),
  //mensajes de error del formulario
  errorNombre: '',
  errorAbreviacion: '',
  // producto seleccionado
  oferta: null,

  // para el empaque
  resetEmpaque: null,
  nombreEmpaque: null,
});

// Inicializaciones
onMounted(async () => {
  await storeAlmacen.getProductos();
  await store.getCatalogos();
});

watch(producto, (v) => {
  estado.dataForm.marca = null;
});
watch(
  [producto, () => estado.dataForm.marca, () => estado.dataForm.cantidad],
  (v) => {
    let nombre = producto.value?.nombre ?? '';
    const marca = selectVariedad.value?.find(
      (opcion) => opcion.value === estado.dataForm.marca,
    )?.label;
    if (marca) nombre += ' ' + marca;
    if (estado.nombreEmpaque) nombre += ' ' + estado.nombreEmpaque;
    if (estado.dataForm.cantidad && producto.value) {
      nombre +=
        ' ' +
        estado.dataForm.cantidad +
        ' ' +
        producto.value.medida.abreviacion;
    }
    estado.dataForm.nombre = nombre;
    estado.dataForm.abreviacion = ofertaAbreviacion(nombre);
  },
  { immediate: true },
);
watch(
  () => estado.dataForm.marca,
  (v) => {
    if (!v) {
      estado.nombreEmpaque = '';
    }
  },
);

// Prellenar el empaque con seleccionar un tipo de empaque
const prellenarEmpaque = async (empaque) => {
  const emp = producto.value?.empaques.find((e) => e._id === empaque);
  if (!emp) return;
  estado.dataForm.cantidad = emp.cantidad;
  estado.resetEmpaque = empaque;
  estado.nombreEmpaque = emp.nombre;
  await setTimeout(() => {
    estado.resetEmpaque = null;
  }, 1500);
};

// submision del formulario
const formSubmit = async () => {
  if (!estado.dataForm.imagen) {
    delete estado.dataForm.imagen;
  }
  try {
    // preparamos la oferta
    estado.oferta = {
      nombre: estado.dataForm.nombre,
      abreviacion: estado.dataForm.abreviacion,
      catalogo: estado.dataForm.catalogo,
      descripcion: estado.dataForm.descripcion,
      ingredientes: [
        {
          tipo: 'SIMPLE',
          producto: estado.dataForm.producto,
          marca: estado.dataForm.marca,
          cantidad: estado.dataForm.cantidad,
        },
      ],
      precioConFactura: estado.dataForm.precioConFactura,
      precioSinFactura: estado.dataForm.precioSinFactura,
      preciosPorMayor: estado.dataForm.preciosPorMayor,
    };

    const oferta = await api.crearOferta(estado.oferta, { loading: true });
    emits('crearObjeto', oferta);
  } catch (err) {
    errFallBack(err);
    return;
  }
  await store.refreshOfertas();
  estado.dataForm = clone(initForm);
};
</script>
