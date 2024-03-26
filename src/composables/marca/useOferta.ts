import { reactive, onMounted, ref } from 'vue';
import { NotifySucessCenter } from '~/helpers/message.service';
import { ofertaService } from '~/services/marca/ofertas.service';
import { ofertaStore } from '@/stores/oferta.store';
import { useRouter } from 'vue-router';
import { da, es } from 'date-fns/locale';
import { useQuasar } from 'quasar';

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
      descripcion: '',
      precio: 0,
      catalogo: '',
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
    catalogoSeleccionado: null,
  });

  const clearOferta = {
    _id: '',
    nombre: '',
    descripcion: '',
    precio: 0,
    catalogo: '',
    producto: {
      _id: '',
      nombre: '',
      presentacionBasica: '',
      presentaciones: [],
    },
    cantidad: 0,
  };
  const obtenerTodasofertas = async () => {
    const { ofertaBuscar } = await ofertaService.buscarOfertas();
    estado.ofertas = ofertaBuscar;
    // console.log(estado.ofertas);
    // OBTENER CATALOGOS
  };

  const crearOferta = async () => {
    const { _id, ingredientes, condiciones, preparados, ...ofertaData } =
      estado.oferta;
    console.log(ofertaData);
    const { ofertaCrear } = await ofertaService.crearOferta(ofertaData);
    console.log(ofertaCrear);
    if (ofertaCrear._id) {
      await ofertaService.crearIngredienteProducto(
        ofertaCrear._id, //@ts-ignore
        estado.productoFijo.producto._id, //@ts-ignore
        estado.productoFijo.presentacion,
      );
      NotifySucessCenter('Oferta creada correctamente');
      estado.modal.isCreatedOferta = true;
      storeOferta.isEdit = true;
      storeOferta.isEditIngrediente = true;
      router.push('/sede/ofertas');
    }
    // if (ofertaCrear._id) {
    //   NotifySucessCenter('Oferta creada correctamente');
    //   estado.modal.isCreatedOferta = true;
    //   estado.oferta._id = ofertaCrear._id;
    //   storeOferta.isEdit = true;
    //   storeOferta.isEditIngrediente = true;
    // }
  };

  const abrirModalIngredientes = () => {
    estado.modal.isAddIngredient = true;
  };
  const obtenerTodosProductos = async () => {
    const { productoBuscar } = await ofertaService.buscarProductos();
    // console.log(productoBuscar);
    estado.productos = productoBuscar;
  };
  const crearIngredienteProducto = async () => {
    // console.log(estado.oferta._id); //@ts-ignore
    // console.log(estado.productoFijo.producto._id);
    // console.log(estado.productoFijo.presentacion);
    const { ofertaCrearIngredienteProducto } =
      await ofertaService.crearIngredienteProducto(
        estado.oferta._id, //@ts-ignore
        estado.productoFijo.producto._id, //@ts-ignore
        estado.productoFijo.presentacion,
      );
    // console.log(res);
    if (ofertaCrearIngredienteProducto)
      NotifySucessCenter('Ingrediente creado correctamente'); //@ts-ignore
    estado.oferta.ingredientes.push(ofertaCrearIngredienteProducto);
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
    console.log(oferta);
    storeOferta.oferta._id = oferta._id;
    storeOferta.oferta.nombre = oferta.nombre;
    storeOferta.oferta.descripcion = oferta.descripcion;
    storeOferta.oferta.precio = oferta.precio;
    storeOferta.oferta.catalogo = oferta.catalogo._id;
    storeOferta.oferta.producto = oferta.ingredientes[0].producto;
    storeOferta.oferta.cantidad = oferta.ingredientes[0].cantidad;
    console.log(storeOferta.oferta);

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
    const { catalogoArbol } = await ofertaService.buscarCatalogos();
    estado.catalogos = catalogoArbol;
    // console.log(catalogoArbol);
  };
  const redirectCatalogoArbol = (catalogo: any) => {
    // console.log(catalogo);
    // console.log(catalogo);
    storeOferta.catalogoElegido = [catalogo];
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

  const crearCatalogoArbol = async () => {
    // console.log(estado.catalogo);
    await ofertaService.crearCatalogo(
      estado.catalogo.nombre, //@ts-ignore
      estado.catalogo.id,
    );
    // obtenerTodoCatalagos();
    estado.modal.isAddCatalogo = false;
    estado.catalogo.nombre = '';
    estado.catalogo.id = '';
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
      ...ofertaData
    } = estado.oferta;
    console.log(ofertaData);
    console.log(estado.productoFijo);
    await ofertaService.editarOferta(estado.oferta._id, ofertaData);
    // const { ofertaModificarIngredienteProducto: res } =
    // await ofertaService.editarIngredienteProducto(
    //   estado.oferta._id, //@ts-ignore
    //   estado.productoFijo.ingredienteID, //@ts-ignore
    //   estado.productoFijo.producto._id,
    //   estado.productoFijo.presentacion,
    // );
    // console.log(res);
    NotifySucessCenter('Oferta editada correctamente');
    router.push('/sede/ofertas');
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
      obtenerTodasofertas();
    });
  };
  const abrirModalCatalogo = (catalogo: any) => {
    // console.log(catalogo);
    // console.log(catalogo);
    estado.modal.isShowCatalogo = true;
    estado.catalogoSeleccionado = catalogo;
    console.log(estado.catalogoSeleccionado);
  };
  const elegirCatalogo = (catalogoID: string) => {
    console.log(catalogoID);
    estado.oferta.catalogo = catalogoID;
    estado.modal.isShowCatalogo = false;
    // const valor = '2';
    // estado.oferta.catalogo = valor;
  };

  //on mounted
  // onMounted(() => {
  //   obtenerTodasofertas();
  // });
  return {
    estado,
    crearOferta,
    obtenerTodasofertas,
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
  };
};
