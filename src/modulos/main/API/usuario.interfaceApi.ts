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
