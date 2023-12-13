import {
  showLoading,
  hideLoading,
  NotifySucess,
  ApiError
} from '@/helpers/message.service';
import { LocalStorage } from 'quasar';

export const authStore = defineStore('auth', {
  state: () => ({
    user: { _id: '', nombre: '', negocios: [] as any[] },
    token: '',
    negocioSelected: '',
    negocioIDSelected: '',
    negocioTipoSelected: ''
  }),
  actions: {
    async login(usuario: string, contrasena: string) {
      try {
        showLoading();
        const { conectar } = await GqlConectar({
          datos: { usuario, contrasena }
        });
        console.log(conectar);
        if (
          !conectar?.token ||
          !conectar?.persona?.nombre ||
          !conectar?.persona?._id
        )
          throw new Error('No se pudo conectar o el token es undefined');
        this.token = conectar.token;
        NotifySucess(`Bienvenido al sistema ${conectar.persona.nombre}`);
        const { buscarEntidadesConUsuario: res } =
          // @ts-ignore
          await GqlBuscarEntidadesConUsuario(useGqlToken(conectar.token));
        // console.log(res);
        if (!res) throw new Error('No se pudo obtener los negocios');
        this.user._id = conectar.persona._id;
        this.user.nombre = conectar.persona.nombre;
        this.user.negocios = res;
        console.log(this.user.negocios);
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
        const { personaCrear: res } = await GqlCrearPersona({ datos });
        NotifySucess(`${res.nombre} se ha registrado correctamente`);
        hideLoading();
      } catch (error) {
        ApiError(error);
      }
    }
  },
  persist: true
});
