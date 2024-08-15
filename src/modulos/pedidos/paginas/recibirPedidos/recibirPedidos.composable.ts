import { useOfertas } from '~/modulos/ofertas/ofertas.composable';
import { storePedido } from '@/modulos/pedidos/pedidos.store';
import { useAuthStore } from '@/modulos/main/useAuthStore';

export const useRecibirPedidos = () => {
  const { store } = useOfertas();
  const authStore = useAuthStore();
  const pedidoStore = storePedido();
  const estado = reactive({
    catalogo: [],

    catalogoSeleccionado: {} as any,
    searchResults: [] as any[]
  });
  const filter = ref('');
  // console.log(store.catalogoArbol);

  // const test = store.catalogoArbol.hijas.find(
  //   hija => hija.nombre == 'CATHERING'
  // );
  // console.log(test);

  onMounted(async () => {
    pedidoStore.isDespachar = false;
    store.catalogoArbol = await store.getCatalogoArbol();
    const catalogo = store.catalogoArbol.hijas.find(
      hija => hija.nombre === 'CATHERING'
    );
    estado.catalogo = catalogo.hijas;
    estado.catalogoSeleccionado = catalogo.hijas[0];
    estado.searchResults = [catalogo.hijas[0]];
    pedidoStore.area = {
      _id: '665ff70dbc13d4eedbf0ea5b',
      nombre: 'Area Proveedor'
    };
    // console.log(catalogo.hijas[0]);
  });

  return { estado, store, filter, authStore };
};
