import type { Empleado, Entidad } from '#gql';
import { useAuthStore } from '~/modulos/main/useAuthStore';

interface storeProps {
  empleados?: Empleado[];
  empleado: Empleado;
  entidad: Entidad;
  infoPedidos: any[];
}

/**
 * 1 : el proximo lunes
 * 0 : el ultimo lunes
 * -1: el lunes la semana anterior
 * -2: etc...
 */
export const lunes = (semana = 0) => {
  // hoy, a las 00:00:00
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);

  // lunes anterior
  const lunes = new Date(today);
  lunes.setDate(today.getDate() - today.getDay() + 1 + 7 * semana);
  return lunes;
};

export const storeEmpresa = defineStore('empresa', {
  state: (): storeProps => ({
    empleados: null,
    empleado: null,
    entidad: null,
    infoPedidos: null
  }),

  getters: {
    entidadId: state => useRoute()?.params.id
  },

  actions: {
    /**
     * define la entidad actual que se esta modificando en pagina de detalles
     */
    async useEntidad(): Promise<void> {
      if (!this.entidad || this.entidadId !== this.entidad._id) {
        try {
          this.entidad = await api.buscarEntidad_basico(
            this.entidadId as string
          );
        } catch (err) {
          errFallBack(err);
        }
      }
    },

    /**
     * define el empleado actual que se esta modificando en pagina de detalles
     */
    async useEmpleado(id): Promise<Empleado> {
      const empleados = await this.getEmpleados();
      this.empleado = empleados.find(e => e._id === id);
      return this.empleado;
    },

    /**
     * Retorna la lista de las empleados de la base de datos
     */
    async getEmpleados(): Promise<Empleado[]> {
      if (!this.empleados) {
        try {
          const entidad = await api.buscarEntidad_empleados(
            useAuthStore().getNegocio._id
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

    /**
     *  Teroreria
     */
    async getInfoPedidos(refresh = false): Promise<any[]> {
      if (refresh || !this.infoPedidos) {
        this.infoPedidos = [];
        try {
          const pedidos = await api.buscarPedidos({
            vendedor: [useAuthStore().getNegocio._id]
          });

          for (const pedido of pedidos) {
            let encontrado = this.infoPedidos.findIndex(
              p => p.entidad._id === pedido.comprador._id
            );
            if (encontrado == -1) {
              this.infoPedidos.push({
                entidad: pedido.comprador,
                semanaActual: [],
                semanasAnteriores: []
              });
              encontrado = this.infoPedidos.length - 1;
            }
            const date = new Date(pedido._creado);
            if (date >= lunes(0)) {
              this.infoPedidos[encontrado].semanaActual.push(pedido);
            } else {
              this.infoPedidos[encontrado].semanasAnteriores.push(pedido);
            }
          }
        } catch (err) {
          errFallBack(err);
          return null;
        }
      }
      return this.infoPedidos;
    }
  },

  persist: {
    paths: ['empleados']
  }
});
