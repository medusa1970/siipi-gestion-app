import type { CrearOfertaDto } from '#gql';

interface CrearOferta extends Omit<CrearOfertaDto, 'precioSinFactura'> {
  categoria?: string | null;
  precioSinFactura?: CrearOfertaDto['precioSinFactura'];
}

export type { CrearOferta };
