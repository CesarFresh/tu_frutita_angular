import { Comida } from './comida.model';
import { user } from './users';

export interface Recipe {
  idReceta?: number;
  usuarios: user[];
  planAlimenticio: Comida[];
}
