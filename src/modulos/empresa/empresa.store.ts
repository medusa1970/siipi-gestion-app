import type { Empleado } from '#gql';
import { useAuthStore } from '~/modulos/main/useAuthStore';

interface storeProps {
  empleados?: Empleado[];
  empleado: Empleado;
}

export const storeEmpresa = defineStore('empresa', {
  state: (): storeProps => ({
    empleados: null,
    empleado: null,
  }),

  getters: {
    getEmpleado: (state) => state.empleado,
  },

  actions: {
    /**
     * Retorna la lista de las empleados de la base de datos
     */
    async getEmpleados(): Promise<Empleado[]> {
      if (this.empleados == null) {
        try {
          const entidad = await api.buscarEntidad_empleados(
            useAuthStore().getNegocio._id,
          );
          console.log(1, entidad);
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
    },
  },

  persist: {
    paths: ['empleados'],
  },
});
