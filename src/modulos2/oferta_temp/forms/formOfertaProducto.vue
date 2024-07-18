<template>
  [ {{ parteMarca }}] [ {{ estado.dataForm.marca }}]
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
      @update="(v) => (estado.dataForm.marca = v ?? '')"
      @clear="(v) => (estado.dataForm.marca = '')"
      :watch="estado.dataForm.marca"
      :rules="[useRules.requerido()]"
    />

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

    <!-- descripcion -->
    <input-text2
      label="Descripcion"
      info="Info."
      autogrow
      :porDefecto="estado.dataForm.descripcion"
      @update="(v) => (estado.dataForm.descripcion = v)"
      :watch="estado.dataForm.descripcion"
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
  producto: props.config?.productoId,
  marca: null,
  cantidad: null,
  nombre: null,
  empaque: null,
  abreviacion: null,
  descripcion: null,
  precioConFactura: null,
  precioSinFactura: null,
  imagen: null,
  catalogo: null,
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
    empaque: '',
    empaqueAbreviacion: '',
    cantidad: '',
  },
});
const parteProducto = ref('');
const parteMarca = ref('');

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
    parteProducto.value = estado.producto.nombre;
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
    console.log('cambio de marca:', estado.dataForm.marca);

    // si se reinicializo la marca, reinicializemos tambien el empaque
    if (estado.dataForm.marca === '' || estado.dataForm.marca == null) {
      estado.dataForm.empaque = '';
      return;
    }
    // recuperamos el nombre de la marca
    // HACK en vez de llamar la base de datos leemos directamente en las opciones
    parteMarca.value =
      estado.variedadOpciones.find((opcion) => {
        return opcion.value === estado.dataForm.marca;
      })?.label ?? '';

    // recuperamos los nuevos empaques del producto con esta marca...
    const empaques = estado.producto?.empaques?.filter(
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
  { immediate: false, deep: true },
);

watch(
  () => estado.dataForm.cantidad,
  () => {
    estado.nombreOfertaPartes.cantidad = estado.dataForm.cantidad
      ? ' ' + estado.dataForm.cantidad + estado.producto?.medida?.abreviacion
      : '';
  },
  { immediate: true },
);

watch(
  () => estado.dataForm.nombre,
  () => {
    estado.dataForm.abreviacion = ofertaAbreviacion(
      estado.dataForm.nombre ?? '',
    );
  },
  { immediate: true },
);

// constuccion dinmica del nombre de la oferta
watch(
  parteMarca,
  () => {
    console.log('ok');
    const p = estado.nombreOfertaPartes;
    estado.dataForm.nombre =
      `${parteProducto.value} ${parteMarca.value} ${p.empaque} ${p.cantidad}`.replace(
        '  ',
        ' ',
      );
    estado.dataForm.abreviacion = ofertaAbreviacion(estado.dataForm.nombre);
  },
  { deep: true },
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
      ingredientes: [
        {
          tipo: 'SIMPLE',
          producto: null, //estado.dataForm.producto,
          marca: estado.dataForm.marca,
          cantidad: estado.dataForm.cantidad,
        },
      ],
      precioConFactura: estado.dataForm.precioConFactura,
      precioSinFactura: estado.dataForm.precioSinFactura,
      // preciosPorMayor: estado.dataForm.preciosPorMayor,
    };
    // lanzamos la consulta
    // const oferta = await api.crearOferta(dataForm,estado. { loading: true });
    // reinicializamos el formulario
    estado.dataForm = clone(initForm);
    // mandamos el resultado al componiente pariente
    // emits('crearObjeto', oferta);
  } catch (err) {
    errFallBack(err);
    return;
  }
};
</script>
