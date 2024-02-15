import { reactive, onMounted } from 'vue';
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

  const estado = reactive({
    ofertas: [],
    oferta: {
      _id: '',
      nombre: '',
      descripcion: '',
      precio: 0,
      grupos: [],
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
    },
    toogle: false,
    productoFijo: {
      ingredienteID: '',
      producto: '',
      presentacion: 0,
      import: '',
    },
    productos: [],
    catalogos: null,
    catalogo: {
      nombre: '',
      id: '',
    },
  });
  const obtenerTodasofertas = async () => {
    const { ofertaBuscar } = await ofertaService.buscarOfertas();
    // console.log(ofertaBuscar);
    estado.ofertas = ofertaBuscar;
    // storeOferta.oferta = ofertaBuscar;
    // console.log(estado.ofertas);
  };

  const crearOferta = async () => {
    console.log('first');
    const { _id, ingredientes, condiciones, preparados, ...ofertaData } =
      estado.oferta;
    const { ofertaCrear } = await ofertaService.crearOferta(ofertaData);
    if (ofertaCrear._id) {
      NotifySucessCenter('Oferta creada correctamente');
      estado.modal.isCreatedOferta = true;
      estado.oferta._id = ofertaCrear._id;
      storeOferta.isEdit = true;
      storeOferta.isEditIngrediente = true;
    }
  };

  const abrirModalIngredientes = () => {
    estado.modal.isAddIngredient = true;
  };
  const obtenerTodosProductos = async () => {
    const { productoBuscar } = await ofertaService.buscarProductos();
    console.log(productoBuscar);
    estado.productos = productoBuscar;
  };
  const crearIngredienteProducto = async () => {
    console.log(estado.oferta._id); //@ts-ignore
    console.log(estado.productoFijo.producto._id);
    console.log(estado.productoFijo.presentacion);
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
    estado.productoFijo.producto = '';
    estado.productoFijo.presentacion = 0;
  };
  const importarPresentacion = async () => {
    //@ts-ignore
    estado.productoFijo.presentacion = estado.productoFijo.import.cantidad;
    estado.modal.isImportPresentation = false;
    estado.productoFijo.import = '';
  };

  const abrirEditarOferta = (oferta: any) => {
    console.log('first');
    // estado.oferta.nombre = oferta.nombre;
    storeOferta.oferta = oferta;
    estado.oferta = oferta;
    storeOferta.isEdit = true;
    storeOferta.isEditIngrediente = true;

    router.push('ofertas/detailOferta');
  };

  const abrirAgregarOferta = () => {
    storeOferta.isEdit = false;
    storeOferta.isEditIngrediente = false;
    storeOferta.oferta = ''; //@ts-ignore
    estado.oferta = '';
  };

  const obtenerTodoCatalagos = async () => {
    const { catalogoArbol } = await ofertaService.buscarCatalogos();
    console.log(catalogoArbol);
    console.log(catalogoArbol);
    estado.catalogos = catalogoArbol;
  };
  const redirectCatalogoArbol = (catalogo: any) => {
    console.log(catalogo);
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
    await ofertaService.editarOferta(estado.oferta._id, ofertaData);
    NotifySucessCenter('Oferta editada correctamente');
  };
  const editarIngrediente = async (ingrediente: any) => {
    console.log(ingrediente);
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
      console.log(res); //@ts-ignore
      estado.oferta.ingredientes = estado.oferta.ingredientes.map(
        (ingrediente: any) => {
          return ingrediente._id === res[0]._id ? res[0] : ingrediente;
        },
      );
      console.log(estado.oferta.ingredientes);
      console.log(storeOferta.oferta.ingredientes);
      // const index = estado.oferta.ingredientes.findIndex(
      //   //@ts-ignore
      //   (p) => p._id === estado.productoFijo.producto._id,
      // );
      // if (index !== -1)
      //   //@ts-ignore
      //   estado.oferta.ingredientes[index] = estado.productoFijo.presentacion;
      console.log(estado.oferta.ingredientes);
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
    console.log(oferta);
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
  };
};
