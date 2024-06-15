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

  // ESTADO REACTIVO DE EMPLEADOS
  const estado = reactive({
    test: false,
    personaSelect: { id: '', nombre: '' },
    personas: [{ id: '', nombre: '' }],
    cargo: '',
    permisos: [],
    rows: [],
  });

  // FILTER INPUT
  const optionsPersona = ref(estado.personas);

  /**
   * obtenerTodosEmpleados
   */
  const obtenerTodosEmpleados = async () => {
    const listaEmpleados = await empleadoService.obtenerTodosEmpleados(
      useAuth.negocioElegido._id,
    );

    estado.rows = listaEmpleados.map((empleado: Empleado) => {
      // console.log(empleado);
      // if (empleado.penegocioElegidorsona.imagen?.cloudinaryUrl) {
      //   console.log(empleado);
      // }
      return {
        id: empleado._id,
        personaID: empleado.persona._id,
        cargo: empleado.cargos[0].nombre,
        permisos: empleado.permisos.map((p) => p.permiso),
        nombre: empleado.persona.nombre + ' ' + empleado.persona.apellido,
        correo: empleado.persona.correo,
        telefono: empleado.persona.telefono,
        foto:
          empleado.persona.imagen?.cloudinaryUrl == null
            ? 'https://i.pinimg.com/564x/20/c0/0f/20c00f0f135c950096a54b7b465e45cc.jpg'
            : empleado.persona.imagen.cloudinaryUrl,
      };
    });
    // console.log(estado.rows);
  };

  /**
   * buscarPersonas
   */
  const buscarPersonas = async () => {
    const listaPersonas = await empleadoService.buscarPersonas();
    estado.personas = listaPersonas?.map((persona: Persona) => {
      return {
        id: persona._id,
        nombre: persona.nombre,
      };
    });
  };

  /**
   * abrirPermisos
   */
  const abrirPermisos = (row: { id: string }) =>
    router.push(`/cathering/sede/empleados/${row.id}`);

  /**
   * abrirModal
   */
  const abrirModal = () => (estado.test = true);

  /**
   * agregarEmpleado
   */
  const agregarEmpleado = async () => {
    const nuevoEmpleado = await empleadoService.agregarEmpleado(
      useAuth.negocioElegido._id,
      estado.personaSelect.nombre.id,
      estado.cargo,
      estado.permisos,
    );
    NotifySucessCenter('Empleado agregado correctamente');
    obtenerTodosEmpleados();
    buscarPersonas();
    estado.personaSelect.nombre = '';
    estado.cargo = '';
    estado.test = false;
  };

  /**
   * borrarEmpleado
   */
  const borrarEmpleado = async (row: {
    id: string;
    nombre: string;
    cargo: string;
    personaID: string;
  }) => {
    /**
     * NO SE BORRA UN EMPLEADO - SE LE VENCE SUS PERMISOS Y LE BORRA CARGOS
     */
    $q.dialog({
      title: `Eliminar ${row.nombre}`,
      message: '¿Está seguro de eliminar este empleado?',
      cancel: true,
      persistent: true,
    }).onOk(async () => {
      console.log(
        'no se borra un empleado - se le vencen sus permisos y se borra sus cargos',
      );
      // await empleadoService.borrarEmpleado(useAuth.negocioElegido._id, row.id);
      // await empleadoService.eliminarRolEmpleado(
      //   useAuth.negocioElegido._id,
      //   row.personaID,
      //   row.cargo,
      // );
      // NotifySucessCenter('Empleado eliminado');
      // obtenerTodosEmpleados();
    });
  };

  /**
   * filterEmpleados
   */
  const filterEmpleados = (val: any, update: any) => {
    update(() => {
      let needle = val.toLowerCase();
      optionsPersona.value = estado.personas.filter((item: any) =>
        item.nombre.toLowerCase().includes(needle),
      );
    });
  };
  // const filterEmpleados2 = () => filterEmpleados(optionsPersona.value, estado.personas)

  onMounted(() => {
    obtenerTodosEmpleados();
    buscarPersonas();
  });

  return {
    estado,
    abrirPermisos,
    abrirModal,
    agregarEmpleado,
    borrarEmpleado,
    filterEmpleados,
    optionsPersona,
  };
};
