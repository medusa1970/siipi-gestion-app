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
  medida: {
    _id: string;
    nombre: string;
    tipoEmpaques: {
      nombre: string;
      abreviacion: string;
      cantidad: number;
    }[];
  };
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
