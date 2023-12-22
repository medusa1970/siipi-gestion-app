import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '@/stores/auth.store';
import type { Negocio, PersonaProps } from '~/interfaces/product.interface';
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
    correo: ''
  });

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
      authPersona.value.contrasena
    );
    if (useAuth.token && user.value.negocios.length === 0)
      router.push('/cliente');
    clearAuthPersona();
  };
  const elegirNegocio = (negocio: Negocio) => {
    useAuth.negocioElegido = negocio;
    router.push(negocio.tipo.toLowerCase());
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
    register
  };
};
