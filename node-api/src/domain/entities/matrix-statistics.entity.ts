// Entidad de dominio: estadísticas calculadas para una matriz.
export interface MatrixStatistics {
  max: number;
  min: number;
  avg: number;
  sum: number;
  isDiagonal: boolean;
}