// LOGICA STOCK
import { reactive, onMounted } from 'vue';
import { NotifySucess, NotifyError } from '@/helpers/message.service';
import { authStore } from '@/stores/auth.store';
import { productStore } from '@/stores/producto.store';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { stockService } from '~/services/punto/stock.service';
import { ofertaService } from '~/services/marca/ofertas.service';
import { menuService } from '~/services/punto/menu.service';

type ProductoEnAlerta = {
  foto: string;
  producto: any;
  presentaciones: any;
  lotes: any;
  cantidad: any;
  cantidadMinima: any;
  alertStyle: string;
};

export const useStock = () => {
  // config
  const useAuth = authStore();
  const useProduct = productStore();
  // reactive
  const estado = reactive({
    stocks: [],
    producto: {
      id: '',
      cantidadMinima: 0,
    },
    alerta: 0,
    productosEnAlerta: [] as ProductoEnAlerta[],
    modal: {
      isShowCantidad: false,
      isShowAlertProduct: false,
      isShowVencidos: false,
      isShowAllProducts: false,
    },
    productosVencidos: [] as any[],
  });

  const obtenerTodoStock = async () => {
    const { entidadBuscar } = await stockService.obtenerTodoStock(
      useAuth.negocioElegido._id,
    );

    // console.log(entidadBuscar);
    estado.stocks = entidadBuscar[0].almacen.map((stock: any) => {
      const cantidadTotal = stock.lotes.reduce(
        (total: any, lote: any) => total + lote.cantidad,
        0,
      );
      const alertStyle =
        cantidadTotal <= stock.cantidadLimite
          ? 'background-color: #D8A460'
          : '';
      // const vencidoStyle =
      // cantidadTotal <= stock.cantidadLimite ? 'background-color: orange' : '';

      if (cantidadTotal <= stock.cantidadLimite) {
        estado.alerta++;
        // Verificar si el producto ya está en la lista de alerta
        const productoExistente = estado.productosEnAlerta.find(
          (p: any) => p.producto._id === stock.producto._id,
        );

        // Si no existe, agregarlo
        if (!productoExistente) {
          estado.productosEnAlerta.push({
            //@ts-ignore
            nombreProducto: stock.producto.nombre,
            foto: 'https://i.pinimg.com/564x/8d/1e/29/8d1e29fb76056c385d2d75117268c57d.jpg',
            producto: stock.producto,
            presentaciones: stock.producto.presentaciones,
            lotes: stock.lotes,
            cantidad: cantidadTotal,
            cantidadMinima: stock.cantidadLimite,
            alertStyle: alertStyle,
          });
        }
      } else {
        estado.alerta--;
        // Verificar si el producto está en la lista de alerta y quitarlo
        const index = estado.productosEnAlerta.findIndex(
          (p: any) => p.producto._id === stock.producto._id,
        );

        if (index !== -1) {
          estado.productosEnAlerta.splice(index, 1);
        }
      }

      return {
        nombreProducto: stock.producto.nombre,
        foto: 'https://i.pinimg.com/564x/8d/1e/29/8d1e29fb76056c385d2d75117268c57d.jpg',
        producto: stock.producto,
        presentaciones: stock.producto.presentaciones,
        lotes: stock.lotes,
        cantidad: cantidadTotal,
        cantidadMinima: stock.cantidadLimite,
        alertStyle: alertStyle,
      };
    });
    // console.log(estado.stocks);

    // ALERTA VENCIDOS
    // console.log(estado.stocks);
    estado.productosVencidos = estado.stocks
      .map((stock) => {
        //@ts-ignore
        const lotesVencidos = stock.lotes.filter((lote) => {
          const fechaActual = new Date();
          // const fechaVencimiento = new Date(
          //   lote.vencimiento.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'),
          // );
          const fechaVencimiento = new Date(lote.vencimiento);
          // console.log('sdasd');
          // console.log(fechaActual, fechaVencimiento);
          // Filtrar lotes vencidos
          return (
            fechaActual > fechaVencimiento || //@ts-ignore
            (fechaVencimiento - fechaActual) / (1000 * 60 * 60 * 24) <= 5
          );
        });
        // console.log(lotesVencidos);

        // Retornar solo el stock con lotes vencidos
        if (lotesVencidos.length > 0) {
          return {
            //@ts-ignore
            ...stock,
            alertStyle: 'background-color: #B0E0E6',
            lotes: lotesVencidos, // Sobrescribir lotes con solo los lotes vencidos
          };
        }

        return null; // No hay lotes vencidos para este stock
      })
      .filter(Boolean); // Filtrar los stocks que tienen lotes vencidos
    // console.log(estado.productosVencidos);
  };
  const formatearFecha = (date: any) => {
    return format(new Date(date), 'dd-MM-yyyy, EEEE', { locale: es });
  };

  const modalEditarCantidad = (row: any) => {
    estado.modal.isShowCantidad = true;
    estado.producto.id = row.producto._id;
    estado.producto.cantidadMinima = row.cantidadMinima;
  };

  const guardarCantidad = async () => {
    await stockService.modificarCantidad(
      useAuth.negocioElegido._id,
      estado.producto.id,
      estado.producto.cantidadMinima,
    );
    NotifySucess('Se actualizo correctamente');
    estado.modal.isShowCantidad = false;
    obtenerTodoStock();
  };

  const agregarListaInventario = (row: any) => {
    // console.log(row);
    const data = {
      id: row.producto.id,
      nombre: row.producto.nombre,
    };
    const isInList = useProduct.ListInventario.some((item) => {
      //@ts-ignore
      return item.id === data.id;
    });
    // console.log(isInList);
    if (!isInList) {
      useProduct.ListInventario.push(data);
      NotifySucess('Se añadio a la lista de inventario');
    } else {
      NotifyError('Ya se encuentra en la lista de  inventario');
    }
  };

  return {
    estado,
    formatearFecha,
    modalEditarCantidad,
    guardarCantidad,
    agregarListaInventario,
    obtenerTodoStock,
  };
};
