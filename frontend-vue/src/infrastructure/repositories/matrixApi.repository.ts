import type { MatrixRepository } from '../../domain/repositories/matrix.repository';
import type { MatrixProcessRequest, MatrixProcessResponse } from '../../domain/models/matrix.model';
import { apiClient } from '../api/apiClient';

export class MatrixApiRepository implements MatrixRepository {
  async process(payload: MatrixProcessRequest): Promise<MatrixProcessResponse> {
    const { data } = await apiClient.post<MatrixProcessResponse>('/matrix/process', payload);
    return data;
  }
}
