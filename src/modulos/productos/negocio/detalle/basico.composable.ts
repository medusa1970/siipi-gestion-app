import { productoService } from '../../API/productoService';
import { storeProducto } from '@/modulos/productos/negocio/producto.store';
import { useAuthStore } from '@/modulos/main/negocio/useAuthStore.js';
import type { Empaque, Entidad, Marca, Medida, Producto, Servicio } from '#gql';
import { useQuasar } from 'quasar';
import type { SelectOpcion } from '~/components/input/select.interface';

export const useDetalleBasico = () => {
  const productoStore = storeProducto();
  const authStore = useAuthStore();
  const router = useRouter();
  const $q = useQuasar();

  /**
   * INIT
   */

  const init_modificarProductoBasico = {
    nombre: null as string,
    categoria: null as string,
    comentario: null as string | null | undefined,
    imagen: null as { data: string; mimetype: string },
  };

  /**
   * ESTADO
   */

  const estado = reactive({
    producto: null as Producto,
    modal: {
      show_crearProductoBasico: false,
      show_informacionProducto: false,
    },
    datos_modificarProductoBasico: clone(init_modificarProductoBasico),
    modProductoBasicoImagen: null,
    categoriasParaSelect: [] as SelectOpcion[],
  });

  /**
   * FUNCIONES
   */

  /**
   * Datos básicos >> Guardar
   */

  const modificarProductoBasico = async () => {
    // preparamos los datos
    const datos = {
      nombre: estado.datos_modificarProductoBasico.nombre,
      categoria: estado.datos_modificarProductoBasico.categoria,
      comentario: estado.datos_modificarProductoBasico.comentario,
    };
    if (estado.datos_modificarProductoBasico.imagen) {
      Object.assign(datos, {
        imagen: estado.datos_modificarProductoBasico.imagen,
      });
    }
    // hacemos la consulta con manejo de errores
    let productoModificado;
    try {
      await loadingAsync(async () => {
        productoModificado = await productoService.modificarProductoBasico(
          productoStore.producto._id,
          datos,
        );
      });
      if (!productoModificado) throw 'No se pudo modificar el producto';
    } catch (err) {
      errFallBack(err);
      return;
    }
    // Avisamos que todo bien
    NotifySucessCenter('Producto modificado correctamente');
    // ponemos al dia el productoStore
    Object.assign(productoStore.producto, productoModificado);
    productoStore.producto.imagen = productoModificado.imagen;
  };

  return {
    productoStore,
    authStore,
    estado,
    modificarProductoBasico,
  };
};
