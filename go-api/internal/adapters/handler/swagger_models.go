package handler

// LoginSuccessResponse representa la respuesta exitosa del login.
type LoginSuccessResponse struct {
	Token string `json:"token" example:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImplYW4iLCJleHAiOjE3MjQ4MDMyMDB9.X7c7qz5RrYv7J7uVv1pH0mKx3jRrVQh2rH8J0W9k3Pk"`
}

// ErrorResponse representa el formato de error estándar.
type ErrorResponse struct {
	Error string `json:"error" example:"Credenciales invalidas"`
}

// MatrixStatisticsDoc representa estadísticas calculadas para una matriz.
type MatrixStatisticsDoc struct {
	Max        float64 `json:"max" example:"7.437"`
	Min        float64 `json:"min" example:"-0.345"`
	Avg        float64 `json:"avg" example:"1.96875"`
	Sum        float64 `json:"sum" example:"15.75"`
	IsDiagonal bool    `json:"isDiagonal" example:"false"`
}

// MatrixStatisticsBundleDoc representa el bloque de estadísticas de la respuesta.
type MatrixStatisticsBundleDoc struct {
	Q                   MatrixStatisticsDoc `json:"Q"`
	R                   MatrixStatisticsDoc `json:"R"`
	Summary             MatrixStatisticsDoc `json:"summary"`
	HasAnyDiagonalMatrix bool               `json:"hasAnyDiagonalMatrix" example:"false"`
}

// QRFactorizationDoc representa la salida de la factorización QR.
type QRFactorizationDoc struct {
	Q [][]float64 `json:"Q"`
	R [][]float64 `json:"R"`
}

// MatrixProcessSuccessResponse representa la respuesta completa del endpoint /matrix/process.
type MatrixProcessSuccessResponse struct {
	QRFactorization QRFactorizationDoc       `json:"qr_factorization"`
	Statistics      MatrixStatisticsBundleDoc `json:"statistics"`
}
