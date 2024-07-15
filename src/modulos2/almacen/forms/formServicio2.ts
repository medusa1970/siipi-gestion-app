import type { SelectOpcion } from '~/components/input/select.interface';
import { useAlmacen } from '~/modulos2/almacen/almacen.composable';
const { store } = useAlmacen();

export const useFormServicio2 = (props) => {
  // definicion de los emits
  const emits = defineEmits(['crearObjeto', 'modificarObjeto']);

  // datos por defecto del formulario
  const initForm = {
    producto: store.producto._id,
    proveedor: props.config?.proveedorId ?? '',
    marca: props.edicion?.marca._id ?? '',
    identificativo: props.edicion?.identificativo ?? '',
    precioConFactura: props.edicion?.precioConFactura ?? '',
    precioSinFactura: props.edicion?.precioSinFactura ?? '',
    preciosPorMayor: props.edicion?.preciosPorMayor ?? [],
  };
  const initFormPorMayor = {
    cantidadMin: 0,
    precioConFactura: 0,
    precioSinFactura: 0,
  };

  // definicion del estado
  const estado = reactive({
    // valor de los inputs
    dataForm: clone(initForm),
    dataFormPorMayor: clone(initFormPorMayor),
    // listas de opciones
    marcaOpciones: [] as SelectOpcion[],
    proveedorOpciones: [] as SelectOpcion[],
    // los dialogs
    showFormPorMayor: false,
  });

  const llenarMarcaOpciones = async () => {
    try {
      estado.marcaOpciones = (await api.buscarMarcas({})).map((marca) => {
        return {
          value: marca._id,
          label: marca.nombre,
        };
      });
    } catch (err) {
      errFallBack(err);
      return;
    }
  };

  const llenarProveedorOpciones = async () => {
    try {
      estado.proveedorOpciones = (
        await api.buscarEntidades_basico({
          tipo: ['PROVEEDOR'],
        })
      ).map((proveedor) => {
        return {
          value: proveedor._id,
          label: proveedor.nombre,
        };
      });
    } catch (err) {
      errFallBack(err);
      return;
    }
  };

  // submision del formulario
  const formSubmit = async () => {
    const proveedorId = estado.dataForm.proveedor;
    const data = clone(estado.dataForm);
    delete data.proveedor;
    try {
      // Modo edicion
      if (props.edicion != null) {
        // lanzamos la consulta
        data.preciosPorMayor = { reemplazar: data.preciosPorMayor };
        const proveedor = await api.modificarEntidad_servicios(proveedorId, {
          servicios: {
            buscar: {
              _id: [props.edicion._id],
            },
            modificar: data,
          },
        });
        const servicio = proveedor.servicios.find(
          (s) => s._id === props.edicion._id,
        );
        // reinicializamos el formulario
        estado.dataForm = clone(initForm);
        // mandamos el resultado al componiente pariente
        emits('modificarObjeto', servicio, { pariente: proveedor });
      }
      // Modo creacion
      else {
        // lanzamos la consulta
        const proveedor = await api.modificarEntidad_servicios(proveedorId, {
          servicios: {
            agregar: data,
          },
        });
        const servicio = ultimo(proveedor.servicios);
        // reinicializamos el formulario
        estado.dataForm = clone(initForm);
        // mandamos el resultado al componiente pariente
        emits('crearObjeto', servicio, {
          pariente: proveedor,
          selectValor: servicio._id,
          selectCallback: (listaOpciones: SelectOpcion[]): SelectOpcion[] => [
            ...listaOpciones,
            { label: servicio.nombre, value: servicio._id },
          ],
        });
      }
    } catch (err) {
      errFallBack(err);
      return;
    }
  };

  const addPpmSubmit = () => {
    estado.showFormPorMayor = false;
    estado.dataForm.preciosPorMayor.push(clone(estado.dataFormPorMayor));
    estado.dataFormPorMayor = clone(initFormPorMayor);
  };

  return {
    estado,
    llenarMarcaOpciones,
    llenarProveedorOpciones,
    formSubmit,
    addPpmSubmit,
  };
};
