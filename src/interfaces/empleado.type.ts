export interface Empleado {
  _id: string;
  persona: Persona;
  cargos: Cargo[];
  permisos: Permiso[];
}

export interface Permiso {
  _id: string;
  permiso: String;
  vencimiento: Date | null;
}

export interface Cargo {
  _id: string;
  nombre: String;
}

export interface Persona {
  _id?: string | null | undefined;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  imagen: {
    cloudinaryUrl: string;
  };
}
