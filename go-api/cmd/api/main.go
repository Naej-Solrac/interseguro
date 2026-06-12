package main

import (
	"challenge-go/internal/adapters/handler"
	"challenge-go/internal/adapters/nodeclient"
	"challenge-go/internal/core/service"
	"log"
	"os"

	// _ "challenge-go/docs" // Importa los docs generados por swag (se descomenta después de swag init)

	jwtware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	fiberSwagger "github.com/swaggo/fiber-swagger"
)

// @title           Interseguro Matrix Processing API
// @version         1.0.0
// @description     API REST para autenticación JWT y procesamiento de matrices con factorización QR usando algoritmo Gram-Schmidt
// @termsOfService  http://swagger.io/terms/

// @contact.name   Interseguro API Support
// @contact.email  support@interseguro.com

// @license.name  MIT
// @license.url   https://opensource.org/licenses/MIT

// @host      localhost:8080
// @BasePath  /api/v1

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Token JWT con formato: Bearer {tu_token}
func main() {
	// 0. Cargar variables de entorno
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  No se encontró archivo .env, usando variables del sistema")
	}

	// 1. Inicializar Fiber
	app := fiber.New()

	// 1.1 Configurar CORS para permitir el frontend desplegado en S3
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://reto-interseguro-vue-jean-gonzales-001.s3-website-us-east-1.amazonaws.com",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
	}))

	// 2. Configuración desde variables de entorno
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("❌ JWT_SECRET no está configurado")
	}

	nodeServiceURL := os.Getenv("NODE_SERVICE_URL")
	if nodeServiceURL == "" {
		nodeServiceURL = "http://localhost:4000" // valor por defecto
	}

	adminUser := os.Getenv("ADMIN_USERNAME")
	adminPass := os.Getenv("ADMIN_PASSWORD")
	if adminUser == "" || adminPass == "" {
		log.Fatal("❌ ADMIN_USERNAME y ADMIN_PASSWORD deben estar configurados")
	}

	// 3. INYECCIÓN DE DEPENDENCIAS (Conectar los cables)
	// Adaptador Node -> Servicio -> Handler
	nodeAdapter := nodeclient.NewNodeAdapter(nodeServiceURL)
	myService := service.NewService(nodeAdapter)
	myHandler := handler.NewMatrixHandler(myService)
	loginHandler := handler.NewLoginHandler(jwtSecret, adminUser, adminPass)

	// 4. RUTA SWAGGER (Documentación)
	app.Get("/api-docs/*", fiberSwagger.WrapHandler)

	// 5. Grupo de rutas API v1
	api := app.Group("/api/v1")

	// 6. RUTAS PÚBLICAS (No requieren autenticación)
	api.Post("/auth/login", loginHandler)

	// 7. MIDDLEWARE JWT (Protege las rutas siguientes)
	api.Use(jwtware.New(jwtware.Config{
		SigningKey: jwtware.SigningKey{Key: []byte(jwtSecret)},
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			return c.Status(401).JSON(fiber.Map{"error": "Token inválido o expirado"})
		},
	}))

	// 8. RUTAS PROTEGIDAS (Requieren JWT)
	api.Post("/matrix/process", myHandler.Process)

	// 9. Arrancar
	log.Println("🚀 Go API corriendo en el puerto 8080")
	log.Println("📚 Swagger UI: http://localhost:8080/api-docs/index.html")
	log.Fatal(app.Listen(":8080"))
}
