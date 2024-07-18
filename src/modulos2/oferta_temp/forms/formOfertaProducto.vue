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
  <pre>
[ {{
      dataForm.marca === ''
        ? '[ES]'
        : dataForm.marca === null
        ? 'null'
        : dataForm.marca
    }}]</pre
  >

  <q-form @submit="formSubmit">
    <!-- Produit -->
    <input-select2
      label="Producto"
      info="Info."
      :opciones="productoOpciones"
      :porDefecto="dataForm.producto"
      @update="(v) => (dataForm.producto = v)"
      :rules="[useRules.requerido()]"
    />

    <!-- Marca -->
    <input-select2
      label="Marca"
      info="Info."
      :opciones="variedadOpciones"
      :porDefecto="dataForm.marca"
      @update="(v) => (dataForm.marca = v)"
      :watch="dataForm.marca"
      :rules="[useRules.requerido()]"
    />

    <p></p>
    <div class="flex">
      <input-select2
        style="width: 40%"
        label="Empaque preseleccionado"
        :opciones="empaqueOpciones"
        @update="(v) => prellenarEmpaque(v)"
        :watch="resetEmpaque"
      />
      <input-text2
        style="width: 50%"
        label="Cantidad"
        info="Si desea elija un empaque, o sino entre directamente a la cantidad."
        :porDefecto="dataForm.cantidad"
        @update="(v) => (dataForm.cantidad = Number(v))"
        :watch="dataForm.cantidad"
        :rules="[useRules.requerido(), useRules.numero()]"
      />
    </div>

    <!-- nombre -->
    <input-text2
      label="Nombre"
      info="Info."
      :porDefecto="dataForm.nombre"
      @update="(v) => (dataForm.nombre = v)"
      :rules="[useRules.requerido()]"
      :error="errorNombre"
      :watch="dataForm.nombre"
    />

    <!-- abreviacion -->
    <input-text2
      label="Abreviacion"
      info="Info."
      :porDefecto="dataForm.abreviacion"
      @update="(v) => (dataForm.abreviacion = v)"
      :rules="[useRules.requerido()]"
      :watch="dataForm.abreviacion"
      :error="errorAbreviacion"
    />

    <!-- descripcion -->
    <input-text2
      label="Descripcion"
      info="Info."
      autogrow
      :porDefecto="dataForm.descripcion"
      @update="(v) => (dataForm.descripcion = v)"
      :watch="dataForm.descripcion"
    />

    <!-- Catalogo -->
    <input-select2
      label="Catalogo"
      info="Info."
      :opciones="catalogoOpciones"
      :porDefecto="dataForm.catalogo"
      @update="(v) => (dataForm.catalogo = v)"
      :rules="[useRules.requerido()]"
    />

    <!-- Imagen -->
    <input-image2
      label="Imagen"
      info="Info."
      @update="
        (base64Data, mimetype) =>
          (dataForm.imagen = base64Data
            ? { data: base64Data, mimetype: mimetype }
            : null)
      "
      icono="photo_camera"
    />

    <!-- Precios -->
    <input-text2
      label="Precio con factura"
      info="Info."
      :porDefecto="dataForm.precioConFactura"
      @update="(v) => (dataForm.precioConFactura = Number(v))"
      :rules="[useRules.numero()]"
    />
    <input-text2
      label="precio sin factura"
      info="Info."
      :porDefecto="dataForm.precioSinFactura"
      @update="(v) => (dataForm.precioSinFactura = Number(v))"
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
import type { Producto } from '#gql';
import type { CrearOfertaDto } from '#gql';
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

// valor de los inputs
const dataForm = ref<typeof initForm>(clone(initForm));
//mensajes de error del formulario
const errorNombre = ref('');
const errorAbreviacion = ref('');
// objetos seleccionados
const producto = ref<Producto>(null);
const oferta = ref<CrearOfertaDto>(null);
// opciones para seleccion
const productoOpciones = ref([]);
const variedadOpciones = ref([]);
const empaqueOpciones = ref([]);
const catalogoOpciones = ref([]);
// para el empaque
const resetEmpaque = ref('');
const nombreOfertaPartes = ref({
  producto: '',
  marca: '',
  empaque: '',
  empaqueAbreviacion: '',
  cantidad: '',
});

// Inicializaciones
onMounted(async () => {
  productoOpciones.value = store.productos.map((p) => {
    return {
      value: p._id,
      label: p.nombre,
    };
  });
  const arbol = await store.getCatalogoArbol();
  catalogoOpciones.value = arbol.hijas.map((c) => {
    return {
      value: c._id,
      label: c.nombre,
    };
  });
});

watch(
  () => dataForm.value.producto,
  () => {
    // producto
    producto.value = store.productos.find((p) => {
      return p._id === dataForm.value.producto;
    });
    if (!producto.value) {
      return;
    }
    nombreOfertaPartes.value.producto = producto.value.nombre;
    // marca
    variedadOpciones.value = producto.value.variedades.map((variedad) => ({
      value: variedad.marca._id,
      label: variedad.marca.nombre,
    }));
    dataForm.value.marca = null;
  },
  { immediate: true },
);

watch(
  () => dataForm.value.marca,
  () => {
    console.log('cambio de marca:', dataForm.value.marca);

    // si se reinicializo la marca, reinicializemos tambien el empaque
    if (dataForm.value.marca === '' || dataForm.value.marca == null) {
      dataForm.value.empaque = '';
      return;
    }
    // recuperamos el nombre de la marca
    // HACK en vez de llamar la base de datos leemos directamente en las opciones
    nombreOfertaPartes.value.marca =
      variedadOpciones.value.find((opcion) => {
        return opcion.value === dataForm.value.marca;
      })?.label ?? '';

    // recuperamos los nuevos empaques del producto con esta marca...
    const empaques = producto.value.empaques.filter(
      (empaque) => empaque.marca._id === dataForm.value.marca,
    );
    // ... y lo transformamos en opcionSelect
    empaqueOpciones.value = empaques.map((empaque) => {
      return {
        value: empaque,
        label: empaque.nombre,
      };
    });
  },
  { immediate: false },
);

watch(
  () => dataForm.value.cantidad,
  () => {
    nombreOfertaPartes.value.cantidad = dataForm.value.cantidad;
  },
  { immediate: true },
);

watch(
  () => dataForm.value.nombre,
  () => {
    dataForm.value.abreviacion = ofertaAbreviacion(dataForm.value.nombre ?? '');
  },
  { immediate: true },
);

// constuccion dinmica del nombre de la oferta
watch(
  nombreOfertaPartes.value,
  () => {
    const p = nombreOfertaPartes;
    const u = producto?.value.medida?.abreviacion;
    dataForm.value.nombre = `${p.value.producto} ${p.value.marca} ${
      p.value.empaque
    } ${p.value.cantidad} ${p.value.cantidad !== '' ? u : ''}`.trim();
    dataForm.value.abreviacion = ofertaAbreviacion(dataForm.value.nombre);
  },
  { immediate: true },
);
/*
watch(
  () => nombreOfertaPartes.value.marca,
  () => {
    console.log('triggered2');
  },
  { immediate: true, deep: true },
);

*/

// Prellenar el empaque con seleccionar un tipo de empaque
const prellenarEmpaque = async (empaque) => {
  resetEmpaque.value = 'Eligido ' + (empaque.nombre ?? '');
  dataForm.value.cantidad = empaque.cantidad;
  nombreOfertaPartes.value.cantidad = empaque.cantidad;
  nombreOfertaPartes.value.empaque = empaque.nombre;
  nombreOfertaPartes.value.empaqueAbreviacion = empaque.abreviacion;
  await setTimeout(() => {
    resetEmpaque.value = null;
  }, 1500);
};

// submision del formulario
const formSubmit = async () => {
  if (!dataForm.value.imagen) {
    delete dataForm.value.imagen;
  }
  try {
    // preparamos la oferta
    oferta.value = {
      nombre: dataForm.value.nombre,
      abreviacion: dataForm.value.abreviacion,
      catalogo: dataForm.value.catalogo,
      ingredientes: [
        {
          tipo: 'SIMPLE',
          producto: null, //dataForm.value.producto,
          marca: dataForm.value.marca,
          cantidad: dataForm.value.cantidad,
        },
      ],
      precioConFactura: dataForm.value.precioConFactura,
      precioSinFactura: dataForm.value.precioSinFactura,
      // preciosPorMayor: dataForm.value.preciosPorMayor,
    };
    // lanzamos la consulta
    // const oferta = await api.crearOferta(dataForm,.value { loading: true });
    // reinicializamos el formulario
    dataForm.value = clone(initForm);
    // mandamos el resultado al componiente pariente
    // emits('crearObjeto', oferta);
  } catch (err) {
    errFallBack(err);
    return;
  }
};
</script>
