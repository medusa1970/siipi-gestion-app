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
import { productoService } from '~/services/producto.service';
import type { Presentacion, Product } from '@/interfaces/product.interface';
import { ofertaStore } from '@/stores/oferta.store';
import { fileToBase64 } from '@/helpers/helpers';
import { proveedores } from '~/helpers/columns';

export const useProducts = () => {
  const useAuth = authStore();
  const useProduct = productStore();
  const router = useRouter();
  const $q = useQuasar();
  const storeOferta = ofertaStore();

  interface Precio {
    cantidad: number;
    precioConFactura: number;
    precioSinFactura: number;
  }
  const estado = reactive({
    test: false,
    modal: {
      isProve: false,
      isEditProduct: false,
      isAddPrueba: false,
      isAddPresentation: false,
      isAddCategory: false,
      isAddCategoryArbol: false,
      esEditarCategoria: false,
      isAddProducts: false,
      // NEW
      isAddProduct: false,
      esCrearMarcaProducto: false,
      esEditarMarca: false,
      esCrearMedidaProducto: false,
      isAddProveedor: false,
      isDetailProduct: false,
      isAddEmpaque: false,
      esEditarEmpaque: false,
      esCrearMarca: false,
      esCrearMedida: false,
      esCrearEmpaque: false,
      esMostrarInformacionProducto: false,
      mostrarImagen: false,
      esCrearProveedor: false,
      esEditarProveedor: false,
      esCrearPrecio: false,
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
      minimo: 0,
      maximo: 0,
      variedadID: '',
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
            cantidad: 0,
          },
        ],
      },
      empaque: {
        _id: '',
        nombre: '',
        abreviacion: '',
        cantidad: 0,
      },
      marca: {
        _id: '',
        nombre: '',
      },
      cantidad: 0,
    },
    dataEmpaque: {
      nombre: '',
      abreviacion: '',
      cantidad: 0,
    },
    dataMedida: {
      _id: '',
      nombre: '',
    },
    dataProveedor: {
      _id: '',
      nombre: '',
      descripcion: '',
    },
    proveedores: [],
    productoProveedor: {
      servicioID: '',
      marca: {
        _id: '',
        nombre: '',
      },
      proveedor: {
        _id: '',
        nombre: '',
      },
      identificativo: '',
      precioConFactura: 0,
      precioSinFactura: 0,
      precios: [],
    },
    dataPrecio: {
      cantidadMin: null,
      precioConFactura: 0,
      precioSinFactura: 0,
    },
    proveedoresProducto: [],
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
    motivoEliminacion: '',
  });
  const estadoInicial = reactive({
    datosBasicos: {
      nombre: '',
      categoria: { _id: '', nombre: '' },
      comentario: '',
      tiempoVida: '',
      imagen: '',
    },
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
    return categoriaArbol;
  };

  const borrarProducto = () => {
    $q.dialog({
      title: `Eliminar ${producto.datosBasicos.nombre}`,
      message: 'No se puede deshacer.',
      cancel: true,
      persistent: true,
    }).onOk(async () => {
      productoService
        .borrarProducto(
          producto.productoID,
          producto.motivoEliminacion,
          useGqlToken(useAuth.token),
        )
        .then(() => {
          producto.motivoEliminacion = '';
          NotifySucess('Producto eliminado correctamente');
        });
      getAllProductos();
      router.push('/cathering/sede/productos');
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
    // console.log('first');
    delete estado.producto._id; //@ts-ignore
    delete estado.producto.categoria.productos;
    const imagenCvt = await fileToBase64(selectedFile.value);
    // console.log(imagenCvt);

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
    // console.log(selectedFile.value);

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
        const productoBorrado = await productoService.borrarPresentacion(
          useProduct.product._id,
          presentacion.nombre,
        );
        NotifySucess('Presentacion eliminado correctamente');
        if (productoBorrado) {
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
    if (nuevaCategoria) {
      NotifySucessCenter('Categoria agregada correctamente');
      obtenerTodasCategorias();

      //limpiar campos
      estado.categoria.pariente = '';
      estado.categoria.nombre = '';
    }
    estado.modal.isAddCategoryArbol = false;
  };
  const modificarCategoriaArbol = async () => {
    const categoriaModificada = await productoService.modificarCategoria(
      estado.categoria.pariente,
      estado.categoria.nombre,
    );
    if (categoriaModificada) {
      NotifySucessCenter('Categoria modificada correctamente');
      obtenerTodasCategorias();

      //limpiar campos
      estado.categoria.pariente = '';
      estado.categoria.nombre = '';
    }
    estado.modal.isAddCategoryArbol = false;
    estado.modal.esEditarCategoria = false;
  };

  const borrarCategoriaArbol = async (row: any) => {
    $q.dialog({
      title: `Eliminar ${row.nombre}`,
      message: `¿Está seguro de eliminar esta categoria${
        row.hijas?.length > 0
          ? ', tiene ' + row.hijas.length + ' subcategorias'
          : ''
      }?`,
      cancel: true,
      persistent: true,
    }).onOk(async () => {
      const categoriaBorrada = await productoService.borrarCategoria(row._id);
      if (categoriaBorrada) {
        NotifySucessCenter('Categoria eliminada correctamente');
        obtenerTodasCategorias();
      }
    });
  };

  const modalAgregarCategoria = (data: { _id: string }) => {
    estado.categoria = { nombre: '', pariente: '' };
    estado.modal.esEditarCategoria = false;
    estado.modal.isAddCategoryArbol = true;
    estado.categoria.pariente = data._id;
  };
  const modalEditarCategoria = (data: any) => {
    console.log(data);
    estado.modal.esEditarCategoria = true;
    estado.modal.isAddCategoryArbol = true;
    estado.categoria.pariente = data._id;
    estado.categoria.nombre = data.nombre;
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
    // console.log(producto.datosBasicos);
    const imagenCvt = await fileToBase64(selectedFile.value);
    // console.log(imagenCvt);
  };

  // NUEVO
  /**
   * CRUD PRODUCTOS
   */
  const crearProductoBasico = async () => {
    // console.log(producto.datosBasicos);
    const imagenCvt = await fileToBase64(selectedFile.value);
    const productoCreado = await productoService.crearProductoBasico({
      nombre: producto.datosBasicos.nombre, //@ts-ignore
      categoria: producto.datosBasicos.categoria.value._id,
      comentario: producto.datosBasicos.comentario,
      imagen: {
        data: imagenCvt,
        mimetype: 'image/png',
      },
    });
    // console.log(producto);
    if (productoCreado) {
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
    if (imagen.value === null) {
      const productoModificado = await productoService.modificarProductoBasico(
        //@ts-expect-error
        useProduct.producto._id,
        {
          nombre: producto.datosBasicos.nombre, //@ts-ignore
          categoria: producto.datosBasicos.categoria.value._id,
          comentario: producto.datosBasicos.comentario,
        },
      );
      if (productoModificado)
        NotifySucessCenter('Producto modificado correctamente');
    } else {
      const imagenCvt = await fileToBase64(selectedFile.value);
      const productoModificado = await productoService.modificarProductoBasico(
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
      if (productoModificado)
        NotifySucessCenter('Producto modificado correctamente');
    }
  };

  const agregarProductoMarca = async () => {
    const imagenCvt = await fileToBase64(selectedFileMarca.value);

    const productoModificado = await productoService.agregarProductosMarca(
      //@ts-expect-error
      useProduct.producto._id,
      {
        marca: estado.marcaProducto.marca._id,
        cantidadMin: estado.marcaProducto.minimo,
        cantidadMax: estado.marcaProducto.maximo,
        imagen: {
          data: imagenCvt,
          mimetype: 'image/png',
        },
      },
    );
    if (productoModificado) {
      NotifySucessCenter('Marca creado correctamente');
      const nuevaMarca = productoModificado.variedades.pop();
      useProduct.producto.variedades.push(nuevaMarca);
    }

    estado.modal.esCrearMarcaProducto = false;
    estado.marcaProducto.marca = { _id: '', nombre: '' };
    estado.marcaProducto.minimo = 0;
    estado.marcaProducto.maximo = 0;
    imagenMarca.value = null;
    selectedFileMarca.value = '';
    imagePreviewMarca.value = '';
  };
  const editarProductoMarca = async () => {
    console.log(useProduct.producto._id);
    console.log(estado.marcaProducto);
    const marcaModificada = await productoService.modificarProductosMarca(
      //@ts-expect-error
      useProduct.producto._id,
      estado.marcaProducto.variedadID,
      {
        cantidadMax: estado.marcaProducto.maximo,
        cantidadMin: estado.marcaProducto.minimo,
      },
    );
    if (marcaModificada) {
      NotifySucessCenter('Marca modificado correctamente');
      // encontrar index de la variedad modificada
      const index = useProduct.producto.variedades.findIndex(
        (v) => v._id === estado.marcaProducto.variedadID,
      );
      if (index !== -1) {
        // encontrar objeto variedad modificada
        const variedadModificada = marcaModificada.variedades.find(
          (v: any) => v._id === estado.marcaProducto.variedadID,
        );
        // Si se encontró la variedad modificada, actualiza la variedad en el array con la variedad modificada
        if (variedadModificada) {
          useProduct.producto.variedades[index] = variedadModificada;
        }
      }
      estado.modal.esEditarMarca = false;
      estado.modal.esCrearMarcaProducto = false;
    }
  };

  const editarProductoMedidaEmpaque = async () => {
    const productoModificado =
      await productoService.agregarProductosMedidaEmpaque(
        //@ts-expect-errors
        useProduct.producto._id,
        {
          marca: estado.medidaProducto.marca._id,
          nombre: estado.medidaProducto.empaque.nombre,
          abreviacion: estado.medidaProducto.empaque.abreviacion,
          cantidad: estado.medidaProducto.empaque.cantidad,
        },
      );
    if (productoModificado) {
      NotifySucessCenter('Medida&Empaque creado correctamente');

      const nuevaMedida = productoModificado.empaques.pop();
      useProduct.producto.empaques.push(nuevaMedida);
    }
    estado.modal.isAddEmpaque = false;
    estado.medidaProducto.marca = { _id: '', nombre: '' };
    estado.medidaProducto.empaque = {
      nombre: '',
      abreviacion: '',
      cantidad: 0,
    };
    estado.medidaProducto.cantidad = 0;
  };

  /**
   * REDIRECCIONAR DESDE TABLA
   */
  const esEditarProducto = (row: any) => {
    console.log(row);
    const { _creado, _modificado, ...nuevoDato } = row;
    useProduct.producto = { ...nuevoDato, categoria: nuevoDato.categoria };
    router.push('productos/detailProduct');
  };

  // MARCAS
  const buscarMarcas = async () => {
    const marcas = await productoService.buscarMarcas();
    estado.marcas = marcas;
  };
  const crearMarca = async () => {
    const marcaNueva = await productoService.crearMarca({
      nombre: estado.marcaProducto.marca.nombre,
    });
    if (marcaNueva) NotifySucessCenter('Marca creado correctamente');
    estado.modal.esCrearMarca = false;
    estado.marcaProducto.marca = {
      _id: marcaNueva._id,
      nombre: marcaNueva.nombre,
    };
    buscarMarcas();
  };
  // MEDIDAS
  const buscarMedidas = async () => {
    const medidas = await productoService.buscarMedidas();
    estado.medidas = medidas;
  };
  const crearMedida = async () => {
    const medidaNueva = await productoService.crearMedida({
      nombre: estado.dataMedida.nombre,
    });
    if (medidaNueva) NotifySucessCenter('Medida creado correctamente');
    estado.modal.esCrearMedida = false;
    estado.dataMedida.nombre = '';
    buscarMedidas();
  };
  const crearEmpaque = async () => {
    const medidaConEmpaqueNuevo = await productoService.agregarEmpaqueMedida(
      estado.medidaProducto.medida._id,
      estado.dataEmpaque,
    );
    const empaque =
      medidaConEmpaqueNuevo.tipoEmpaques[
        medidaConEmpaqueNuevo.tipoEmpaques.length - 1
      ];

    if (medidaConEmpaqueNuevo) {
      NotifySucessCenter('Empaque creado correctamente');
      const nuevoEmpaque = medidaConEmpaqueNuevo.tipoEmpaques.pop();
      delete nuevoEmpaque._id;
      estado.medidaProducto.medida.tipoEmpaques.push(nuevoEmpaque);
    }

    estado.medidaProducto.empaque = {
      nombre: empaque.nombre,
      abreviacion: empaque.abreviacion,
      cantidad: empaque.cantidad,
    };
    estado.dataEmpaque = { nombre: '', abreviacion: '', cantidad: 0 };
    estado.modal.esCrearEmpaque = false;
  };
  // PROVEEDORES
  const buscarProveedores = async () => {
    const proveedores = await productoService.buscarEntidadesProveedor();
    estado.proveedores = proveedores;
  };
  const crearProveedor = async () => {
    const [proveedorCreado] = await productoService.crearEntidadProveedor({
      nombre: estado.dataProveedor.nombre,
      descripcion: estado.dataProveedor.descripcion,
    });
    if (proveedorCreado) {
      NotifySucessCenter('Proveedor creado correctamente');
      estado.dataProveedor.nombre = '';
      estado.dataProveedor.descripcion = ''; //@ts-ignore
      estado.proveedores.push(proveedorCreado);
    }
    console.log(proveedorCreado);
    estado.productoProveedor.proveedor = proveedorCreado;
    estado.modal.esCrearProveedor = false;
  };

  const agregarPrecio = () => {
    //@ts-expect-error
    estado.productoProveedor.precios.push(estado.dataPrecio);
    estado.modal.esCrearPrecio = false;
    estado.dataPrecio = {
      cantidadMin: null,
      precioConFactura: 0,
      precioSinFactura: 0,
    };
  };

  const agregarProductoProveedor = async () => {
    const [nuevoProveedor] = await productoService.agregarProveedorProducto(
      estado.productoProveedor.proveedor._id,
      {
        //@ts-expect-error
        marca: estado.productoProveedor.marca.marca._id,
        producto: useProduct.producto._id,
        identificativo: estado.productoProveedor.identificativo,
        precioConFactura: estado.productoProveedor.precioConFactura,
        precioSinFactura: estado.productoProveedor.precioSinFactura,
        preciosPorMayor: estado.productoProveedor.precios,
      },
    );
    if (nuevoProveedor) {
      NotifySucessCenter('Proveedor creado correctamente'); //@ts-expect-error
      estado.proveedoresProducto.push(nuevoProveedor);
    }
    estado.modal.isAddProveedor = false; //@ts-expect-error
    estado.productoProveedor.marca = null;
    estado.productoProveedor.proveedor = { _id: '', nombre: '' };
    estado.productoProveedor.identificativo = '';
    estado.productoProveedor.precioConFactura = 0;
    estado.productoProveedor.precioSinFactura = 0;
    estado.productoProveedor.precios = [];
  };

  const buscarProveedoresProducto = async () => {
    estado.proveedoresProducto =
      await productoService.buscarProveedoresProducto(
        //@ts-expect-error
        useProduct.producto._id,
      );
    console.log(estado.proveedoresProducto);
  };

  // EXTRAS
  const mostrarInformacionProducto = (row: any) => {
    producto.informacion = row;
    estado.modal.esMostrarInformacionProducto = true;
  };

  const verImagen = (row: any) => {
    estado.modal.mostrarImagen = true;
    producto.imagenSrc = row?.cloudinaryUrl;
  };

  const guardarMedidaBasica = async () => {
    console.log(useProduct.producto._id);
    console.log(estado.medidaProducto.medida._id);
    const res = await productoService.guardarMedidaProducto(
      //@ts-expect-error
      useProduct.producto._id,
      estado.medidaProducto.medida._id,
    );
    console.log(res);
    if (res) {
      NotifySucess('Medida guardada correctamente');
    }
  };

  const cancelarEdicionProductoBasico = () => {
    producto.datosBasicos.nombre = estadoInicial.datosBasicos.nombre;
    producto.datosBasicos.categoria = estadoInicial.datosBasicos.categoria;
    producto.datosBasicos.comentario = estadoInicial.datosBasicos.comentario;
  };

  const limpiarCamposMarca = () => {
    estado.marcaProducto.marca = { _id: '', nombre: '' };
    estado.marcaProducto.minimo = 0;
    estado.marcaProducto.maximo = 0;
    imagenMarca.value = null;
    selectedFileMarca.value = '';
    imagePreviewMarca.value = '';
  };

  const abrirModalEditarMarca = (fila: any) => {
    estado.modal.esEditarMarca = true;
    estado.modal.esCrearMarcaProducto = true;
    // Escribiendo valores en el reactivo
    estado.marcaProducto.marca = fila.marca;
    imagePreviewMarca.value = fila.imagen?.cloudinaryUrl;
    estado.marcaProducto.minimo = fila.cantidadMin;
    estado.marcaProducto.maximo = fila.cantidadMax;
    estado.marcaProducto.variedadID = fila._id;
    console.log(estado.marcaProducto.variedadID);
  };

  const limpiarCamposEmpaque = () => {
    estado.medidaProducto.marca = { _id: '', nombre: '' };
    estado.medidaProducto.empaque = { nombre: '', abreviacion: '' };
    estado.medidaProducto.cantidad = 0;
    estado.dataEmpaque = { nombre: '', abreviacion: '' };
  };
  const abrirModalEditarEmpaque = (fila: any) => {
    console.log(fila);
    estado.modal.esEditarEmpaque = true;
    estado.modal.isAddEmpaque = true;

    console.log(estado.medidaProducto);
    estado.medidaProducto.marca = fila.marca;
    estado.medidaProducto.cantidad = fila.cantidad;
    estado.medidaProducto.empaque = {
      _id: fila._id,
      nombre: fila.nombre,
      abreviacion: fila.abreviacion,
    };
  };
  const editarEmpaqueProducto = async () => {
    const productoEmpaque = await productoService.modificarEmpaqueProducto(
      //@ts-expect-error
      useProduct.producto._id,
      estado.medidaProducto.empaque._id,
      {
        marca: estado.medidaProducto.marca._id,
        cantidad: estado.medidaProducto.cantidad,
        nombre: estado.medidaProducto.empaque.nombre,
        abreviacion: estado.medidaProducto.empaque.abreviacion,
      },
    );
    if (productoEmpaque) {
      NotifySucessCenter('Marca modificado correctamente');
      // encontrar index de la variedad modificada
      const index = useProduct.producto.empaques.findIndex(
        (e: any) => e._id === estado.medidaProducto.empaque._id,
      );
      console.log(index);
      if (index !== -1) {
        // encontrar objeto variedad modificada
        const empaqueModificada = productoEmpaque.empaques.find(
          (v: any) => v._id === estado.medidaProducto.empaque._id,
        );
        console.log(empaqueModificada);
        // Si se encontró la variedad modificada, actualiza la variedad en el array con la variedad modificada
        if (empaqueModificada) {
          useProduct.producto.empaques[index] = empaqueModificada;
        }
      }
      estado.modal.esEditarEmpaque = false;
      estado.modal.isAddEmpaque = false;
    }
  };

  const abrirModalEditarProveedor = (fila: any) => {
    estado.modal.esEditarProveedor = true;
    estado.modal.isAddProveedor = true;

    //@ts-expect-error
    estado.productoProveedor.marca.marca = fila.servicios[0]?.marca;
    estado.productoProveedor.identificativo = fila.servicios[0]?.identificativo;
    estado.productoProveedor.proveedor = {
      _id: fila._id,
      nombre: fila.nombre,
    };
    estado.productoProveedor.precioConFactura =
      fila.servicios[0]?.precioConFactura;
    estado.productoProveedor.precioSinFactura =
      fila.servicios[0]?.precioSinFactura;
    estado.productoProveedor.servicioID = fila.servicios[0]?._id;
  };
  const editarProveedorProducto = async () => {
    const servicioProveedor = await productoService.modificarProveedorProducto(
      estado.productoProveedor.proveedor._id,
      estado.productoProveedor.servicioID,
      {
        //@ts-expect-error
        marca: estado.productoProveedor.marca.marca._id,
        identificativo: estado.productoProveedor.identificativo,
        precioConFactura: estado.productoProveedor.precioConFactura,
        precioSinFactura: estado.productoProveedor.precioSinFactura,
      },
    );
    if (servicioProveedor) {
      NotifySucessCenter('Marca modificado correctamente');
      estado.proveedoresProducto.forEach((proveedor) => {
        if (proveedor._id === servicioProveedor._id) {
          console.log(proveedor);
          proveedor.servicios.forEach((servicio, index) => {
            if (servicio._id === servicioProveedor.servicios[0]._id) {
              proveedor.servicios[index] = servicioProveedor.servicios[0];
            }
          });
        }
      });
    }
    estado.modal.esEditarProveedor = false;
    estado.modal.isAddProveedor = false;
  };
  const limpiarCamposProveedor = () => {
    estado.productoProveedor.marca = { _id: '', nombre: '' };
    estado.productoProveedor.proveedor = { _id: '', nombre: '' };
    estado.productoProveedor.identificativo = '';
    estado.productoProveedor.precioConFactura = 0;
    estado.productoProveedor.precioSinFactura = 0;
    estado.productoProveedor.precios = [];
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
      // console.log('El valor ha cambiado a: ', newVal);
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
    agregarProductoMarca,
    editarProductoMarca,
    buscarMedidas,
    crearMedida,
    crearEmpaque,
    editarProductoMedidaEmpaque,
    mostrarInformacionProducto,
    verImagen,
    buscarProveedores,
    crearProveedor,
    agregarPrecio,
    agregarProductoProveedor,
    buscarProveedoresProducto,
    guardarMedidaBasica,
    cancelarEdicionProductoBasico,
    estadoInicial,
    abrirModalEditarMarca,
    limpiarCamposMarca,
    abrirModalEditarEmpaque,
    editarEmpaqueProducto,
    limpiarCamposEmpaque,
    abrirModalEditarProveedor,
    editarProveedorProducto,
    limpiarCamposProveedor,
    modalEditarCategoria,
    modificarCategoriaArbol,
    borrarCategoriaArbol,
  };
};
