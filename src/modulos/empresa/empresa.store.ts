import type { Empleado } from "#gql";
import { useAuthStore } from "~/modulos/main/useAuthStore";

interface storeProps {
  empleados?: Empleado[];
  empleado: Empleado;
}

export const storeEmpresa = defineStore("empresa", {
  state: (): storeProps => ({
    empleados: null,
    empleado: null,
  }),

  getters: {},

  actions: {
    /**
     * define el empleado actual que se esta modificando en pagina de detalles
     */
    async useEmpleado(id): Promise<Empleado> {
      const empleados = await this.getEmpleados();
      this.empleado = empleados.find((e) => e._id === id);
      return this.empleado;
    },

    /**
     * Retorna la lista de las empleados de la base de datos
     */
    async getEmpleados(): Promise<Empleado[]> {
      if (!this.empleados) {
        try {
          const entidad = await api.buscarEntidad_empleados(
            useAuthStore().getNegocio._id,
          );
          this.empleados = entidad.empleados;
        } catch (err) {
          errFallBack(err);
          return;
        }
      }
      return this.empleados;
    },
    async refreshEmpleados(): Promise<void> {
      this.empleados = null;
      await this.getEmpleados();
      if (this.empleado) {
        await this.useEmpleado(this.empleado._id);
      }
    },
  },

  persist: {
    paths: ["empleados"],
  },
});
