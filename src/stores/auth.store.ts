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
    correo: '',
    telefono: '',
    usuario: '',
    negocios: [],
    imagen: '',
  },
  token: '',
  negocioElegido: {
    _id: '',
    nombre: '',
    tipo: '',
    cargos: [],
    permisos: [],
  },
};

export const authStore = defineStore('auth', {
  state: (): AuthStoreProps => estadoInicial,
  actions: {
    async login(usuario: string, contrasena: string) {
      const loginResponse = await authService.login(usuario, contrasena);
      NotifySucess(`Bienvenido al sistema ${this.user.nombre}`);

      this.token = loginResponse.token;
      this.user._id = loginResponse.personaId;
      this.user.nombre = loginResponse.nombre;
      this.user.usuario = loginResponse.usuario;
      this.user.apellido = loginResponse.apellido;
      this.user.correo = loginResponse.correo;
      this.user.telefono = loginResponse.telefono;
      this.user.imagen = loginResponse.cloudinaryUrl;
      this.user.permisos = loginResponse.permisos;
      this.user.cargos = loginResponse.cargos;
      this.user.negocios = await authService.buscarEntidadesDeUsuario(
        loginResponse.personaID,
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
