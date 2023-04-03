export interface Comida {
  idComida: number;
  comida: string;
  cantidad: number;
  categoria: Categoria
}

export interface Categoria {
  idCategoria: number;
  nombre: string;
}
