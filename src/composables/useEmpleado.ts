import { reactive } from 'vue';
import { authStore } from '@/stores/auth.store';
import { useRouter } from 'vue-router';
import { NotifySucessCenter } from '@/helpers/message.service';
import { useQuasar } from 'quasar';
import { empleadoService } from '@/services/empleados.service';
import type { Empleado, Persona } from '~/interfaces/empleado.type';

export const useEmpleado = () => {
  // CONFIGURACION INCIAL
  const router = useRouter();
  const useAuth = authStore();
  const $q = useQuasar();

  // STADO REACTIVO DE EMPLEADOS
  const estado = reactive({
    test: false,
    personaSelect: { id: '', nombre: '' },
    personas: [{ id: '', nombre: '' }],
    cargo: '',
    rows: [],
  });

  const obtenerTodosEmpleados = async () => {
    const { entidadBuscarEmpleado } =
      await empleadoService.obtenerTodosEmpleados(
        useAuth.negocioElegido.nombre,
      );
    estado.rows = entidadBuscarEmpleado.map((empleado: Empleado) => {
      return {
        id: empleado._id,
        cargo: empleado.cargo,
        nombre: empleado.persona.nombre + ' ' + empleado.persona.apellido,
        correo: empleado.persona.correo,
        telefono: empleado.persona.telefono,
        foto: 'https://i.pinimg.com/564x/bf/e6/ee/bfe6ee11981399a846f03f8af9105a30.jpg',
      };
    });
    // console.log(estado.rows);
  };

  const buscarPersonas = async () => {
    const { personaBuscar } = await empleadoService.buscarPersonas();
    estado.personas = personaBuscar?.map((persona: Persona) => {
      return {
        id: persona._id,
        nombre: persona.nombre,
      };
    });
  };

  const abrirPermisos = (row: { id: string }) =>
    router.push(`/sede/empleados/${row.id}`);

  const abrirModal = () => (estado.test = true);

  const agregarEmpleado = async () => {
    await empleadoService.agregarEmpleado(
      useAuth.negocioElegido._id, //@ts-ignore
      estado.personaSelect.nombre.id,
      estado.cargo,
    );
    NotifySucessCenter('Empleado agregado correctamente');
    obtenerTodosEmpleados();
    buscarPersonas();
    estado.personaSelect.nombre = '';
    estado.cargo = '';
    estado.test = false;
  };

  const borrarEmpleado = async (row: { id: string; nombre: string }) => {
    $q.dialog({
      title: `Eliminar ${row.nombre}`,
      message: '¿Está seguro de eliminar este articulo?',
      cancel: true,
      persistent: true,
    }).onOk(async () => {
      console.log(useAuth.negocioElegido._id, row.id);
      await empleadoService.borrarEmpleado(useAuth.negocioElegido._id, row.id);
      NotifySucessCenter('Empleado eliminado');
      obtenerTodosEmpleados();
    });
  };

  onMounted(() => {
    obtenerTodosEmpleados();
    buscarPersonas();
  });

  return { estado, abrirPermisos, abrirModal, agregarEmpleado, borrarEmpleado };
};
