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
    console.log(entidadBuscarEmpleado);
    estado.rows = entidadBuscarEmpleado.map((empleado: Empleado) => {
      return {
        id: empleado._id,
        personaID: empleado.persona._id,
        cargo: empleado.cargo,
        nombre: empleado.persona.nombre + ' ' + empleado.persona.apellido,
        correo: empleado.persona.correo,
        telefono: empleado.persona.telefono,
        foto:
          empleado.persona.imagen.cloudinaryUrl === null
            ? 'https://i.pinimg.com/564x/20/c0/0f/20c00f0f135c950096a54b7b465e45cc.jpg'
            : empleado.persona.imagen.cloudinaryUrl,
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
    const { entidadCrearEmpleado } = await empleadoService.agregarEmpleado(
      useAuth.negocioElegido._id, //@ts-ignore
      estado.personaSelect.nombre.id,
      estado.cargo,
    );
    await empleadoService.agregarRolEmpleado(
      useAuth.negocioElegido._id,
      entidadCrearEmpleado.persona._id,
      estado.cargo,
    );
    NotifySucessCenter('Empleado agregado correctamente');
    obtenerTodosEmpleados();
    buscarPersonas();
    estado.personaSelect.nombre = '';
    estado.cargo = '';
    estado.test = false;
  };

  const borrarEmpleado = async (row: {
    id: string;
    nombre: string;
    cargo: string;
    personaID: string;
  }) => {
    $q.dialog({
      title: `Eliminar ${row.nombre}`,
      message: '¿Está seguro de eliminar este articulo?',
      cancel: true,
      persistent: true,
    }).onOk(async () => {
      await empleadoService.borrarEmpleado(useAuth.negocioElegido._id, row.id);
      await empleadoService.eliminarRolEmpleado(
        useAuth.negocioElegido._id,
        row.personaID,
        row.cargo,
      );
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
