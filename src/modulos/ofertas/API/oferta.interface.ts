export interface Oferta {
  _id?: string;
  _modificado?: string;
  _creado?: string;
  nombre: string;
  abreviacion: string;
  catalogo: { _id: string; nombre: string };
  ingredientes: {
    tipo?: string;
    producto: {
      _id: string;
      nombre: string;
    };
    marca: {
      _id: string;
      nombre: string;
    };
    cantidad: number;
  }[];
  precioSinFactura: number;
  precioConFactura: number;
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
