import { NotifySucess } from '@/helpers/message.service';
import type {
  Negocio,
  UserProps,
  PersonaProps,
} from '~/interfaces/product.interface';
import { authService } from '@/services/auth.service';

/**
 * AuthStore: Almacén de estado para la autenticación
 * Contiene información sobre el usuario autenticado, el token y el negocio seleccionado.
 */
interface AuthStoreProps {
  user: UserProps;
  token: string;
  negocioElegido: Negocio;
}
const estadoInicial: AuthStoreProps = {
  user: {
    _id: '',
    nombre: '',
    apellido: '',
    cargo: '',
    correo: '',
    usuario: '',
    negocios: [],
    imagen: '',
  },
  token: '',
  negocioElegido: {
    _id: '',
    nombre: '',
    tipo: '',
  },
};

export const authStore = defineStore('auth', {
  state: (): AuthStoreProps => estadoInicial,
  actions: {
    async login(usuario: string, contrasena: string) {
      const { conectar } = await authService.login(usuario, contrasena);
      console.log(conectar);
      this.user._id = conectar.persona._id;
      this.user.nombre = conectar.persona.nombre;
      this.user.usuario = conectar.persona.usuario;
      this.user.apellido = conectar.persona.apellido;
      this.user.correo = conectar.persona.correo;

      conectar.persona.imagen.cloudinaryUrl === null
        ? (this.user.imagen = '')
        : (this.user.imagen = conectar.persona.imagen.cloudinaryUrl);
      // this.user.imagen = conectar.persona.imagen.cloudinaryUrl;
      this.token = conectar.token;

      NotifySucess(`Bienvenido al sistema ${this.user.nombre}`);
      const { entidadesUsuarioConectado } =
        await authService.buscarEntidadesDeUsuario(this.token);
      this.user.negocios = entidadesUsuarioConectado;
      this.user.negocios.push({
        _id: 'cliente',
        nombre: 'Cliente',
        tipo: 'CLIENTE',
      });
    },
    async register(datos: PersonaProps) {
      const { personaCrear } = await authService.registrar(datos);
      NotifySucess(`${personaCrear.nombre} se ha registrado correctamente`);
    },
  },
  persist: true,
});
