import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NotifySucessCenter } from '~/helpers/message.service';
import { ofertaService } from '~/services/marca/ofertas.service';

export const useOferta = () => {
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
    },
    toogle: false,
    productoFijo: {
      producto: '',
      presentacion: '',
    },
    productos: [],
  });
  const obtenerTodasofertas = async () => {
    const { ofertaBuscar } = await ofertaService.buscarOfertas();
    estado.ofertas = ofertaBuscar;
  };

  const crearOferta = async () => {
    const { _id, ingredientes, condiciones, preparados, ...ofertaData } =
      estado.oferta;
    const { ofertaCrear } = await ofertaService.crearOferta(ofertaData);
    if (ofertaCrear._id) {
      NotifySucessCenter('Oferta creada correctamente');
      estado.modal.isCreatedOferta = true;
      estado.oferta._id = ofertaCrear._id;
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
    ofertaService
      .crearIngredienteProducto(
        estado.oferta._id, //@ts-ignore
        estado.productoFijo.producto._id, //@ts-ignore
        estado.productoFijo.presentacion.cantidad,
      )
      .then(() => NotifySucessCenter('Ingrediente creado correctamente'));
    estado.modal.isAddIngredientProduct = false;
    estado.productoFijo.producto = '';
    estado.productoFijo.presentacion = '';
  };

  //on mounted
  onMounted(() => {
    obtenerTodasofertas();
  });
  return {
    estado,
    crearOferta,
    abrirModalIngredientes,
    obtenerTodosProductos,
    crearIngredienteProducto,
  };
};
