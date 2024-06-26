import { reactive, onMounted, ref, watch } from 'vue';
import { NotifySucessCenter } from '~/helpers/message.service';
import { ofertaService } from '~/services/ofertas.service';
import { ofertaStore } from '@/stores/oferta.store';
import { useRouter } from 'vue-router';
import { ca, da, es, id } from 'date-fns/locale';
import { useQuasar } from 'quasar';
import { fileToBase64 } from '~/helpers/helpers';

export const useOferta = () => {
  const storeOferta = ofertaStore();
  const router = useRouter();
  const $q = useQuasar();
  const pruebaProducto = ref('');

  const estado = reactive({
    ofertas: [],
    oferta: {
      _id: '',
      nombre: '',
      abreviacion: '',
      descripcion: '',
      precio: 0,
      catalogo: '',
      catalogoNombre: '',
      ingredientes: [],
      preparados: [],
      condiciones: [],
    },
    modal: {
      isAddOferta: false,
      isCreatedOferta: false,
      isAddIngredient: false,
      isAddIngredientProduct: false,
      isImportPresentation: false,
      isAddCatalogo: false,
      isEditIngrediente: false,
      isShowCatalogo: false,

      esOfertaBasicas: false,
      esOfertaProductos: false,
      esDetalleOferta: false,
    },
    toogle: false,
    productoFijo: {
      ingredienteID: '',
      producto: {
        _id: '',
        nombre: '',
        presentacionBasica: '',
        presentaciones: [],
      },
      presentacion: 0,
      import: '',
    },
    productos: [],
    catalogos: null,
    catalogo: {
      nombre: '',
      id: '',
    },
    catalogoSeleccionado: [],
  });
  const imagen = ref(null);
  const selectedFile = ref('');
  const imagePreview = ref('');

  // FILTER PRODUCTOS
  const optionsProducts = ref(estado.productos);
  console.log(optionsProducts.value);

  const clearOferta = {
    _id: '',
    nombre: '',
    abreviacion: '',
    descripcion: '',
    precio: 0,
    catalogo: '',
    idIngrediente: '',
    producto: {
      _id: '',
      nombre: '',
      presentacionBasica: '',
      presentaciones: [],
    },
    cantidad: 0,
    imagen: '',
  };
  const obtenerTodasOfertas = async () => {
    estado.ofertas = await ofertaService.obtenerTodasOfertas();
  };
  // const

  const crearOferta = async () => {
    const {
      _id,
      ingredientes,
      condiciones,
      preparados,
      catalogoNombre, //@ts-ignore
      idIngrediente, //@ts-ignore
      imagen,
      ...ofertaData
    } = estado.oferta;
    const imagenCvt = await fileToBase64(selectedFile.value);
    // console.log(ofertaData);

    const nuevaOferta = await ofertaService.crearOferta({
      ...ofertaData,
      imagen: {
        mimetype: 'image/png',
        data: imagenCvt,
      },
    });
    if (nuevaOferta._id) {
      await ofertaService.crearIngredienteProducto(
        nuevaOferta._id, //@ts-ignore
        estado.productoFijo.producto._id, //@ts-ignore
        estado.productoFijo.presentacion,
      );
      NotifySucessCenter('Oferta creada correctamente');
      estado.modal.isCreatedOferta = true;
      storeOferta.isEdit = true;
      storeOferta.isEditIngrediente = true;
      router.push('/cathering/sede/ofertas');
    }
  };

  const abrirModalIngredientes = () => {
    estado.modal.isAddIngredient = true;
  };
  const obtenerTodosProductos = async () => {
    const productos = await ofertaService.buscarProductos();
    estado.productos = productos;
    optionsProducts.value = productos;
  };
  const crearIngredienteProducto = async () => {
    // console.log(estado.oferta._id); //@ts-ignore
    // console.log(estado.productoFijo.producto._id);
    // console.log(estado.productoFijo.presentacion);
    const ingredienteCreado = await ofertaService.crearIngredienteProducto(
      estado.oferta._id, //@ts-ignore
      estado.productoFijo.producto._id, //@ts-ignore
      estado.productoFijo.presentacion,
    );
    // console.log(res);
    if (ingredienteCreado)
      NotifySucessCenter('Ingrediente creado correctamente'); //@ts-ignore
    estado.oferta.ingredientes.push(ingrediente);
    estado.modal.isAddIngredientProduct = false;
    // estado.productoFijo.producto = '';
    estado.productoFijo.presentacion = 0;
  };
  const importarPresentacion = async () => {
    //@ts-ignore
    estado.productoFijo.presentacion = estado.productoFijo.import.cantidad;
    estado.modal.isImportPresentation = false;
    estado.productoFijo.import = '';
  };

  const abrirEditarOferta = (oferta: any) => {
    // console.log(oferta);
    storeOferta.oferta.idIngrediente = oferta.ingredientes[0]._id;
    storeOferta.oferta._id = oferta._id;
    storeOferta.oferta.nombre = oferta.nombre;
    storeOferta.oferta.abreviacion = oferta.abreviacion;
    storeOferta.oferta.descripcion = oferta.descripcion;
    storeOferta.oferta.precio = oferta.precio;
    storeOferta.oferta.catalogo = oferta.catalogo._id;
    storeOferta.oferta.producto = oferta.ingredientes[0].producto;
    storeOferta.oferta.cantidad = oferta.ingredientes[0].cantidad;
    if (oferta.imagen !== null) {
      storeOferta.oferta.imagen = oferta.imagen.cloudinaryUrl;
    } else {
      storeOferta.oferta.imagen = '';
    }

    storeOferta.isEdit = true;
    storeOferta.isEditIngrediente = true;

    router.push('ofertas/detailOferta');
  };

  const abrirAgregarOferta = () => {
    storeOferta.isEdit = false;
    storeOferta.isEditIngrediente = false;
    storeOferta.oferta = clearOferta; //@ts-ignore
    estado.oferta = '';
  };

  const obtenerTodoCatalagos = async () => {
    const catalogoArbol = await ofertaService.buscarCatalogos();
    estado.catalogos = catalogoArbol;
    // console.log(estado.catalogos);
    // console.log(catalogoArbol);
    estado.catalogoSeleccionado = catalogoArbol?.hijas[0];
    estado.oferta.catalogo = catalogoArbol?.hijas[0];
  };
  const obtenerTodoCatalagosIdNombre = async () => {
    const catalogoArbol = await ofertaService.buscarCatalogosIdNombre();
    estado.catalogos = catalogoArbol;
    // console.log(catalogoArbol);
    estado.catalogoSeleccionado = catalogoArbol?.hijas[0];
    estado.oferta.catalogo = catalogoArbol?.hijas[0];

    //@ts-ignore
    if (estado.catalogoSeleccionado?._id) {
      const ofertas = await ofertaService.catalogoRecursivo(
        //@ts-ignore
        estado.catalogoSeleccionado._id,
      );
      if (ofertas) estado.ofertas = ofertas;
    }
  };
  const handleSelectionChange = async (catalogo: any) => {
    // console.log(catalogo);
    const ofertas = await ofertaService.catalogoRecursivo(
      //@ts-ignore
      catalogo._id,
    );
    if (ofertas) estado.ofertas = ofertas;
  };

  const obtenerCatalogoId = async (catalogoId: string) => {
    const catalogoArbol = await ofertaService.buscarCatalogoID(catalogoId);
    //@ts-ignore
    if (catalogoArbol) estado.catalogoSeleccionado = [catalogoArbol];
  };

  const redirectCatalogoArbol = (catalogo: any) => {
    // console.log(catalogo);
    // console.log(catalogo);
    // storeOferta.catalogoElegido = [catalogo];
    router.push('catalogos/' + catalogo._id);
  };
  const crearCatalogo = async () => {
    await ofertaService.crearCatalogo(
      estado.catalogo.nombre, //@ts-ignore
      estado.catalogos._id,
    );
    estado.modal.isAddCatalogo = false;
    estado.catalogo.nombre = '';
    NotifySucessCenter('Catalogo creado correctamente');
    obtenerTodoCatalagos();
  };

  const modalCrearCategoriaArbol = (data: any) => {
    estado.modal.isAddCatalogo = true;
    estado.catalogo.id = data._id;
  };

  const crearCatalogoArbol = async (catalogoId: string) => {
    await ofertaService.crearCatalogo(
      estado.catalogo.nombre, //@ts-ignore
      estado.catalogo.id,
    );
    estado.modal.isAddCatalogo = false;
    estado.catalogo.nombre = '';
    estado.catalogo.id = '';
    obtenerCatalogoId(catalogoId);
    NotifySucessCenter('Catalogo creado correctamente');
  };
  const editarOferta = async () => {
    const {
      //@ts-ignore
      _creado,
      _id,
      condiciones,
      ingredientes,
      preparados,
      catalogoNombre, //@ts-ignore
      imagen, //@ts-ignore
      idIngrediente,
      ...ofertaData
    } = estado.oferta;

    // console.log(selectedFile.value);
    if (selectedFile.value === '') {
      const ofertaModificada = await ofertaService.editarOferta(
        estado.oferta._id,
        ofertaData,
      );
      if (ofertaModificada) {
        const ingredienteModificado =
          await ofertaService.editarIngredienteProducto(
            estado.oferta._id, //@ts-ignore
            estado.productoFijo.ingredienteID, //@ts-ignore
            estado.productoFijo.producto._id,
            estado.productoFijo.presentacion,
          );
      }
    } else {
      const ofertaModificada = await ofertaService.editarOferta(
        estado.oferta._id,
        {
          ...ofertaData,
          imagen: {
            mimetype: 'image/png',
            data: await fileToBase64(selectedFile.value),
          },
        },
      );
      if (ofertaModificada) {
        const ingredienteModificado =
          await ofertaService.editarIngredienteProducto(
            estado.oferta._id, //@ts-ignore
            estado.productoFijo.ingredienteID, //@ts-ignore
            estado.productoFijo.producto._id,
            estado.productoFijo.presentacion,
          );
      }
    }

    NotifySucessCenter('Oferta editada correctamente');
    router.push('/cathering/sede/ofertas');
  };
  const editarIngrediente = async (ingrediente: any) => {
    // console.log(ingrediente);
    storeOferta.isEdit = true;
    if (ingrediente._tipo === 'IngredienteProducto') {
      estado.modal.isAddIngredientProduct = true;
      estado.productoFijo.producto = ingrediente.producto;
      estado.productoFijo.presentacion = ingrediente.cantidad;
      estado.productoFijo.ingredienteID = ingrediente._id;
      // estado.productoFijo.import = ingrediente.;
      // console.log(estado.oferta._id);
      // console.log(estado.productoFijo);
      // console.log(ingrediente._id);
      // await ofertaService.editarIngredienteProducto(
      //   estado.oferta._id,
      //   ingrediente._id,
      //   estado.productoFijo.producto,
      //   estado.productoFijo.presentacion,
      // );
    }
    // console.log('first');
  };
  const editarIngredienteProducto = async () => {
    // console.log(estado.oferta._id);
    // console.log(estado.productoFijo.ingredienteID);
    // console.log(estado.productoFijo.producto);
    // console.log(estado.productoFijo.presentacion);
    const { ofertaModificarIngredienteProducto: res } =
      await ofertaService.editarIngredienteProducto(
        estado.oferta._id, //@ts-ignore
        estado.productoFijo.ingredienteID, //@ts-ignore
        estado.productoFijo.producto._id,
        estado.productoFijo.presentacion,
      );
    if (res) {
      //@ts-ignore
      estado.oferta.ingredientes = estado.oferta.ingredientes.map(
        (ingrediente: any) => {
          return ingrediente._id === res[0]._id ? res[0] : ingrediente;
        },
      );
      // console.log(estado.oferta.ingredientes);
      // console.log(storeOferta.oferta.ingredientes);
      // const index = estado.oferta.ingredientes.findIndex(
      //   //@ts-ignore
      //   (p) => p._id === estado.productoFijo.producto._id,
      // );
      // if (index !== -1)
      //   //@ts-ignore
      //   estado.oferta.ingredientes[index] = estado.productoFijo.presentacion;
      // console.log(estado.oferta.ingredientes);
      NotifySucessCenter('IngredienteProducto editado correctamente');
      estado.modal.isAddIngredientProduct = false;
    }
    // storeOferta.oferta.ingredientes
  };
  const test = () => {
    estado.modal.isAddIngredientProduct = true;
    storeOferta.isEdit = false;
  };
  const borrarOferta = async (oferta: any) => {
    // console.log(oferta);
    $q.dialog({
      title: `Eliminar ${oferta.nombre}`,
      message: '¿Está seguro de eliminar esta oferta?',
      cancel: true,
      persistent: true,
    }).onOk(async () => {
      await ofertaService.borrarOferta(oferta._id);
      NotifySucessCenter('Oferta eliminado correctamente');
      obtenerTodasOfertas();
    });
  };
  const abrirModalCatalogo = (catalogo: any) => {
    // console.log(catalogo);
    // console.log(catalogo);
    estado.modal.isShowCatalogo = true;
    estado.catalogoSeleccionado = catalogo;
  };
  const elegirCatalogo = (item: { _id: string; nombre: string }) => {
    estado.oferta.catalogo = item._id;
    estado.oferta.catalogoNombre = item.nombre;

    estado.modal.isShowCatalogo = false;
  };
  function calcularTotalOfertas(catalogo: any) {
    const total = catalogo
      .map((hija: any) => hija.hijas.length)
      .reduce((a: any, b: any) => a + b, 0);
    return total;
  }

  //WATCH
  watch(imagen, () => {
    //@ts-ignore
    if (imagen.value instanceof Blob) {
      const lector = new FileReader();
      selectedFile.value = imagen.value;

      lector.addEventListener('load', () => {
        //@ts-ignore
        imagePreview.value = lector.result;
      }); //@ts-ignore
      lector.readAsDataURL(selectedFile.value);
    }
  });

  const filterProductos = (val: any, update: any) => {
    update(() => {
      let needle = val.toLowerCase();
      optionsProducts.value = estado.productos.filter((item: any) =>
        item.nombre.toLowerCase().includes(needle),
      );
    });
  };

  return {
    estado,
    crearOferta,
    obtenerTodasOfertas,
    abrirModalIngredientes,
    obtenerTodosProductos,
    crearIngredienteProducto,
    importarPresentacion,
    storeOferta,
    abrirEditarOferta,
    abrirAgregarOferta,
    obtenerTodoCatalagos,
    redirectCatalogoArbol,
    crearCatalogo,
    crearCatalogoArbol,
    modalCrearCategoriaArbol,
    editarOferta,
    editarIngrediente,
    editarIngredienteProducto,
    test,
    borrarOferta,
    abrirModalCatalogo,
    elegirCatalogo,
    pruebaProducto,
    obtenerCatalogoId,
    calcularTotalOfertas,
    imagen,
    imagePreview,
    selectedFile,
    obtenerTodoCatalagosIdNombre,
    handleSelectionChange,
    optionsProducts,
    filterProductos,
  };
};
