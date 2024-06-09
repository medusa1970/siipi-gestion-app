import { onMounted, reactive, ref, watch } from 'vue';
import {
  ApiError,
  NotifyError,
  NotifySucess,
  NotifySucessCenter,
} from '@/helpers/message.service';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { productStore } from '@/stores/producto.store';
import { productoService } from '~/services/sede/producto.service';
import type { Presentacion, Product } from '@/interfaces/product.interface';
import { ofertaStore } from '@/stores/oferta.store';
import { fileToBase64 } from '@/helpers/helpers';

export const useProducts = () => {
  const useProduct = productStore();
  const router = useRouter();
  const $q = useQuasar();
  const storeOferta = ofertaStore();

  const estado = reactive({
    test: false,
    modal: {
      isProve: false,
      isEditProduct: false,
      isAddPrueba: false,
      isAddPresentation: false,
      isAddCategory: false,
      isAddCategoryArbol: false,
      isAddProducts: false,
      // NEW
      isAddProduct: false,
      esCrearMarcaProducto: false,
      esCrearMedidaProducto: false,
      isAddProveedor: false,
      isDetailProduct: false,
      isAddEmpaque: false,
      esCrearMarca: false,
      esCrearMedida: false,
      esCrearEmpaque: false,
      esMostrarInformacionProducto: false,
      mostrarImagen: false,
    },
    productos: [],
    producto: <Product>{
      nombre: '',
      comentario: '',
      presentacionBasica: '',
      presentaciones: [{ nombre: '', cantidad: 0 }],
      categoria: { _id: '', nombre: '' },
    },
    presentacion: <Presentacion>{
      _id: '',
      nombre: '',
      cantidad: 0,
    },
    presentacionNombre: '',
    dialog: {
      isAddPresentation: false,
      isEditPresentation: false,
      isTest: false,
    },
    categorias: [],
    inputCategoria: '',
    productoIDselect: '',
    categoriaArbol: null,
    props: [],
    categoriaNombre: '',
    categoria: {
      nombre: '',
      pariente: '',
    },
    categoriaFija: {
      categoria: '',
      hijas: '',
    },
    isEditCantidad: false,
    tab: 'datosBasicos',
    marcas: [],
    marcaProducto: {
      marca: {
        _id: '',
        nombre: '',
      },
      minimo: '',
      maximo: '',
    },
    medidas: [],
    medidaProducto: {
      medida: {
        _id: '',
        nombre: '',
        tipoEmpaques: [
          {
            nombre: '',
            abreviacion: '',
          },
        ],
      },
      empaque: {
        nombre: '',
        abreviacion: '',
      },
      marca: {
        _id: '',
        nombre: '',
      },
      cantidad: 0,
    },
  });
  const producto = reactive({
    productoID: '',
    datosBasicos: {
      nombre: '',
      categoria: { _id: '', nombre: '' },
      comentario: '',
      tiempoVida: '',
      imagen: '',
    },
    informacion: [],
    imagenSrc: '',
  });
  const imagen = ref(null);
  const selectedFile = ref('');
  const imagePreview = ref('');
  const nombre = ref('');

  // IMAGEN MARCA
  const imagenMarca = ref(null);
  const selectedFileMarca = ref('');
  const imagePreviewMarca = ref('');

  const tags = ['empanadas', 'Masas', 'Embutidos', 'pedazos'];

  const getAllProductos = async () => {
    const productos = await productoService.buscarProductos();
    estado.productos = productos;
  };
  const getCategoria = async () => {
    const categoriaArbol = await productoService.obtenerTodasCategorias();
    estado.categorias = categoriaArbol;
  };

  const borrarProducto = (row: { _id: string; nombre: string }) => {
    $q.dialog({
      title: `Eliminar ${row.nombre}`,
      message: '¿Está seguro de eliminar este producto?',
      cancel: true,
      persistent: true,
    }).onOk(async () => {
      await productoService.borrarProducto(row._id);
      NotifySucess('Producto eliminado correctamente');
      getAllProductos();
    });
  };

  const navegarDetalleProducto = (row: any) => {
    useProduct.product = row;
    estado.producto = row;
    useProduct.isEdit = true;
    if (row.imagen) imagePreview.value = row.imagen.cloudinaryUrl;
    // imagePreview.value = row.imagen?.cloudinaryUrl ?? imagePreview.value;
  };
  const modalAgregarProducto = () => {
    // router.push('productos/detailProduct');
    useProduct.isEdit = false;
    useProduct.product = {
      _id: '',
      nombre: '',
      comentario: '',
      presentacionBasica: '',
      presentaciones: [],
      categoria: { _id: '', nombre: '' },
    };
  };
  //STORE
  if (useProduct.product) {
    // console.log(useProduct.product);
    estado.producto = useProduct.product; //@ts-ignore
    if (useProduct.product.imagen)
      //@ts-ignore
      imagePreview.value = useProduct.product.imagen.cloudinaryUrl;
  }

  // AGREGAR PRODUCTO
  const agregarProducto = async () => {
    console.log('first');
    delete estado.producto._id; //@ts-ignore
    delete estado.producto.categoria.productos;
    const imagenCvt = await fileToBase64(selectedFile.value);
    console.log(imagenCvt);

    productoService
      .agregarProducto({
        ...estado.producto,
        categoria: estado.producto.categoria._id,
        imagen: {
          mimetype: 'image/png',
          data: imagenCvt,
        },
      })
      .then((res) => {
        NotifySucessCenter('Producto agregado correctamente');
        router.push('/cathering/sede/productos');
      });
  };
  const editProductBasicInfo = async () => {
    //@ts-ignore
    delete estado.producto.categoria.productos;
    //@ts-ignore
    const { presentaciones, _creado, _id, nombre, imagen, ...productoData } =
      estado.producto;
    console.log(selectedFile.value);

    if (useProduct.product._id) {
      if (selectedFile.value === '') {
        const productoModificado = await productoService.editarProducto(
          useProduct.product._id,
          {
            ...productoData,
            categoria: productoData.categoria._id,
          },
        );
        estado.producto = Object.assign(estado.producto, productoModificado);
      } else {
        const imagenCvt = await fileToBase64(selectedFile.value);
        const productoModificado = await productoService.editarProducto(
          useProduct.product._id,
          {
            ...productoData,
            categoria: productoData.categoria._id,
            imagen: {
              mimetype: 'image/png',
              data: imagenCvt,
            },
          },
        );
        estado.producto = Object.assign(estado.producto, productoModificado);
      }
      NotifySucess('información básica actualizada correctamente');
    }
  };
  const modalAgregarPresentacion = () => {
    estado.dialog.isAddPresentation = true;
    estado.presentacion = {
      _id: '',
      nombre: '',
      cantidad: 0,
    };
  };

  //CRUD
  const agregarPresentacion = async () => {
    if (useProduct.isEdit) {
      const nuevaPresentacion = await productoService.agregarPresentacion(
        useProduct.product._id,
        estado.presentacion.nombre,
        estado.presentacion.cantidad,
      );
      if (nuevaPresentacion) {
        estado.producto.presentaciones.push(nuevaPresentacion);
      }
      NotifySucess('presentacion agregado correctamente');
      estado.dialog.isAddPresentation = false;
    } else {
      estado.producto.presentaciones.push({
        nombre: estado.presentacion.nombre,
        cantidad: estado.presentacion.cantidad,
      });
      estado.dialog.isAddPresentation = false;
    }
  };
  const modalEditarPresentacion = (p: Presentacion) => {
    estado.dialog.isAddPresentation = true;
    estado.dialog.isEditPresentation = true;
    estado.presentacion._id = p._id;
    estado.presentacion.nombre = p.nombre;
    estado.presentacion.cantidad = p.cantidad;
    estado.presentacionNombre = p.nombre;
  };
  const modificarPresentacion = async () => {
    if (useProduct.isEdit) {
      const presentacionModificada = await productoService.editarPresentacion(
        useProduct.product._id,
        estado.presentacionNombre,
        estado.presentacion,
      );
      if (presentacionModificada) {
        const index = estado.producto.presentaciones.findIndex(
          (p) => p._id === estado.presentacion._id,
        );
        if (index !== -1)
          estado.producto.presentaciones[index] = estado.presentacion;
      }
      NotifySucess('Presentacion modificado correctamente');
      estado.dialog.isAddPresentation = false;
      estado.dialog.isEditPresentation = false;

      estado.presentacion = {
        _id: '',
        nombre: '',
        cantidad: 0,
      };
    } else {
      const index = estado.producto.presentaciones.findIndex(
        (p) => p.nombre === estado.presentacionNombre,
      );
      if (index !== -1) {
        estado.producto.presentaciones[index] = estado.presentacion;
      }
      estado.presentacion = {
        _id: '',
        nombre: '',
        cantidad: 0,
      };
      estado.dialog.isEditPresentation = false;
      estado.dialog.isAddPresentation = false;
    }
  };
  const borrarPresentacion = async (presentacion: Presentacion) => {
    if (useProduct.isEdit) {
      $q.dialog({
        title: `Eliminar ${presentacion.nombre}`,
        message: '¿Está seguro de eliminar esta presentacion?',
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        const res = await productoService.borrarPresentacion(
          useProduct.product._id,
          presentacion.nombre,
        );
        NotifySucess('Presentacion eliminado correctamente');
        if (res) {
          const index = estado.producto.presentaciones.findIndex(
            (p) => p._id === presentacion._id,
          );
          if (index !== -1) {
            estado.producto.presentaciones.splice(index, 1);
          }
        }
      });
    } else {
      const index = estado.producto.presentaciones.findIndex(
        (p) => p.nombre === presentacion.nombre,
      );
      if (index !== -1) {
        estado.producto.presentaciones.splice(index, 1);
      }
    }
  };

  const cambiarCategoria = (row: any) => {
    estado.productoIDselect = row._id;
    estado.modal.isAddCategory = true;
    // estado.inputCategoria = row.categoria.nombre;
  };

  const guardarCategoria = async () => {
    await productoService.productoCambiarCategoria(
      estado.productoIDselect, //@ts-ignore
      estado.categoriaFija.hijas._id,
    );
    estado.categoriaFija.hijas = '';
    estado.modal.isAddCategory = false;
    NotifySucessCenter('Categoria cambiada correctamente');
    getAllProductos();
  };

  const obtenerTodasCategorias = async () => {
    const categoriaArbol = await productoService.obtenerTodasCategorias();
    estado.categoriaArbol = [categoriaArbol];
    const data = [
      {
        label: categoriaArbol.nombre,
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        children: categoriaArbol.hijas.map((hija: any) => ({
          icon: 'room_service',
          label: hija.nombre,
          children: hija.hijas.map((hija2: any) => ({
            label: hija2.nombre,
          })),
        })),
      },
    ]; //@ts-ignore
    estado.props = data;
  };
  const agregarCategoriaArbol = async () => {
    const nuevaCategoria = await productoService.crearCategoria(
      estado.categoria.pariente,
      estado.categoria.nombre,
    );
    NotifySucessCenter('Categoria agregada correctamente');
    estado.modal.isAddCategoryArbol = false;
    obtenerTodasCategorias();
  };
  const modalAgregarCategoria = (data: { _id: string }) => {
    estado.modal.isAddCategoryArbol = true;
    estado.categoria.pariente = data._id;
  };
  const navegarCrearOferta = (producto: any) => {
    storeOferta.oferta._id = '';
    storeOferta.oferta.nombre = '';
    storeOferta.oferta.descripcion = '';
    storeOferta.oferta.precio = 0;
    storeOferta.oferta.catalogo = '';
    storeOferta.isEdit = false;

    let { categoria, comentario, ...productoData } = producto;
    storeOferta.oferta.producto = productoData;
  };

  const editarDatosBasicos = async () => {
    console.log(producto.datosBasicos);
    const imagenCvt = await fileToBase64(selectedFile.value);
    console.log(imagenCvt);
  };

  // NUEVO
  /**
   * CRUD PRODUCTOS
   */
  const crearProductoBasico = async () => {
    const imagenCvt = await fileToBase64(selectedFile.value);
    const res = await productoService.crearProductoBasico({
      nombre: producto.datosBasicos.nombre, //@ts-ignore
      categoria: producto.datosBasicos.categoria._id,
      comentario: producto.datosBasicos.comentario,
      imagen: {
        data: imagenCvt,
        mimetype: 'image/png',
      },
    });
    if (res) {
      NotifySucessCenter('Producto agregado correctamente');
      getAllProductos();
    }
    estado.modal.isAddProduct = false;

    // limpiando campos
    producto.datosBasicos.nombre = '';
    producto.datosBasicos.categoria = { _id: '', nombre: '' };
    producto.datosBasicos.comentario = '';
    imagen.value = null;
    selectedFile.value = '';
    imagePreview.value = '';
  };

  const editarProductoBasico = async () => {
    console.log('first');
    if (imagen.value === null) {
      const res = await productoService.modificarProductoBasico(
        producto.productoID,
        {
          nombre: producto.datosBasicos.nombre, //@ts-ignore
          categoria: producto.datosBasicos.categoria._id,
          comentario: producto.datosBasicos.comentario,
        },
      );
      if (res) NotifySucessCenter('Producto modificado correctamente');
    } else {
      const imagenCvt = await fileToBase64(selectedFile.value);

      const res = await productoService.modificarProductoBasico(
        producto.productoID,
        {
          nombre: producto.datosBasicos.nombre, //@ts-ignore
          categoria: producto.datosBasicos.categoria._id,
          comentario: producto.datosBasicos.comentario,
          imagen: {
            data: imagenCvt,
            mimetype: 'image/png',
          },
        },
      );
      if (res) NotifySucessCenter('Producto modificado correctamente');
    }
  };

  const editarProductoMarca = async () => {
    const imagenCvt = await fileToBase64(selectedFileMarca.value);
    console.log(imagenCvt);

    const res = await productoService.agregarProductosMarca(
      //@ts-expect-error
      useProduct.producto._id,
      {
        marca: estado.marcaProducto.marca._id,
        cantidadMin: parseInt(estado.marcaProducto.minimo),
        cantidadMax: parseInt(estado.marcaProducto.maximo),
        imagen: {
          data: imagenCvt,
          mimetype: 'image/png',
        },
      },
    );
    if (res) NotifySucessCenter('Marca creado correctamente');
    estado.modal.esCrearMarcaProducto = false;
  };

  const editarProductoMedidaEmpaque = async () => {
    const res = await productoService.agregarProductosMedidaEmpaque(
      //@ts-expect-errors
      useProduct.producto._id,
      {
        //@ts-expect-errors
        marca: estado.medidaProducto.marca.marca._id,
        nombre: estado.medidaProducto.empaque.nombre,
        abreviacion: estado.medidaProducto.empaque.abreviacion,
        cantidad: estado.medidaProducto.cantidad,
      },
    );
    if (res) NotifySucessCenter('Medida&Empaque creado correctamente');
    estado.modal.isAddEmpaque = false;
  };

  /**
   * REDIRECCIONAR DESDE TABLA
   */
  const esEditarProducto = (row: any) => {
    console.log(row);
    const { _creado, _modificado, medida, ...nuevoDato } = row;
    useProduct.producto = { ...nuevoDato, categoria: nuevoDato.categoria };

    console.log(useProduct.producto);
    router.push('productos/detailProduct');
  };

  // MARCAS
  const buscarMarcas = async () => {
    const marcas = await productoService.buscarMarcas();
    // console.log(marcas);
    estado.marcas = marcas;
  };
  const crearMarca = async () => {
    const res = await productoService.crearMarca({
      nombre: estado.marcaProducto.marca.nombre,
    });
    if (res) NotifySucessCenter('Marca creado correctamente');
    estado.modal.esCrearMarca = false;
    estado.marcaProducto.marca.nombre = '';
    buscarMarcas();
  };
  // MEDIDAS
  const buscarMedidas = async () => {
    const medidas = await productoService.buscarMedidas();
    estado.medidas = medidas;
  };
  const crearMedida = async () => {
    const res = await productoService.crearMedida({
      nombre: estado.medidaProducto.medida.nombre,
    });
    if (res) NotifySucessCenter('Medida creado correctamente');
    estado.modal.esCrearMedida = false;
    estado.medidaProducto.medida.nombre = '';
    buscarMedidas();
  };
  const crearEmpaque = async () => {
    const res = await productoService.agregarEmpaqueMedida(
      estado.medidaProducto.medida._id,
      estado.medidaProducto.empaque,
    );
    if (res) NotifySucessCenter('Empaque creado correctamente');
    estado.modal.esCrearEmpaque = false;
    estado.medidaProducto.empaque.nombre = '';
    estado.medidaProducto.empaque.abreviacion = '';
    // buscarMedidas();
  };

  const mostrarInformacionProducto = (row: any) => {
    producto.informacion = row;
    estado.modal.esMostrarInformacionProducto = true;
  };

  const verImagen = (row: any) => {
    estado.modal.mostrarImagen = true;
    producto.imagenSrc = row?.cloudinaryUrl;
  };

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
  watch(imagenMarca, () => {
    //@ts-ignore
    if (imagenMarca.value instanceof Blob) {
      const lector = new FileReader();
      selectedFileMarca.value = imagenMarca.value;

      lector.addEventListener('load', () => {
        //@ts-ignore
        imagePreviewMarca.value = lector.result;
      }); //@ts-ignore
      lector.readAsDataURL(selectedFileMarca.value);
    }
  });

  watch(
    () => estado.medidaProducto.medida,
    (newVal, oldVal) => {
      console.log('El valor ha cambiado a: ', newVal);
    },
  );

  return {
    estado,
    tags,
    getAllProductos,
    getCategoria,
    borrarProducto,
    navegarDetalleProducto,
    modalAgregarProducto,
    agregarProducto,
    editProductBasicInfo,
    useProduct,
    modalAgregarPresentacion,
    agregarPresentacion,
    modalEditarPresentacion,
    modificarPresentacion,
    borrarPresentacion,
    cambiarCategoria,
    guardarCategoria,
    obtenerTodasCategorias,
    agregarCategoriaArbol,
    modalAgregarCategoria,
    navegarCrearOferta,
    imagen,
    imagePreview,
    selectedFile,
    producto,
    editarDatosBasicos,
    crearProductoBasico,
    editarProductoBasico,
    esEditarProducto,
    nombre,
    buscarMarcas,
    crearMarca,
    imagenMarca,
    selectedFileMarca,
    imagePreviewMarca,
    editarProductoMarca,
    buscarMedidas,
    crearMedida,
    crearEmpaque,
    editarProductoMedidaEmpaque,
    mostrarInformacionProducto,
    verImagen,
  };
};
