import { ref, reactive } from 'vue';
import { menuService } from '~/services/menu.service';

export const useMenu = () => {
  const authStore = useAuthStore();
  const estado = reactive({
    menus: [],
    modal: {
      isAddMenu: false,
    },
    catalogos: [],
    menu: {
      catalogo: '',
      exepciones: [],
    },
  });

  const obtenerMenus = async () => {
    // console.log(authStore.negocio._id);
    const menus = await menuService.listarMenus(authStore.negocio._id);
    // console.log(menus);
    estado.menus = menus;
  };
  const obtenerCatalogos = async () => {
    const catalogoArbol = await menuService.obtenerCatalogos();
    estado.catalogos = catalogoArbol.hijas;
  };

  const crearMenu = async () => {
    await menuService.crearMenu(
      authStore.negocio._id, //@ts-ignore
      estado.menu.catalogo._id,
      estado.menu.exepciones,
    );
    NotifySucessCenter('Menu creado con exito');
    estado.modal.isAddMenu = false;
    obtenerMenus();
  };

  return {
    estado,
    obtenerMenus,
    obtenerCatalogos,
    crearMenu,
  };
};
