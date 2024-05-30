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
      const loginResponse = await authService.login(usuario, contrasena);
      console.log(loginResponse);
      this.user._id = loginResponse.persona._id;
      this.user.nombre = loginResponse.persona.nombre;
      this.user.usuario = loginResponse.persona.usuario;
      this.user.apellido = loginResponse.persona.apellido;
      this.user.correo = loginResponse.persona.correo;
      this.user.imagen = loginResponse.persona.imagen?.cloudinaryUrl;

      // if (loginResponse.persona.imagen?.cloudinaryUrl) {
      //   this.user.imagen = loginResponse.persona.imagen.cloudinaryUrl;
      // } else {
      //   this.user.imagen = '';
      // }
      this.token = loginResponse.token;

      NotifySucess(`Bienvenido al sistema ${this.user.nombre}`);
      this.user.negocios = await authService.buscarEntidadesDeUsuario(
        this.token,
      );
      this.user.negocios.push({
        _id: 'cliente',
        nombre: 'Cliente',
        tipo: 'CLIENTE',
      });
    },
    async register(datos: PersonaProps) {
      const nuevaPersona = await authService.registrar(datos);
      NotifySucess(`${nuevaPersona.nombre} se ha registrado correctamente`);
    },
  },
  persist: true,
});
