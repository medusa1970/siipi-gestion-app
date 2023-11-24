import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '@/stores/auth.store';
export const useAuth = () => {
  const useAuth = authStore();
  const router = useRouter();
  const user = ref(useAuth.user);
  const authPersona = ref({
    usuario: '',
    contrasena: '',
    nombre: '',
    telefono: '',
    correo: ''
  });

  const clearAuthPersona = () => {
    authPersona.value.usuario = '';
    authPersona.value.contrasena = '';
    authPersona.value.nombre = '';
    authPersona.value.telefono = '';
    authPersona.value.correo = '';
  };

  const login = async () => {
    await useAuth.login(
      authPersona.value.usuario,
      authPersona.value.contrasena
    );
    // console.log(useAuth.user);
    user.value.negocios.length === 0 && router.push('/cliente');
    clearAuthPersona();
  };
  const prueba = (negocio: { tipo: string; nombre: string; _id: string }) => {
    useAuth.negocioSelected = negocio.nombre;
    useAuth.negocioIDSelected = negocio._id;
    router.push(negocio.tipo.toLowerCase());
  };
  const register = async () => {
    const { usuario, ...registerData } = authPersona.value;
    console.log(registerData);
    await useAuth.register(registerData);
    router.push('/');
    clearAuthPersona();
  };

  return {
    authPersona,
    login,
    prueba,
    user,
    register
  };
};
