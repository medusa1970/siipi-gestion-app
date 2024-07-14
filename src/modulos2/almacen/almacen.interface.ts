import type { SelectOpcion } from '@/components/input/select.interface';
export interface CategoriaSelectOpcion extends SelectOpcion {
  class: 'titulo' | 'opcion';
}
