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
    <input-text2
      label="Nombre"
      info="Por favor antes de crear un producto, asegúrese que no existe todavá. Ayúdese del buscador de la tabla."
      :porDefecto="estado.dataForm.nombre"
      @update="(v) => (estado.dataForm.nombre = v)"
      :rules="[useRules.requerido()]"
      :error="estado.errorNombre"
    />

    <!-- Categoria -->
    <input-select2
      label="Categoria"
      :opciones="estado.catOpciones"
      info="La categoría existe solamente a fines de ubicar facilmente el producto en administracion. Para crear una nueva categoria, vaya al menu Logistica > Categorías."
      :porDefecto="estado.dataForm.categoria"
      @update="(v) => (estado.dataForm.categoria = v)"
      :rules="[useRules.requerido()]"
      :dialog="formCategoria"
    />

    <!-- Imagen -->
    <input-image2
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
      <input-text2
        style="width: 50%"
        label="Primer aviso"
        :porDefecto="estado.dataForm.vencimientoLimite[0]"
        @update="(v) => (estado.dataForm.vencimientoLimite[0] = Number(v))"
        :rules="[useRules.requerido(), useRules.numero()]"
      />
      <!-- :porDefecto="'' + (store.producto.vencimientoLimite?.[0] ?? 0)" -->
      <input-text2
        style="width: 50%"
        label="Segundo aviso"
        info="Cuando faltarán el número de días indicado en el primer campo, se lanzará una alerta naranja, y una alerta roja al llegar al números de días indicados en el segundo."
        :porDefecto="estado.dataForm.vencimientoLimite[1]"
        @update="(v) => (estado.dataForm.vencimientoLimite[1] = Number(v))"
        :rules="[useRules.requerido(), useRules.numero()]"
      />
    </div>

    <input-text2
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
import type { SelectOpcion } from '~/components/input/select.interface';
import formCategoria from './formCategoria.vue';
import { useAlmacen } from '~/modulos2/almacen/almacen.composable';
import { UrlToBase64Image } from '~/components/input/input.service';
const { categoriaSelectOptions } = useAlmacen();

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
  nombre: props.edicion?.nombre ?? '',
  categoria: props.edicion?.categoria?._id ?? '',
  comentario: props.edicion?.comentario ?? '',
  puedeVencer: props.edicion?.puedeVencer ?? false,
  vencimientoLimite: props.edicion?.vencimientoLimite ?? [0, 0],
  imagen: null,
};

// definicion del estado
const estado = reactive({
  // valor de los inputs
  dataForm: clone(initForm),
  //mensajes de error del formulario
  errorNombre: '',
  // lista de opciones para el select de categorias
  catOpciones: [],
  // preview de la imagen en el input
  imagenPreview: null,
});

// Inicializaciones
onMounted(async () => {
  estado.catOpciones = await categoriaSelectOptions();
  // recuperamos la imagen desde la url
  if (props.edicion.imagen?.cloudinaryUrl) {
    await UrlToBase64Image(
      props.edicion.imagen?.cloudinaryUrl,
      (base64Data) => {
        estado.imagenPreview = base64Data;
      },
    );
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
      // lanzamos la consulta
      estado.dataForm.vencimientoLimite = {
        reemplazar: estado.dataForm.vencimientoLimite,
      };
      const producto = await api.modificarProducto_basico(
        props.edicion._id,
        estado.dataForm,
        { loading: true },
      );
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits('modificarObjeto', producto);
    }
    // Modo creacion
    else {
      // lanzamos la consulta
      const producto = await api.crearProducto_basico(estado.dataForm, {
        loading: true,
      });
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits('crearObjeto', producto, {
        selectValor: producto._id,
        selectCallback: (listaOpciones: SelectOpcion[]): SelectOpcion[] => [
          ...listaOpciones,
          { label: producto.nombre, value: producto._id },
        ],
      });
    }
  } catch (err) {
    if (isApiBadRequest(err, 'duplicado')) {
      estado.errorNombre = 'Ya existe un producto con este nombre';
      return;
    }
    errFallBack(err);
    return;
  }
};
</script>
