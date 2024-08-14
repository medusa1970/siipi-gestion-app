<template>
  hey
  <q-form @submit="formSubmit">
    <!--h1 class="text-center bg-gray-300 font-bold py-[2px]">DATOS BASICOS</h1-->
    <div v-if="edicion === null" class="importante">
      <div class="icon">
        <q-icon name="feedback" color="black" size="30px" />
      </div>
      <div class="texto">
        Por favor, asegúrese bien que el producto todavía no existe ayudándose
        del buscador arriba de la lista de productos.
      </div>
    </div>

    <!-- nombre -->
    <input-text
      label="Nombre"
      info="Nombre del PRODUCTO. Por favor antes de crear un producto, primero verifique que aun no exista ayudándose con el buscador."
      :porDefecto="estado.dataForm.nombre"
      @update="v => (estado.dataForm.nombre = v)"
      requerido
      :error="estado.errorNombre" />

    <!-- Categoria -->
    <input-select
      label="Categoria"
      :opciones="selectCategoria"
      info="La categoría existe con el objetivo de ubicar facilmente un producto. Para crear una nueva categoria, puede dar click en el boton (+) o vaya al menu Logistica > Categorías."
      :porDefecto="estado.dataForm.categoria"
      @update="v => (estado.dataForm.categoria = v)"
      requerido
      :dialog="formCategoria" />

    <!-- Imagen -->
    <input-image
      label="Imagen"
      info="Subir imagen del producto SOLO en fondo oscuro o claro, formato cuadrado"
      :dataPreview="estado.imagenPreview"
      :key="estado.imagenPreview"
      @update="
        (base64Data, mimetype) =>
          (estado.dataForm.imagen = base64Data
            ? { data: base64Data, mimetype: mimetype }
            : null)
      "
      icono="photo_camera" />

    <!-- Tiempo de vida -->
    <input-text
      label="Tiempo de vida"
      tipo="number"
      info='Ingrese el tiempo de vida del producto en DIAS, ejemplo: Los embolsados de semillas tienen 6 meses de vida, por lo tanto ingresar "180".'
      :porDefecto="estado.dataForm.tiempoVida"
      @update="v => (estado.dataForm.tiempoVida = v)" />

    <input-checkbox
      label="Fecha de vencimiento"
      info="Info #"
      noSlot
      :porDefecto="estado.dataForm.puedeVencer"
      @update="v => (estado.dataForm.puedeVencer = v)" />

    <div v-if="estado.dataForm.puedeVencer" class="flex">
      <input-text
        class="flex-grow"
        style="margin-right: 16px"
        label="Avisar debajo de X"
        tipo="number"
        info="Ingrese la cantidad de dias que desea que el sistema le bote una 1ra alerta antes del vencimiento del producto. Ejemplo: Si ingreso 5, el sistema botara una alerta 5 dias antes al vencimiento de este producto"
        :porDefecto="estado.dataForm.vencimientoAvisoSuave"
        @update="v => (estado.dataForm.vencimientoAvisoSuave = v)" />
      <input-text
        class="flex-grow"
        style="margin-left: 16px"
        label="Aviso fuerte debajo de Y"
        tipo="number"
        info="Ingrese la cantidad de dias que desea que el sistema le bote una 2da alerta antes del vencimiento del producto. Ejemplo: Si ingreso 5 en el primer campo, entonces esta 2da alerta puede ser 2, asi el sistema botara nuevamente otra alerta 2 dias antes al vencimiento de este producto"
        :porDefecto="estado.dataForm.vencimientoAvisoFuerte"
        @update="v => (estado.dataForm.vencimientoAvisoFuerte = v)" />
    </div>

    <input-text
      tipo="textarea"
      label="Comentario"
      info="Agregue cualquier información adicional importante de este producto."
      :porDefecto="estado.dataForm.comentario"
      @update="v => (estado.dataForm.comentario = v)" />
    <!-- Submit -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import type { Producto } from '#gql';
import type { CategoriaSelectOpcion } from '../almacen.interface';
import formCategoria from './formCategoria.vue';
import { UrlToBase64Image } from '~/components/input/input.service';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
const { store } = useAlmacen();

// definicion de los emits
const emits = defineEmits(['crearObjeto', 'modificarObjeto']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    edicion?: Producto; // edicion si producto no es null, sino creacion
  }>(),
  {
    edicion: null
  }
);

// datos por defecto del formulario
const initForm = {
  nombre: props.edicion?.nombre,
  categoria: props.edicion?.categoria?._id,
  comentario: props.edicion?.comentario,
  puedeVencer: props.edicion?.puedeVencer ?? false,
  vencimientoAvisoSuave: props.edicion?.vencimientoAvisoSuave,
  vencimientoAvisoFuerte: props.edicion?.vencimientoAvisoFuerte,
  tiempoVida: props.edicion?.tiempoVida ?? null,
  imagen: null
};

// definicion del estado
const estado = reactive({
  dataForm: clone(initForm),
  errorNombre: '',
  imagenPreview: null
});

// opciones
const selectCategoria = computed(() => {
  const options = [];
  if (store.categoriaArbol) {
    for (const cat of store.categoriaArbol.hijas) {
      options.push(<CategoriaSelectOpcion>{
        label: cat.nombre,
        value: cat._id,
        disable: true,
        class: 'titulo'
      });
      for (const subcat of cat.hijas) {
        options.push(<CategoriaSelectOpcion>{
          label: subcat.nombre,
          value: subcat._id,
          class: 'option'
        });
      }
    }
  }
  return options;
});

// Inicializaciones
onMounted(async () => {
  await store.getCategorias();
  // recuperamos la imagen desde la url
  if (props.edicion?.imagen?.cloudinaryUrl) {
    await UrlToBase64Image(props.edicion.imagen.cloudinaryUrl, base64Data => {
      estado.imagenPreview = base64Data;
    });
  } else {
    estado.imagenPreview = null;
  }
});

// submision del formulario
const formSubmit = async () => {
  if (!estado.dataForm.imagen) {
    delete estado.dataForm.imagen;
  }
  try {
    if (props.edicion) {
      const producto = await api.modificarProducto_basico(
        props.edicion._id,
        estado.dataForm,
        { loading: true }
      );
      emits('modificarObjeto', producto);
    } else {
      const producto = await api.crearProducto_basico(estado.dataForm, {
        loading: true
      });
      emits('crearObjeto', producto);
    }
  } catch (err) {
    if (isApiBadRequest(err, 'duplicado')) {
      estado.errorNombre = 'Ya existe un producto con este nombre';
      return;
    }
    errFailback(err);
    return;
  }
  await store.refreshProductos();
  estado.dataForm = clone(initForm);
};
</script>
