export interface SelectOpcion {
  label: string;
  value: any;
  disable?: boolean;
}
export type selectOpcionCallback = (
  listaOpciones: SelectOpcion[]
) => SelectOpcion[];
