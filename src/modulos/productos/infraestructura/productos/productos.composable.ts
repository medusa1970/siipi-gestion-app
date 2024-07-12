import { productoService } from '../../API/productoService';
import { storeProducto } from '@/modulos/productos/negocio/producto.store';
import localforage from 'localforage';

import type { Categoria, CrearCategoriaDto, Producto } from '#gql';

export const useProducto = () => {
  /** DECLARACIONES */
  const { $socket } = useNuxtApp();
  const router = useRouter();
  const service = productoService;
  const store = storeProducto();

  /** REACTIVOS */
  const init_crearProductoBasico = {
    nombre: '',
    categoria: '',
    comentario: null,
    puedeVencer: false,
    vencimientoLimite: [0, 0] as [number, number],
    imagen: null,
  };

  const estado = reactive({
    productos: [] as Producto[],
    categoriasParaSelect: [] as any[],
    arbolCategorias: null as Categoria,

    // modales
    modal: {
      show_crearProductoBasico: false,
      show_informacionProducto: false,
    },
    datos_crearProductoBasico: clone(init_crearProductoBasico),
    producto: {} as Producto,
    errorProducto: '',
    listaCategorias: [],
    listaMarcas: [],
    filtros: {
      categoriaSeleccionada: '',
      marcaSeleccionada: '',
      buscarFiltro: '',
    },
  });

  /** FUNCIONES */
  const crearProductoBasico = async () => {
    if (estado.datos_crearProductoBasico.imagen === null) {
      delete estado.datos_crearProductoBasico.imagen === null;
    }
    let productoCreado;
    try {
      await loadingAsync(async () => {
        productoCreado = await productoService.crearProductoBasico(
          estado.datos_crearProductoBasico,
        );
        if (!productoCreado) throw 'No se pudo agregar el producto';
      });
    } catch (err) {
      if (isApiBadRequest(err, 'duplicado')) {
        estado.errorProducto = 'Este producto ya esta registrado';
        return;
      }
      errFallBack(err);
      return;
    }

    NotifySucessCenter('Producto agregado correctamente');
    await store.addProducto(productoCreado);
    estado.modal.show_crearProductoBasico = false;
    // Object.assign(estado.datos_crearProductoBasico, init_crearProductoBasico);
    // estado.datos_crearProductoBasico = clone(init_crearProductoBasico);
  };

  /**
   * Generar una lista de opciones para q-select a partir del
   * arbol de categorias
   */
  const categoriaSelectOptions = async (nivel2: boolean = true) => {
    const options = [];
    const arbol = await store.getCategoriaArbol();
    for (const cat of arbol.hijas) {
      if (nivel2) {
        options.push({
          label: `${cat.nombre} (${cat.hijas.length})`,
          value: cat._id,
          disable: true,
          class: 'title',
        });
        for (const subcat of cat.hijas) {
          options.push({
            label: subcat.nombre,
            value: subcat._id,
            class: 'option',
          });
        }
      } else {
        options.push({
          label: `${cat.nombre}`,
          value: cat._id,
          disable: nivel2,
        });
      }
    }
    return options;
  };

  const categoriaSelectOptionsFiltro = async () => {
    const options = [];
    if (!estado.arbolCategorias) {
      estado.arbolCategorias = await store.getCategoriaArbol();
    }
    for (const cat of estado.arbolCategorias.hijas) {
      options.push({
        label: `${cat.nombre} (${cat.hijas.length})`,
        value: cat._id,
      });
      for (const subcat of cat.hijas) {
        options.push({
          label: subcat.nombre,
          value: subcat._id,
          class: 'option',
        });
      }
    }
    return options;
  };

  const getCategoriaList = (categoriaID) => {
    if (!estado.arbolCategorias) {
      return [];
    }
    const lista = [];
    for (const cat of estado.arbolCategorias.hijas) {
      if (cat._id === categoriaID) {
        for (const subcat of cat.hijas) {
          lista.push(subcat._id);
        }
        return lista;
      }
    }
    return [categoriaID];
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
    store.productos = productos;
    // estado.productos = productos;
    const res = await localforage.setItem(
      'productos',
      productos ? productos : [],
    );
    if (res) console.log('Se actualizo la base de datos de productos');
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
      // store.addCategoria(categoriaCreada);
    }
    return categoriaCreada;
  };
  const mostrarInformacionProducto = (producto: Producto) => {
    estado.producto = producto;
    estado.modal.show_informacionProducto = true;
  };

  return {
    categoriaSelectOptions,
    categoriaSelectOptionsFiltro,
    crearProductoBasico,
    actProductosDB,
    estado,
    store,
    service,
    mostrarInformacionProducto,
    crearCategoria,
    getCategoriaList,
  };
};
