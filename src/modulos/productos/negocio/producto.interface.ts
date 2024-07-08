export interface CrearProductoBasico {
  nombre: string;
  categoria: string;
  comentario: string | null;
  imagen: {
    data: string; // ya debe venir en base64
    mimetype: string;
  } | null;
}

// export interface modificarProductoBasico {
//   nombre: string;
//   categoria: string;
//   comentario: string | null;
//   imagen: {
//     data: string; // ya debe venir en base64
//     mimetype: string;
//   } | null;
// }

// export interface InventarioProps {
//   id: string;
//   nombre: string;
// }
