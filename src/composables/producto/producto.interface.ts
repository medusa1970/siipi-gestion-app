/**
 * Typescript types para los objetos que vienene del backend
 */

export interface Categoria {
  _id: string;
  nombre: string;
  hijas: Categoria[];
}

export interface Producto {
  _id?: string;
  _modificado?: string;
  _creado?: string;
  nombre: string;
  comentario: string;
  categoria: { _id: string; nombre: string };
  imagen: string;
  variedades: Variedad[];
  empaques: Empaque[];
}

export interface Variedad {
  _id: string;
  marca: { _id: string; nombre: string };
  cantidadMin: number;
  cantidadMax: number;
  imagen: {
    cloudinaryUrl: string;
  };
}

export interface Empaque {
  nombre: string;
  abreviacion: string;
  marca: {
    _id: string;
    nombre: string;
  };
  cantidad: number;
}

/**
 * Typescript types para gestion en el frontend
 */

export interface CrearProductoBasico {
  nombre: string;
  categoria: string;
  comentario: string | null;
  imagen: {
    data: string; // ya debe venir en base64
    mimetype: string;
  } | null;
}

// export interface InventarioProps {
//   id: string;
//   nombre: string;
// }
