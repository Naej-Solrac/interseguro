import type { MatrixProcessRequest, MatrixProcessResponse } from '../../domain/models/matrix.model';
import type { MatrixRepository } from '../../domain/repositories/matrix.repository';

export class ProcessMatrixUseCase {
  private readonly matrixRepository: MatrixRepository;

  constructor(matrixRepository: MatrixRepository) {
    this.matrixRepository = matrixRepository;
  }

  execute(payload: MatrixProcessRequest): Promise<MatrixProcessResponse> {
    return this.matrixRepository.process(payload);
  }
}
