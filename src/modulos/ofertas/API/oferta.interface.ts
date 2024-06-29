export interface Oferta {
  _id?: string;
  _modificado?: string;
  _creado?: string;
  nombre: string;
  abreviacion: string;
  descripcion: string;
  precio: number;
  catalogo: string;
  idIngrediente: string;
  producto: {
    _id: string;
    nombre: string;
    presentacionBasica: string;
    presentaciones: null[];
  };
  cantidad: number;
  imagen: string;
}

export interface Catalogo {
  _id: string;
  nombre: string;
  ofertas?: Array<{
    nombre: string;
  }>;
  hijas?: Array<{
    _id: string;
    nombre: string;
    ofertas?: Array<{
      _id: string;
      nombre: string;
    }>;
    hijas?: Array<{
      _id: string;
      nombre: string;
      ofertas?: Array<{
        nombre: string;
      }>;
    }>;
  }>;
}
