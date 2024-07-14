<template>
  <q-form @submit="formSubmit">
    <!--h1 class="text-center bg-gray-300 font-bold py-[2px]">DATOS BASICOS</h1-->
    <p v-if="edicion === null" class="importante">
      <q-icon name="info" color="blue" size="30px" />
      Por favor, asegúrese bien que el producto todavía no existe ayudándose del
      buscador arriba de la lista de productos.
    </p>

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
      :opciones="estado.catOpciones"
      info="La categoría existe solamente a fines de ubicar facilmente el producto en administracion. Para crear una nueva categoria, vaya al menu Logistica > Categorías."
      :porDefecto="estado.dataForm.categoria"
      @update="(v) => (estado.dataForm.categoria = v)"
      :rules="[useRules.requerido()]"
      :dialog="formCategoria"
      @payload="handleCategoriaCreada"
    />

    <!-- Imagen -->
    <input-image
      label="Imagen"
      info="Por favor elija una foto del producto solo, que se distinga claramente ante un fondo claro y unido. Prefiera un formato cuadrado."
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
      Puede vencer ?
    </div>

    <div v-if="estado.dataForm.puedeVencer" class="flex">
      <input-text
        style="width: 50%"
        label="Primer aviso"
        :porDefecto="estado.dataForm.vencimientoLimite[0]"
        @update="(v) => (estado.dataForm.vencimientoLimite[0] = Number(v))"
        :rules="[useRules.requerido(), useRules.numero()]"
      />
      <!-- :porDefecto="'' + (store.producto.vencimientoLimite?.[0] ?? 0)" -->
      <input-text
        style="width: 50%"
        label="Segundo aviso"
        info="Cuando faltarán el número de días indicado en el primer campo, se lanzará una alerta naranja, y una alerta roja al llegar al números de días indicados en el segundo."
        :porDefecto="estado.dataForm.vencimientoLimite[1]"
        @update="(v) => (estado.dataForm.vencimientoLimite[1] = Number(v))"
        :rules="[useRules.requerido(), useRules.numero()]"
      />
    </div>

    <input-text
      tipo="textarea"
      label="comentario"
      info="Agregue cualquier información adicional que sea útil registrar junto con el producto."
      :porDefecto="estado.dataForm.comentario"
      @update="(v) => (estado.dataForm.comentario = v)"
    />
    <q-btn :label="edicion != null ? 'Guardar' : 'Crear'" type="submit" />
  </q-form>
</template>

<script setup lang="ts">
import type { Producto } from '#gql';
import type { selectOpcionCallback } from '~/components/input/select.interface';
import formCategoria from './formCategoria.vue';
import { useAlmacen } from '~/modulos2/almacen/almacen.composable';
const { categoriaSelectOptions } = useAlmacen();

// definicion de los emits
const emits = defineEmits<{
  (event: 'crear:producto', producto: Producto): void;
  (event: 'modificar:producto', producto: Producto): void;
  (
    event: 'crear:opcion',
    valor: string,
    objeto: any,
    callback: selectOpcionCallback,
  ): void;
}>();

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
});

// Inicializaciones
onMounted(async () => {
  estado.catOpciones = await categoriaSelectOptions();
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
      );
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits('modificar:producto', producto);
    }
    // Modo creacion
    else {
      // lanzamos la consulta
      const producto = await api.crearProducto_basico(estado.dataForm);
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits('crear:producto', producto);
      // ... y especialmente para un eventual input select para insertar la nueva opcion
      emits('crear:opcion', producto._id, producto, (listaOpciones) => [
        ...listaOpciones,
        { label: producto.nombre, value: producto._id },
      ]);
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

// manejar la categoria creada desde el boton + del select
const handleCategoriaCreada = (categoria: any) => {
  console.log('categoria creada via select:', categoria);
  // logica para hacer algo aqui
  // tal vez se querra mandar la marca al componiente padre para
  // que él lo agregue al store, al estado o al indexdb ?
};
</script>
