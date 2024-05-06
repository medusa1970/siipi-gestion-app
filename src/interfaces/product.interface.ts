/**
 * PERSONA
 */
export interface UserProps {
  _id: string;
  nombre: string;
  usuario: string;
  cargo: string;
  apellido: string;
  correo: string;
  negocios: Negocio[];
  imagen: string;
}
export interface Negocio {
  _id?: string | null | undefined;
  nombre: string;
  tipo: string;
}
export interface PersonaProps {
  _id?: string | null | undefined;
  usuario: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  contrasena: string;
}

/**
 * PRODUCTOS
 * Interface para el modelo de datos de productos
 */
export interface Product {
  _id?: string;
  nombre: string;
  comentario: string;
  presentacionBasica: string;
  presentaciones: Presentacion[];
  categoria: { _id: string; nombre: string };
}
export interface Presentacion {
  _id?: string | null | undefined;
  nombre: string;
  cantidad: number;
}
