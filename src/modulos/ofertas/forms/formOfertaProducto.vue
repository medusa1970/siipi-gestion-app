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
      info="Info #46"
      :opciones="selectProducto"
      :porDefecto="estado.dataForm.producto"
      @update="v => (estado.dataForm.producto = v)"
      requerido />

    <!-- Marca -->
    <input-select
      label="Marca"
      info="Info #47"
      :opciones="selectVariedad"
      :porDefecto="estado.dataForm.marca"
      @update="v => (estado.dataForm.marca = v)"
      requerido
      :watch="estado.dataForm.marca" />

    <div class="flex">
      <input-select
        label="Empaque preseleccionado"
        class="flex-grow"
        style="margin-right: 16px"
        info="Info #48"
        :opciones="selectEmpaque"
        @update="v => prellenarEmpaque(v)"
        :watch="estado.resetEmpaque"
        color="grey-6" />
      <input-text
        class="flex-grow"
        style="margin-left: 16px"
        tipo="number"
        label="Cantidad"
        info="Info #49"
        :porDefecto="estado.dataForm.cantidad"
        @update="v => (estado.dataForm.cantidad = v)"
        requerido
        :watch="estado.dataForm.cantidad" />
    </div>

    <!-- nombre -->
    <input-text
      label="Nombre"
      info="Info #40"
      @update="v => (estado.dataForm.nombre = v)"
      requerido
      :porDefecto="estado.dataForm.nombre"
      :watch="estado.dataForm.nombre"
      :error="estado.errorNombre" />

    <!-- abreviacion -->
    <input-text
      label="Abreviacion"
      info="Info #41"
      @update="v => (estado.dataForm.abreviacion = v)"
      requerido
      :porDefecto="estado.dataForm.abreviacion"
      :watch="estado.dataForm.abreviacion"
      :error="estado.errorAbreviacion"
      :maxLength="30" />

    <!-- descripcion -->
    <input-text
      label="Descripcion"
      info="Info #42"
      autogrow
      :porDefecto="estado.dataForm.descripcion"
      @update="v => (estado.dataForm.descripcion = v)" />

    <!-- Catalogo -->
    <input-select
      label="Catalogo"
      info="Info #43"
      :opciones="selectCatalogo"
      @callback="fn => (set.cat = fn)"
      @update="v => (estado.catalogoAncestro = v)"
      requerido />

    <input-select
      label="Sub catalogo"
      info="Info #44"
      :opciones="selectSubCatalogo"
      @callback="fn => (set.subCat = fn)"
      @update="v => (estado.dataForm.catalogo = v)"
      requerido />

    <!-- Imagen -->
    <input-image
      label="Imagen"
      info="Info #45"
      @update="
        (base64Data, mimetype) =>
          (estado.dataForm.imagen = base64Data
            ? { data: base64Data, mimetype: mimetype }
            : null)
      "
      icono="photo_camera" />

    <!-- Precios -->

    <div class="flex">
      <input-text
        class="flex-grow"
        label="Precio sin factura"
        tipo="decimal"
        info="Info #47"
        :porDefecto="estado.dataForm.precioSinFactura"
        @update="v => (estado.dataForm.precioSinFactura = v)"
        requerido
        :watch="estado.watchSin"
        :forceWatch="estado.forceWatchSin" />
      <q-btn
        icon="calculate"
        size="lg"
        :disable="!estado.dataForm.precioConFactura"
        :color="colorCalculateSin"
        flat
        dense
        @click="
          estado.forceWatchSin = !estado.forceWatchSin;
          estado.watchSin = estado.dataForm.precioConFactura * (100 / 113);
        " /><q-tooltip anchor="bottom right" self="top right" :offset="[0, -35]"
        >calcular sin factura -13%</q-tooltip
      >
    </div>

    <div class="flex">
      <input-text
        class="flex-grow"
        label="Precio con factura"
        tipo="decimal"
        info="Info #46"
        :porDefecto="estado.dataForm.precioConFactura"
        @update="v => (estado.dataForm.precioConFactura = v)"
        requerido
        :watch="estado.watchCon"
        :forceWatch="estado.forceWatchCon" />
      <q-btn
        icon="calculate"
        size="lg"
        flat
        dense
        :disable="!estado.dataForm.precioSinFactura"
        :color="colorCalculateCon"
        @click="
          {
            estado.forceWatchCon = !estado.forceWatchCon;
            estado.watchCon = estado.dataForm.precioSinFactura * (113 / 100);
          }
        " /><q-tooltip anchor="bottom right" self="top right" :offset="[0, -35]"
        >calcular con factura +13%</q-tooltip
      >
    </div>

    <!-- Submit -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { CatalogoArbolDocument } from '#gql/default';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
import { useOfertas } from '~/modulos/ofertas/ofertas.composable';
const { store, ofertaAbreviacion } = useOfertas();
const { store: storeAlmacen, productoIncompleto } = useAlmacen();

// definicion de los emits
const emits = defineEmits(['crearObjeto', 'modificarObjeto']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    catalogo?: string;
    config?: { productoId?: string };
  }>(),
  {
    catalogo: null
  }
);

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
  imagen: null
};

// definicion del estado
const estado = reactive({
  // valor de los inputs
  dataForm: clone(initForm),
  catalogoAncestro: null as string, // catalogo seleccionado (solo el subcat va en el form)
  //mensajes de error del formulario
  errorNombre: '',
  errorAbreviacion: '',
  // producto seleccionado
  oferta: null,

  // para el empaque
  resetEmpaque: null,
  nombreEmpaque: null,

  // para calculadora de precios
  watchSin: null as number,
  watchCon: null as number,
  forceWatchCon: false,
  forceWatchSin: false,

  // todos los catalogos
  catalogos: null
});

// callbacks pour les inputs
const set = reactive({
  cat: null,
  subCat: null
});

// color de los botones calduladoras
const colorCalculateSin = computed(() =>
  estado.dataForm.precioConFactura ? 'orange' : 'orange-4'
);
const colorCalculateCon = computed(() =>
  estado.dataForm.precioSinFactura ? 'orange' : 'orange-4'
);

// producto seleccionado
const producto = computed(() => {
  if (!storeAlmacen.productos) return null;
  return storeAlmacen.productos.find(p => {
    return p._id === estado.dataForm.producto;
  });
});

const selectProducto = computed(() => {
  if (!storeAlmacen.productos) return [];
  return storeAlmacen.productos
    .filter(p => !productoIncompleto(p))
    .map(p => {
      return {
        value: p._id,
        label: p.nombre
      };
    });
});

// opciones
const selectCatalogo = computed(() => {
  if (!store.catalogoArbol) return [];
  let options = [];
  for (const cat of store.catalogoArbol.hijas) {
    if (cat.nombre !== 'CATALOGO PROVEEDORES')
      options.push({
        label: cat.nombre,
        value: cat._id
      });
    options = [...options];
  }
  return options;
});

// opciones
const selectSubCatalogo = computed(() => {
  const catalogo = store.getOne(estado.catalogoAncestro);
  if (!catalogo) return [];
  let options = [];
  for (const cat of catalogo.hijas) {
    const idsHijas = [];
    const hijas = [];
    for (const subcat of cat.hijas) {
      hijas.push({
        label: subcat.nombre,
        value: subcat._id,
        class: 'option'
      });
      idsHijas.push(subcat._id);
    }
    if (cat.nombre !== 'CATALOGO PROVEEDORES')
      options.push({
        label: cat.nombre,
        value: cat._id,
        disable: false,
        class: 'title'
      });
    options = [...options, ...hijas];
  }
  return options;
});

const selectVariedad = computed(() => {
  if (!producto.value) return [];
  return producto.value.variedades.map(variedad => ({
    value: variedad.marca._id,
    label: variedad.marca.nombre
  }));
});

const selectEmpaque = computed(() => {
  if (!estado.dataForm.marca || !producto.value?.empaques) return [];
  return producto.value.empaques
    .filter(empaque => empaque.marca._id === estado.dataForm.marca)
    .map(empaque => ({
      value: empaque._id,
      label: empaque.nombre
    }));
});

// Inicializaciones
onMounted(async () => {
  storeAlmacen.getProductos();
  store.getCatalogoArbol();

  // catalogo por defecto para agregar nueva oferta segun el catalogo corriente
  if (props.catalogo) {
    set.cat(props.catalogo);
  }
});

// reinicializar sub catalogo cuando catalogo cambia
watch(
  () => estado.catalogoAncestro,
  () => set.subCat(null)
);

// reinicializar la marca cuando el producto cambia
watch(producto, v => {
  estado.dataForm.marca = null;
});

// generar el nombre de la oferta cuando los datos cambian
watch(
  [producto, () => estado.dataForm.marca, () => estado.dataForm.cantidad],
  v => {
    let nombre = producto.value?.nombre ?? '';
    const marca = selectVariedad.value?.find(
      opcion => opcion.value === estado.dataForm.marca
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
  { immediate: true }
);
watch(
  () => estado.dataForm.marca,
  v => {
    if (!v) {
      estado.nombreEmpaque = '';
    }
  }
);

// Prellenar el empaque con seleccionar un tipo de empaque
const prellenarEmpaque = async empaque => {
  const emp = producto.value?.empaques.find(e => e._id === empaque);
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
          cantidad: estado.dataForm.cantidad
        }
      ],
      precioConFactura: estado.dataForm.precioConFactura,
      precioSinFactura: estado.dataForm.precioSinFactura,
      preciosPorMayor: estado.dataForm.preciosPorMayor
    };

    try {
      const oferta = await crearUno(GqlCrearOfertas, { datos: estado.oferta });
      emits('crearObjeto', oferta);
    } catch (err) {
      errFailback(err);
      return;
    }
  } catch (err) {
    errFailback(err);
    return;
  }
  await store.refreshOfertas();
  estado.dataForm = clone(initForm);
};
</script>
