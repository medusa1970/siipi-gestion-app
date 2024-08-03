import { useOfertas } from "~/modulos/ofertas/ofertas.composable";

/**
 * Permisos requeridos para esta pagina
 */
export const permisosOfertaDetalle = ["ACCEDER"];

/**
 * Composable
 */
export const useOfertaDetalle = () => {
  const { store, authStore, estadoOfertas, router } = useOfertas();

  const estado = reactive({
    tab: "datosBasicos",
  });

  return { estado, store, authStore, router };
};
