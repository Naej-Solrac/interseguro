package handler

import (
	"challenge-go/internal/adapters/handler/validation"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// NewLoginHandler crea un handler de login con la configuración inyectada.
//
// @Summary      Iniciar sesion
// @Description  Autentica un usuario con credenciales y retorna un token JWT valido por 24 horas. Ejemplo request: {"username":"jean","password":"password"}
// @Tags         Authentication
// @Accept       json
// @Produce      json
// @Param        credentials body validation.LoginRequest true "Credenciales del usuario (username y password)"
// @Success      200 {object} LoginSuccessResponse "Token JWT generado exitosamente"
// @Failure      400 {object} ErrorResponse "Formato JSON invalido o error de validacion"
// @Failure      401 {object} ErrorResponse "Credenciales incorrectas"
// @Failure      500 {object} ErrorResponse "Error interno al generar token"
// @Router       /auth/login [post]
func NewLoginHandler(jwtSecret, adminUser, adminPass string) fiber.Handler {
	validator := validation.NewValidator()
	return func(c *fiber.Ctx) error {
		var req validation.LoginRequest

		// 1. Parse del body
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Datos inválidos"})
		}

		// 2. Validación con go-playground/validator
		if err := validator.ValidateStruct(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": err.Error()})
		}

		// 3. Validación de credenciales (lógica de negocio)
		if req.Username == adminUser && req.Password == adminPass {
			// Crear token JWT
			token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
				"username": req.Username,
				"exp":      time.Now().Add(time.Hour * 24).Unix(),
			})

			tokenString, err := token.SignedString([]byte(jwtSecret))
			if err != nil {
				return c.Status(500).JSON(fiber.Map{"error": "Error al generar token"})
			}

			return c.JSON(fiber.Map{
				"token": tokenString,
			})
		}

		return c.Status(401).JSON(fiber.Map{"error": "Credenciales inválidas"})
	}
}
