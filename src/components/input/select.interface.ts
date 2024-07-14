export interface SelectOpcion {
  label: string;
  value: any;
  disable?: boolean;
}
export type selectOpcionCallback = (
  listaOpciones: SelectOpcion[],
) => SelectOpcion[];

export type CrearOpcionEvent = (
  event: 'crear:opcion',
  valor: string,
  objeto: any,
  callback: selectOpcionCallback,
) => void;
