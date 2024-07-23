import type { Entidad, Servicio } from '#gql';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';

export const useProductoServicios = () => {
  const { store, estado: estadoAlmacen } = useAlmacen();

  const estado = reactive({
    // los servicios de este producto, cada uno con su proveedor
    servicios: [] as (Servicio & { proveedor: Entidad })[],
    // el servicio que se esta modificando
    entidadProveedorId: null as string, // la entidad del proveedor
    servicio: null as Servicio & { proveedor: Entidad },
    // los dialogs
    modal: {
      formServicioModificar: false,
      formServicioCrear: false,
    },
    // config de los filtros de la tabla
    filtros: {
      buscarFiltro: '',
    },
  });

  // recupera toos los servicios del producto en store
  const getServiciosProducto = async () => {
    let proveedores;
    try {
      proveedores = await api.buscarEntidades_servicios(
        {
          tipo: ['PROVEEDOR'],
          servicios: {
            producto: store.producto._id,
          },
        },
        {},
        {
          servicios: {
            producto: store.producto._id,
          },
        },
      );
    } catch (err) {
      errFallBack(err);
      return;
    }

    // juntamos todos los servicios
    let servicios = [];
    for (const proveedor of proveedores) {
      // asignamos a cada servicio su proveedor
      const serviciosConProveedores = proveedor.servicios.map((servicio) => {
        Object.assign(servicio, { proveedor: proveedor });
        // para evitar recursividad que bota un error
        delete servicio.proveedor.servicios;
        return servicio;
      });
      // agragamos todo a la lista
      servicios = [...servicios, ...serviciosConProveedores];
    }
    estado.servicios = servicios;
    console.log(estado.servicios);
    return servicios;
  };

  const handleServicioCreado = (servicio, proveedor) => {
    NotifySucessCenter('Proveedor creado éxitosamente');
    Object.assign(servicio, { proveedor });
    delete servicio.proveedor.servicios;
    estado.servicios.push(servicio);
    estado.modal.formServicioCrear = false;
  };

  const handleServicioModificado = (servicio, proveedor) => {
    NotifySucessCenter('Proveedor modificado éxitosamente');
    Object.assign(servicio, { proveedor });
    delete servicio.proveedor.servicios;
    estado.servicios = estado.servicios.map((s) =>
      s._id === servicio._id ? servicio : s,
    );
    estado.modal.formServicioModificar = false;
  };

  return {
    store,
    estado,
    getServiciosProducto,
    handleServicioCreado,
    handleServicioModificado,
  };
};
