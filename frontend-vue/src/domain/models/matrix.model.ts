export type Matrix = number[][];

export interface MatrixProcessRequest {
  data: Matrix;
}

export interface MatrixStats {
  avg: number;
  min: number;
  max: number;
  sum: number;
  isDiagonal: boolean;
}

export interface MatrixProcessResponse {
  qr_factorization: {
    Q: Matrix;
    R: Matrix;
  };
  statistics: {
    Q: MatrixStats;
    R: MatrixStats;
  };
}
