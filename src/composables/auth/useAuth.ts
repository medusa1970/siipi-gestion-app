import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '@/stores/auth.store';
import type { Negocio, PersonaProps } from '~/interfaces/product.interface';
import { authService } from '~/services/auth.service';

export const useAuth = () => {
  /**
   * REACTIVIDAD Y ESTADO
   */
  const useAuth = authStore();
  const router = useRouter();
  const user = ref(useAuth.user);
  const authPersona = ref<PersonaProps>({
    usuario: '',
    nombre: '',
    apellido: '',
    contrasena: '',
    telefono: '',
    correo: '',
  });
  const isPwd = ref(true);

  /**
   * clearAuthPersona
   */
  const clearAuthPersona = () => {
    authPersona.value.usuario = '';
    authPersona.value.nombre = '';
    authPersona.value.apellido = '';
    authPersona.value.contrasena = '';
    authPersona.value.telefono = '';
    authPersona.value.correo = '';
  };

  /**
   * login
   */
  const login = async () => {
    await useAuth.login(
      authPersona.value.usuario,
      authPersona.value.contrasena,
    );
    const prohibido = {
      nombre: authPersona.value.usuario,
      contrasena: authPersona.value.contrasena,
    };
    LocalStorage.set('prohibido', prohibido);
    // console.log('set prohibido:', prohibido);
    clearAuthPersona();
  };

  /**
   * elegirNegocio
   */
  const elegirNegocio = async (negocio: Negocio) => {
    // console.log(negocio);
    useAuth.negocioElegido = negocio;
    router.push(negocio.tipo.toLowerCase());
    interface DataProps {
      nombre: string;
      contrasena: string;
    }

    const data: DataProps | null = LocalStorage.getItem('prohibido');
    // console.log('data:', data);

    if (data === null) {
      // TODO redirect a login
    }

    if (data) {
      const loginResponse = await authService.login(
        data.nombre,
        data.contrasena,
        negocio._id,
      );
      // console.log(loginResponse);
      useAuth.token = loginResponse.token;
      useAuth.negocioElegido.permisos = loginResponse.permisos;
      useAuth.negocioElegido.cargos = loginResponse.cargos;
      // console.log(useAuth.negocioElegido.cargos);
      // console.log(useAuth.negocioElegido.permisos);
      // console.log(useAuth.user.nombre);
      LocalStorage.remove('prohibido');
    }
  };

  /**
   * register
   */
  const register = async () => {
    await useAuth.register(authPersona.value);
    clearAuthPersona();
    router.push('/');
  };

  /**
   * checkPermisos
   */
  const checkPermisos = (permisosRequeridos: string[]) => {
    const userPermisos = useAuth.negocioElegido.permisos ?? [];
    if (permisosRequeridos.length > 0) {
      for (const permisoRequerido of permisosRequeridos) {
        if (userPermisos.includes(permisoRequerido)) {
          console.log('autorizado con', permisoRequerido);
          return true;
        }
      }
      console.log('no autorizado');
      return false;
    } else {
      console.log('autorizado normal');
      return true;
    }
  };

  return {
    checkPermisos,
    authPersona,
    login,
    elegirNegocio,
    user,
    register,
    isPwd,
  };
};
