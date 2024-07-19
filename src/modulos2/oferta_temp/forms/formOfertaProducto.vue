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
        tipo="number"
        label="Cantidad"
        info="Si desea elija un empaque, o sino entre directamente la cantidad."
        :porDefecto="estado.dataForm.cantidad"
        @update="(v) => (estado.dataForm.cantidad = v)"
        :watch="estado.dataForm.cantidad"
        :rules="[useRules.requerido()]"
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

    <!-- descripcion -->
    <input-text2
      label="Descripcion"
      info="Info."
      autogrow
      :porDefecto="estado.dataForm.descripcion"
      @update="(v) => (estado.dataForm.descripcion = v)"
    />
    <!-- Catalogo -->
    <input-select2
      label="Catalogo"
      info="Info."
      :opciones="estado.catalogoOpciones"
      :porDefecto="estado.dataForm.catalogo ?? '75a4475e446a5885b05739c4'"
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
      tipo="number"
      info="Info."
      :porDefecto="estado.dataForm.precioConFactura"
      @update="(v) => (estado.dataForm.precioConFactura = v)"
      :rules="[useRules.requerido()]"
    />
    <input-text2
      label="precio sin factura"
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
import { useAlmacen } from '~/modulos2/almacen/almacen.composable';
import { ofertaAbreviacion } from '../utils/oferta-utils';
const { store, productoIncompleto } = useAlmacen();

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
  producto: props.config?.productoId ?? '',
  marca: null,
  cantidad: null,
  nombre: '',
  abreviacion: '',
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
  producto: null,
  oferta: null,
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
  estado.productoOpciones = store.productos
    .filter((p) => !productoIncompleto(p))
    .map((p) => {
      return {
        value: p._id,
        label: p.nombre,
      };
    });
  const arbol = await store.getCatalogoArbol();
  estado.catalogoOpciones = arbol.hijas
    .filter((catalogo) => catalogo.nombre !== 'CATALOGO PROVEEDORES')
    .map((c) => {
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
    estado.producto = estado.dataForm.producto
      ? store.productos.find((p) => {
          return p._id === estado.dataForm.producto;
        })
      : null;
    estado.nombreOfertaPartes.producto = estado.dataForm.producto
      ? estado.producto.nombre
      : '';
    estado.variedadOpciones = estado.dataForm.producto
      ? estado.producto.variedades.map((variedad) => ({
          value: variedad.marca._id,
          label: variedad.marca.nombre,
        }))
      : [];
    // estado.dataForm.marca = null;
  },
  { immediate: true },
);

watch(
  () => estado.dataForm.marca,
  () => {
    // recuperamos el nombre de la marca
    estado.nombreOfertaPartes.marca = estado.dataForm.marca
      ? estado.variedadOpciones.find(
          (opcion) => opcion.value === estado.dataForm.marca,
        ).label
      : '';
    // recuperamos los nuevos empaques del producto con esta marca
    const empaques = estado.dataForm.marca
      ? estado.producto.empaques.filter(
          (empaque) => empaque.marca._id === estado.dataForm.marca,
        )
      : [];
    estado.empaqueOpciones = empaques.map((empaque) => {
      return {
        value: empaque,
        label: empaque.nombre,
      };
    });
    estado.dataForm.empaque = null;
    estado.dataForm.cantidad = null;
  },
  { immediate: true },
);

watch(
  () => estado.dataForm.cantidad,
  () => {
    estado.nombreOfertaPartes.cantidad = estado.dataForm.cantidad
      ? estado.dataForm.cantidad + ' ' + estado.producto?.medida?.abreviacion
      : '';
    if (!estado.dataForm.cantidad) {
      estado.nombreOfertaPartes.empaque = '';
    }
  },
  { immediate: false },
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
  () => estado.nombreOfertaPartes,
  () => {
    const p = estado.nombreOfertaPartes;
    estado.dataForm.nombre = p.producto;
    if (p.marca) estado.dataForm.nombre += ' ' + p.marca;
    if (p.empaque) estado.dataForm.nombre += ' ' + p.empaque;
    if (p.cantidad) estado.dataForm.nombre += ' ' + p.cantidad;
    estado.dataForm.abreviacion = ofertaAbreviacion(estado.dataForm.nombre);
  },
  { immediate: true, deep: true },
);

// Prellenar el empaque con seleccionar un tipo de empaque
const prellenarEmpaque = async (empaque) => {
  if (!empaque) return;
  console.log(empaque);
  estado.dataForm.cantidad = empaque.cantidad;
  estado.nombreOfertaPartes.cantidad = empaque.cantidad;
  estado.nombreOfertaPartes.empaque = empaque.nombre;
  estado.nombreOfertaPartes.empaqueAbreviacion = empaque.abreviacion;
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
    // preparamos lestadoa oferta
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
      // preciosPorMayor: estado.dataForm.preciosPorMayor,
    };

    // lanzamos la consulta
    const oferta = await api.crearOferta(estado.oferta, { loading: true });
    // reinicializamos el formulario
    estado.dataForm = clone(initForm);
    // mandamos el resultado al componiente pariente
    emits('crearObjeto', oferta);
  } catch (err) {
    errFallBack(err);
    return;
  }
};
</script>
