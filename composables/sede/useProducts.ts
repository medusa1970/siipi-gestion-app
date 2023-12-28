import { onMounted, reactive } from 'vue';
import { NotifySucess } from '@/helpers/message.service';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { productStore } from '@/stores/producto.store';
import { productoService } from '~/services/sede/producto.service';
import type { Presentacion, Product } from '@/interfaces/product.interface';
import DragDrop from '@/components/DrogDrop.vue';

export const useProducts = () => {
  const useProduct = productStore();
  const router = useRouter();
  const $q = useQuasar();

  const estado = reactive({
    test: false,
    modal: {
      isProve: false,
      isEditProduct: false,
      isAddPrueba: false,
      isAddPresentation: false
    },
    productos: [],
    producto: <Product>{
      nombre: '',
      descripcion: '',
      tags: [],
      presentacionBasica: '',
      presentaciones: [{ nombre: '', cantidad: 0 }]
    },
    presentacion: <Presentacion>{
      _id: '',
      nombre: '',
      cantidad: 0
    },
    presentacionNombre: '',
    dialog: {
      isAddPresentation: false,
      isEditPresentation: false,
      isTest: false
    }
  });

  const tags = ['empanadas', 'Masas', 'Embutidos', 'pedazos'];

  const getAllProductos = async () => {
    const { productoBuscar } = await productoService.buscarProductos();
    estado.productos = productoBuscar;
  };

  const borrarProducto = (row: { _id: string; nombre: string }) => {
    $q.dialog({
      title: `Eliminar ${row.nombre}`,
      message: '¿Está seguro de eliminar este producto?',
      cancel: true,
      persistent: true
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

    router.push('productos/detailProduct');
  };
  const modalAgregarProducto = () => {
    useProduct.isEdit = false;
    useProduct.product = {
      _id: '',
      nombre: '',
      descripcion: '',
      tags: [],
      presentacionBasica: '',
      presentaciones: []
    };

    router.push('productos/detailProduct');
  };
  //STORE
  if (useProduct.product) {
    estado.producto = useProduct.product;
  }

  // AGREGAR PRODUCTO
  const agregarProducto = async () => {
    delete estado.producto._id;
    await productoService.agregarProducto(estado.producto);
    NotifySucess('Producto agregado correctamente');
    router.push('/sede/productos');
  };
  const editProductBasicInfo = async () => {
    //@ts-ignore
    const { presentaciones, _creado, _id, nombre, ...productoData } =
      estado.producto;
    const { productoModificar } = await productoService.editarProducto(
      useProduct.product._id,
      productoData
    );
    estado.producto = Object.assign(estado.producto, productoModificar[0]);
    NotifySucess('información básica actualizada correctamente');
  };
  const modalAgregarPresentacion = () => {
    estado.dialog.isAddPresentation = true;
    estado.presentacion = {
      _id: '',
      nombre: '',
      cantidad: 0
    };
  };

  //CRUD
  const agregarPresentacion = async () => {
    if (useProduct.isEdit) {
      const { productoCrearPresentacion: res } =
        await productoService.agregarPresentacion(
          useProduct.product._id,
          estado.presentacion.nombre,
          estado.presentacion.cantidad
        );
      if (res) {
        estado.producto.presentaciones.push(res);
      }
      NotifySucess('presentacion agregado correctamente');
      estado.dialog.isAddPresentation = false;
    } else {
      estado.producto.presentaciones.push({
        nombre: estado.presentacion.nombre,
        cantidad: estado.presentacion.cantidad
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
      const { productoModificarPresentacion: res } =
        await productoService.editarPresentacion(
          useProduct.product._id,
          estado.presentacionNombre,
          estado.presentacion
        );
      if (res) {
        const index = estado.producto.presentaciones.findIndex(
          (p) => p._id === estado.presentacion._id
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
        cantidad: 0
      };
    } else {
      const index = estado.producto.presentaciones.findIndex(
        (p) => p.nombre === estado.presentacionNombre
      );
      if (index !== -1) {
        estado.producto.presentaciones[index] = estado.presentacion;
      }
      estado.presentacion = {
        _id: '',
        nombre: '',
        cantidad: 0
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
        persistent: true
      }).onOk(async () => {
        const { productoBorrarPresentacion: res } =
          await productoService.borrarPresentacion(
            useProduct.product._id,
            presentacion.nombre
          );
        NotifySucess('Presentacion eliminado correctamente');
        if (res) {
          const index = estado.producto.presentaciones.findIndex(
            (p) => p._id === presentacion._id
          );
          if (index !== -1) {
            estado.producto.presentaciones.splice(index, 1);
          }
        }
      });
    } else {
      const index = estado.producto.presentaciones.findIndex(
        (p) => p.nombre === presentacion.nombre
      );
      if (index !== -1) {
        estado.producto.presentaciones.splice(index, 1);
      }
    }
  };

  onMounted(() => {
    getAllProductos();
  });

  return {
    estado,
    tags,
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
    borrarPresentacion
  };
};
