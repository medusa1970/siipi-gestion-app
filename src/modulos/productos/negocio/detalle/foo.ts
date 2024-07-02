// crear una medida (global)
const crearMedidaGlobal = async () => {
  const medidaNueva = await productoService.crearMedida({
    nombre: estado.medida.nombre,
  });
  if (medidaNueva) {
    NotifySucessCenter('Medida creado correctamente');
    estado.medidas.push(medidaNueva);
    estado.datos_productoMedida.medida = medidaNueva;
  }
  estado.modal.show_crearMedida = false;
  estado.medida.nombre = '';
};

const crearEmpaqueGlobal = async () => {
  const medidaConEmpaqueNuevo = await productoService.agregarEmpaqueMedida(
    estado.datos_productoMedida.medida._id,
    estado.empaque,
  );

  if (medidaConEmpaqueNuevo) {
    NotifySucessCenter('Empaque creado correctamente');
    const nuevoEmpaque = medidaConEmpaqueNuevo.tipoEmpaques.pop();
    estado.datos_productoMedida.empaque = nuevoEmpaque;
    delete nuevoEmpaque._id;
    estado.datos_productoMedida.medida.tipoEmpaques.push(nuevoEmpaque);
  }

  estado.empaque = { nombre: '', abreviacion: '', cantidad: 0 };
  estado.modal.show_crearEmpaque = false;
};
