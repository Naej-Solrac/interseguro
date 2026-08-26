// Aplicación: Caso de uso para obtener estadísticas de dos matrices
import { calculateMatrixStatistics } from '../../domain/entities/matrix-statistics.logic';
import { MatrixStatisticsCalculatorPort } from '../../domain/ports/matrix-statistics-calculator.port';
import { MatrixStatistics } from '../dtos/matrix-statistics.dto';

export interface MatricesStatisticsResult {
  Q: MatrixStatistics;
  R: MatrixStatistics;
  summary: MatrixStatistics;
  hasAnyDiagonalMatrix: boolean;
}

const defaultCalculator: MatrixStatisticsCalculatorPort = {
  calculate: calculateMatrixStatistics,
};

/**
 * Procesa dos matrices y retorna sus estadísticas.
 * @param qMatrix Primera matriz.
 * @param rMatrix Segunda matriz.
 * @returns Estadísticas de ambas matrices.
 */
export function getMatricesStatistics(
  qMatrix: number[][],
  rMatrix: number[][],
  calculator: MatrixStatisticsCalculatorPort = defaultCalculator
): MatricesStatisticsResult {
  const qStats = calculator.calculate(qMatrix);
  const rStats = calculator.calculate(rMatrix);

  const flattenedValues = [...qMatrix.flat(), ...rMatrix.flat()];
  const combinedRow = flattenedValues.map((value) => Number(value));
  const summary = calculator.calculate([combinedRow]);

  return {
    Q: qStats,
    R: rStats,
    summary,
    hasAnyDiagonalMatrix: qStats.isDiagonal || rStats.isDiagonal,
  };
}
