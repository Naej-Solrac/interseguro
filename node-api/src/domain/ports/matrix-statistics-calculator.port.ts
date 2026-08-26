import { MatrixStatistics } from '../entities/matrix-statistics.entity';

export interface MatrixStatisticsCalculatorPort {
  calculate(matrix: number[][]): MatrixStatistics;
}