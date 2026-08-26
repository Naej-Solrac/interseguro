import type { MatrixProcessRequest, MatrixProcessResponse } from '../models/matrix.model';

export interface MatrixRepository {
  process(payload: MatrixProcessRequest): Promise<MatrixProcessResponse>;
}
