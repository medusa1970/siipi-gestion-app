import { useAuthStore } from '@/modulos/main/negocio/useAuthStore';
import { pedidoService } from '../../API/pedido.service';
import type { Catalogo } from '#gql';

export const useRealizarPedido = () => {
  const useAuth = useAuthStore();

  const estado = reactive({
    catalogosOfertas: [] as any[],
    catalogoSeleccionado: {} as any,
    searchResults: [] as any[],
    filter: '',
  });
  const filter = ref('');

  const obtenerCatalogosProductos = async () => {
    console.log(useAuth.negocio._id);
    const catalogoArbol = (await pedidoService.leerCatalogoConOfertas(
      useAuth.negocio._id,
    )) as Catalogo;
    estado.catalogosOfertas = catalogoArbol.hijas;

    estado.catalogoSeleccionado = catalogoArbol.hijas[0];
    estado.searchResults = catalogoArbol.hijas[0].hijas;

    estado.catalogoSeleccionado2 = catalogoArbol.hijas[0];
  };

  const obtenerListaOfertas = async () => {
    const menus = await menuService.listarMenus(useAuth.negocioElegido._id);
    // console.log(menus);

    const ofertas = await ofertaService.catalogoRecursivo(
      menus[0].catalogo._id,
    );
    estado.ListaOfertasPedido = ofertas;
    // console.log(estado.ListaOfertasPedido);
    // ofertaService.catalogoRecursivo()
  };
  const searchCatalog = (searchTerm: string) => {
    const catalogo = estado.catalogoSeleccionado; //@ts-ignore
    if (!catalogo.hijas) {
      //@ts-ignore
      return catalogo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        ? [catalogo]
        : [];
    }
    //@ts-ignore
    const results = catalogo.hijas.filter((hija: any) => {
      return (
        hija.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hija.ofertas.some((oferta: any) =>
          oferta.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      );
    });

    return results
      .map((hija: any) => {
        const filteredOfertas = hija.ofertas.filter((oferta: any) =>
          oferta.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        return { ...hija, ofertas: filteredOfertas };
      })
      .filter(
        (hija: any) =>
          hija.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hija.ofertas.length > 0,
      );
  };

  return {
    estado,
    obtenerCatalogosProductos,
    obtenerListaOfertas,
    searchCatalog,
    filter,
  };
};
