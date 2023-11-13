import {
  showLoading,
  hideLoading,
  NotifyError,
  NotifySucess,
  ApiError
} from '@/helpers/message.service';
import { LocalStorage } from 'quasar';

export const authStore = defineStore('auth', {
  state: () => ({
    user: { nombre: '', negocios: [] as any[] },
    token: LocalStorage.getItem('token')
  }),
  actions: {
    async login(data: { usuario: string; contrasena: string }) {
      try {
        showLoading();
        const { conectar } = await GqlConectar({ data });

        if (!conectar?.token || !conectar?.persona?.nombre) {
          throw new Error('No se pudo conectar o el token es undefined');
        }
        LocalStorage.set('token', conectar.token);
        NotifySucess(`Bienvenido al sistema ${conectar.persona.nombre}`);
        const { buscarEntidadesConUsuario: res } =
          // @ts-ignore
          await GqlBuscarEntidadesConUsuario(useGqlToken(conectar.token));
        if (!res) throw new Error('No se pudo obtener los negocios');
        this.user.nombre = conectar.persona.nombre;
        this.user.negocios = res;
        hideLoading();
      } catch (error) {
        ApiError(error);
      }
    }
  }
});
