import {
  showLoading,
  hideLoading,
  NotifySucess,
  ApiError
} from '@/helpers/message.service';
import { LocalStorage } from 'quasar';

export const authStore = defineStore('auth', {
  state: () => ({
    user: { nombre: '', negocios: [] as any[] },
    token: '',
    negocioSelected: '',
    negocioIDSelected: ''
  }),
  actions: {
    async login(usuario: string, contrasena: string) {
      try {
        showLoading();
        const { conectar } = await GqlConectar({
          datos: { usuario, contrasena }
        });
        if (!conectar?.token || !conectar?.persona?.nombre)
          throw new Error('No se pudo conectar o el token es undefined');
        this.token = conectar.token;
        NotifySucess(`Bienvenido al sistema ${conectar.persona.nombre}`);
        const { buscarEntidadesConUsuario: res } =
          // @ts-ignore
          await GqlBuscarEntidadesConUsuario(useGqlToken(conectar.token));
        // console.log(res);
        if (!res) throw new Error('No se pudo obtener los negocios');
        this.user.nombre = conectar.persona.nombre;
        this.user.negocios = res;
        hideLoading();
      } catch (error) {
        ApiError(error);
      }
    },

    async register(datos: {
      nombre: string;
      telefono: string;
      correo: string;
      contrasena: string;
    }) {
      try {
        showLoading();
        const { crearPersona: res } = await GqlCrearPersona({ datos });
        NotifySucess(`${res.nombre} se ha registrado correctamente`);
        hideLoading();
      } catch (error) {
        ApiError(error);
      }
    }
  },
  persist: true
});
