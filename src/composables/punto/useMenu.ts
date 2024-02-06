import { ref, reactive } from 'vue';
import { menuService } from '@/services/punto/menu.service';
import { authStore } from '@/stores/auth.store';
import { NotifySucessCenter } from '~/helpers/message.service';

export const useMenu = () => {
  const useAuth = authStore();
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
    const { entidadBuscarMenu } = await menuService.listarMenus(
      useAuth.negocioElegido._id,
    );
    estado.menus = entidadBuscarMenu;
  };
  const obtenerCatalogos = async () => {
    const { catalogoArbol } = await menuService.obtenerCatalogos();
    estado.catalogos = catalogoArbol.hijas;
  };

  const crearMenu = async () => {
    await menuService.crearMenu(
      useAuth.negocioElegido._id, //@ts-ignore
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
