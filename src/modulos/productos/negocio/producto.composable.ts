import { productoService } from '../API/productoService';
import { storeProducto } from '@/modulos/productos/negocio/producto.store';
import localforage from 'localforage';

import type { CrearProductoBasico } from '~/modulos/productos/negocio/producto.interface';
import type { Categoria, CrearCategoriaDto, Producto } from '#gql';

export const useProducto = () => {
  /** DECLARACIONES */
  const productoStore = storeProducto();
  const { $socket } = useNuxtApp();
  const router = useRouter();

  /** REACTIVOS */
  const init_crearProductoBasico = {
    nombre: '',
    categoria: '',
    comentario: null,
    imagen: null,
  } as CrearProductoBasico;

  const estado = reactive({
    productos: [] as Producto[],
    categoriaOptions: [] as any[],

    // modales
    modal: {
      show_crearProductoBasico: false,
      show_informacionProducto: false,
    },
    datos_crearProductoBasico: init_crearProductoBasico,
    producto: {} as Producto,
  });

  /** FUNCIONES */
  const crearProductoBasico = async () => {
    let productoCreado = ref(null);
    loadingAsync(async () => {
      productoCreado.value = await productoService.crearProductoBasico(
        estado.datos_crearProductoBasico,
      );
    }).then(async () => {
      if (productoCreado.value !== null) {
        NotifySucessCenter('Producto agregado correctamente');
        await productoStore.addProducto(productoCreado.value);
        estado.modal.show_crearProductoBasico = false;
        // Object.assign(estado.datos_crearProductoBasico, init_crearProductoBasico);
        // estado.datos_crearProductoBasico = init_crearProductoBasico;
      } else {
        NotifyError('Problema al agregar el producto');
      }
    });
  };

  /**
   * Generar una lista de opciones para q-select a partir del
   * arbol de categorias
   */
  const categoriaSelectOptions = async (nivel2 = true) => {
    const options = [];
    const arbol = await productoStore.getCategoriaArbol();
    for (const cat of arbol.hijas) {
      options.push({
        label: `${cat.nombre} (${cat.hijas.length})`,
        disable: true,
        class: 'title',
      });
      if (nivel2) {
        for (const subcat of cat.hijas) {
          options.push({
            label: subcat.nombre,
            value: subcat._id,
            class: 'option',
          });
        }
      }
    }
    return options;
  };

  /**
   * Traer productos de la base de datos local y si no existe le carga
   * productos al indexedDB
   */
  const traerProductos = async () => {
    let productos = await localforage.getItem<Producto[]>('productos');
    if (!productos) {
      productos = await productoService.buscarProductos();
      await localforage.setItem('productos', productos);
    }
    productoStore.productos = estado.productos = productos;
  };

  /**
   * Actualizar la base de datos local de productos si escucha un cambio
   * desde el servidor
   */
  const actProductosDB = async () => {
    const productos = extraer(
      await GqlProductosBuscar({
        opciones: {
          populate: true,
          sort: '-_modificado -_creado',
        },
      }),
    );
    const res = await localforage.setItem(
      'productos',
      productos ? productos : [],
    );
    if (res) console.log('Se actualizo la base de datos');
  };

  /**
   * Agregar una categoria
   */
  const crearCategoria = async (
    datos: CrearCategoriaDto,
  ): Promise<Categoria> => {
    const categoriaCreada = await productoService.crearCategoria(datos);
    if (categoriaCreada) {
      // TODO Ajouter la categorie a l'arbol
      // productoStore.addCategoria(categoriaCreada);
    }
    return categoriaCreada;
  };
  const mostrarInformacionProducto = (producto: Producto) => {
    estado.producto = producto;
    estado.modal.show_informacionProducto = true;
  };

  /**
   * Redirige a la pagina de edicion de producto y alamcena los datos del
   * producto en el store para lectura y cambios
   */
  const irEdicionProducto = (producto: Producto) => {
    productoStore.producto = producto;
    router.push('productos/detalleProducto');
  };

  return {
    categoriaSelectOptions,
    crearProductoBasico,
    traerProductos,
    actProductosDB,
    estado,
    mostrarInformacionProducto,
    irEdicionProducto,
    crearCategoria,
  };
};
