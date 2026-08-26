// Infraestructura: Definición de rutas REST
import { Router } from 'express';
import { postMatrixStatsController } from './matrixController';
import { validate } from './middlewares/validator.middleware';
import { matrixStatsRequestSchema } from './schemas/matrix-stats-request.schema';

const matrixStatisticsHttpRouter = Router();

// Aplicamos el middleware de validación con el esquema específico
matrixStatisticsHttpRouter.post('/stats', validate(matrixStatsRequestSchema), postMatrixStatsController);

export default matrixStatisticsHttpRouter;
