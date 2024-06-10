import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '@/stores/auth.store';
import type { Negocio, PersonaProps } from '~/interfaces/product.interface';
import { authService } from '~/services/auth.service';
import auth from '~/middleware/auth';
import { DrogDrop } from '#build/components';
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

  const clearAuthPersona = () => {
    authPersona.value.usuario = '';
    authPersona.value.nombre = '';
    authPersona.value.apellido = '';
    authPersona.value.contrasena = '';
    authPersona.value.telefono = '';
    authPersona.value.correo = '';
  };
  /**
   * FUNCIONES
   */
  const login = async () => {
    await useAuth.login(
      authPersona.value.usuario,
      authPersona.value.contrasena,
    );
    LocalStorage.set('prohibido', {
      nombre: authPersona.value.usuario,
      contrasena: authPersona.value.contrasena,
    });
    clearAuthPersona();
  };

  const loginConEntidad = async () => {
    // console.log('loginConEntidad');
  };

  const elegirNegocio = async (negocio: Negocio) => {
    console.log(negocio);
    useAuth.negocioElegido = negocio;
    router.push(negocio.tipo.toLowerCase());
    interface DataProps {
      nombre: string;
      contrasena: string;
    } //@ts-ignore
    const data: DataProps = LocalStorage.getItem('prohibido');
    console.log(data);

    if (data) {
      const loginResponse = await authService.login(
        data.nombre,
        data.contrasena,
        negocio._id,
      );
      console.log(loginResponse);
      useAuth.token = loginResponse.token;
      useAuth.negocioElegido.permisos = loginResponse.permisos;
      useAuth.negocioElegido.cargos = loginResponse.cargos;
      console.log(useAuth.negocioElegido.cargos);
      console.log(useAuth.negocioElegido.permisos);
      console.log(useAuth.user.nombre);
      LocalStorage.remove('prohibido');
    }
  };
  const register = async () => {
    await useAuth.register(authPersona.value);
    clearAuthPersona();
    router.push('/');
  };

  return {
    authPersona,
    login,
    elegirNegocio,
    user,
    register,
    isPwd,
    loginConEntidad,
  };
};
