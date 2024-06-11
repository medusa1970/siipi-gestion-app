import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '@/stores/auth.store';
import type { Negocio, PersonaProps } from '~/interfaces/product.interface';
import { authService } from '~/services/auth.service';
import { useQuasar } from 'quasar';

export const useAuth = () => {
  /**
   * REACTIVIDAD Y ESTADO
   */
  const $q = useQuasar();
  const storeAuth = authStore();
  const router = useRouter();
  const user = ref(storeAuth.user);
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
    const res = await storeAuth.login(
      authPersona.value.usuario,
      authPersona.value.contrasena,
    );
    if (res) {
      const prohibido = {
        nombre: authPersona.value.usuario,
        contrasena: authPersona.value.contrasena,
      };
      LocalStorage.set('prohibido', prohibido);
      clearAuthPersona();
    }
  };

  /**
   * elegirNegocio
   */
  interface DataProps {
    nombre: string;
    contrasena: string;
  }
  const elegirNegocio = async (negocio: Negocio) => {
    storeAuth.negocioElegido = negocio;
    const path = negocio.tipo.toLowerCase();

    const data: DataProps | null = LocalStorage.getItem('prohibido');

    if (data) {
      $q.loading.show();
      const loginResponse = await authService.login(
        data.nombre,
        data.contrasena,
        negocio._id,
      );
      storeAuth.token = loginResponse.token;
      storeAuth.negocioElegido.permisos = loginResponse.permisos;
      storeAuth.negocioElegido.cargos = loginResponse.cargos;
      localStorage.clear();
      router.push(path);

      $q.loading.hide();
    }
  };

  /**
   * register
   */
  const register = async () => {
    await storeAuth.register(authPersona.value);
    clearAuthPersona();
    router.push('/');
  };

  /**
   * checkPermisos
   */
  const checkPermisos = (permisosRequeridos: string[]) => {
    const userPermisos = storeAuth.negocioElegido.permisos ?? [];
    permisosRequeridos.push('DESAROLLO');
    if (permisosRequeridos.length > 0) {
      for (const permisoRequerido of permisosRequeridos) {
        if (userPermisos.includes(permisoRequerido)) {
          // console.log('autorizado con', permisoRequerido);
          return true;
        }
      }
      return false;
    } else {
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
    storeAuth,
  };
};
