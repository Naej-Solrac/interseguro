import { defineStore } from 'pinia';
import type { MatrixProcessResponse } from '../../domain/models/matrix.model';
import { MatrixApiRepository } from '../../infrastructure/repositories/matrixApi.repository';
import { ProcessMatrixUseCase } from '../../application/useCases/processMatrix.useCase';

interface MatrixState {
  result: MatrixProcessResponse | null;
  loading: boolean;
  error: string | null;
}

const matrixRepository = new MatrixApiRepository();
const processMatrixUseCase = new ProcessMatrixUseCase(matrixRepository);

export const useMatrixStore = defineStore('matrix', {
  state: (): MatrixState => ({
    result: null,
    loading: false,
    error: null,
  }),
  actions: {
    async processMatrix(data: number[][]) {
      this.loading = true;
      this.error = null;

      try {
        this.result = await processMatrixUseCase.execute({ data });
      } catch (error: any) {
        this.error = error?.response?.data?.error ?? 'No se pudo procesar la matriz';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    clearResult() {
      this.result = null;
      this.error = null;
    },
  },
});
