export interface Presentacion {
  _id?: string;
  nombre: string;
  cantidad: number;
}
export interface Product {
  _id?: string;
  nombre: string;
  descripcion: string;
  tags: Array<string>;
  presentacionBasica: string;
  presentaciones: Presentacion[];
}
