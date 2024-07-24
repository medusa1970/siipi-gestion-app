<template>
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
      info="Por favor antes de crear un producto, asegúrese que no existe todavá. Ayúdese del buscador de la tabla."
      :porDefecto="estado.dataForm.nombre"
      @update="(v) => (estado.dataForm.nombre = v)"
      :rules="[useRules.requerido()]"
      :error="estado.errorNombre"
    />

    <!-- Categoria -->
    <input-select
      label="Categoria"
      :opciones="selectCategoria"
      info="La categoría existe solamente a fines de ubicar facilmente el producto en administracion. Para crear una nueva categoria, vaya al menu Logistica > Categorías."
      :porDefecto="estado.dataForm.categoria"
      @update="(v) => (estado.dataForm.categoria = v)"
      :rules="[useRules.requerido()]"
      :dialog="formCategoria"
    />

    <!-- Imagen -->
    <input-image
      label="Imagen"
      info="Por favor elija una foto del producto solo, que se distinga claramente ante un fondo claro y unido. Prefiera un formato cuadrado."
      :dataPreview="estado.imagenPreview"
      :key="estado.imagenPreview"
      @update="
        (base64Data, mimetype) =>
          (estado.dataForm.imagen = base64Data
            ? { data: base64Data, mimetype: mimetype }
            : null)
      "
      icono="photo_camera"
    />

    <div class="">
      <q-checkbox v-model="estado.dataForm.puedeVencer" />
      Este producto tiene fecha de vencimiento
    </div>

    <div v-if="estado.dataForm.puedeVencer" class="flex">
      <input-text
        style="width: 50%"
        label="Primer aviso"
        tipo="number"
        :porDefecto="estado.dataForm.vencimientoLimite?.[0] ?? 0"
        @update="(v) => (estado.dataForm.vencimientoLimite[0] = v)"
        :rules="[useRules.requerido()]"
      />
      <!-- :porDefecto="'' + (store.producto.vencimientoLimite?.[0] ?? 0)" -->
      <input-text
        style="width: 50%"
        label="Segundo aviso"
        tipo="number"
        info="Cuando faltarán el número de días indicado en el primer campo, se lanzará una alerta naranja, y una alerta roja al llegar al números de días indicados en el segundo."
        :porDefecto="estado.dataForm.vencimientoLimite?.[1] ?? 0"
        @update="(v) => (estado.dataForm.vencimientoLimite[1] = v)"
        :rules="[useRules.requerido()]"
      />
    </div>

    <input-text
      tipo="textarea"
      label="comentario"
      info="Agregue cualquier información adicional que sea útil registrar junto con el producto."
      :porDefecto="estado.dataForm.comentario"
      @update="(v) => (estado.dataForm.comentario = v)"
    />
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
    edicion: Producto | null; // edicion si producto no es null, sino creacion
  }>(),
  {
    edicion: null,
  },
);

// datos por defecto del formulario
const initForm = {
  nombre: props.edicion?.nombre,
  categoria: props.edicion?.categoria?._id,
  comentario: props.edicion?.comentario,
  puedeVencer: props.edicion?.puedeVencer ?? false,
  vencimientoLimite: props.edicion?.vencimientoLimite ?? [0, 0],
  imagen: null,
};

// definicion del estado
const estado = reactive({
  dataForm: clone(initForm),
  errorNombre: '',
  imagenPreview: null,
});

// opciones
const selectCategoria = computed(() => {
  const options = [];
  if (store.categoriaArbol) {
    for (const cat of store.categoriaArbol.hijas) {
      options.push(<CategoriaSelectOpcion>{
        label: `${cat.nombre} (${cat.hijas.length})`,
        value: cat._id,
        disable: true,
        class: 'titulo',
      });
      for (const subcat of cat.hijas) {
        options.push(<CategoriaSelectOpcion>{
          label: subcat.nombre,
          value: subcat._id,
          class: 'option',
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
    await UrlToBase64Image(props.edicion.imagen.cloudinaryUrl, (base64Data) => {
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
    // Modo edicion
    if (props.edicion) {
      estado.dataForm.vencimientoLimite = {
        reemplazar: estado.dataForm.vencimientoLimite,
      };
      const producto = await api.modificarProducto_basico(
        props.edicion._id,
        estado.dataForm,
        { loading: true },
      );
      emits('modificarObjeto', producto);
    } else {
      const producto = await api.crearProducto_basico(estado.dataForm, {
        loading: true,
      });
      emits('crearObjeto', producto);
    }
  } catch (err) {
    if (isApiBadRequest(err, 'duplicado')) {
      estado.errorNombre = 'Ya existe un producto con este nombre';
      return;
    }
    errFallBack(err);
    return;
  }
  store.refreshProductos();
  estado.dataForm = clone(initForm);
};
</script>
