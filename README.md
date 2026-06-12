# Challenge Interseguro

Solucion de desafio tecnico con arquitectura de microservicios:

- API principal en Go (Fiber): autenticacion JWT y factorizacion QR
- API secundaria en Node.js (Express + TypeScript): estadisticas de matrices
- Frontend en Vue 3 (Vite + Pinia + Axios)

## Arquitectura

Flujo principal:

Cliente -> Go API -> Node API -> Respuesta (QR + estadisticas)

- Go API expone endpoints publicos
- Node API se usa como servicio interno para calculo adicional
- Frontend consume la Go API (login + procesamiento)

## Estructura del repositorio

```text
.
|- go-api/
|- node-api/
|- frontend-vue/
|- docker-compose.yml
|- README.md
`- docs/
```

## Endpoints principales

### Go API (puerto 8080)

- `POST /api/v1/auth/login`
- `POST /api/v1/matrix/process` (requiere JWT)

Swagger local:

- `http://localhost:8080/api-docs/index.html`

### Node API (puerto 3000)

- `POST /api/stats`

Swagger local:

- `http://localhost:3000/api-docs`

## Ejecucion local

### Opcion 1: Docker Compose (recomendada)

```bash
docker compose up --build
```

Servicios:

- Go API: `http://localhost:8080`
- Node API: `http://localhost:3000`

### Opcion 2: Manual

Node API:

```bash
cd node-api
npm install
npm run dev
```

Go API:

```bash
cd go-api
go mod tidy
go run cmd/api/main.go
```

Variables en `go-api/.env`:

```env
JWT_SECRET=***
ADMIN_USERNAME=***
ADMIN_PASSWORD=***
NODE_SERVICE_URL=http://localhost:3000/api
```

## Frontend Vue 3

```bash
cd frontend-vue
npm install
npm run dev
```

Variables:

- Revisar `frontend-vue/.env.example`
- Definir `VITE_GO_API_BASE_URL` apuntando a la Go API activa

## Tests

Node:

```bash
cd node-api
npm test
```

Go:

```bash
cd go-api
go test ./...
```

## Despliegue en AWS (resumen)

Se uso ECR + ECS Fargate para backend y S3 para frontend estatico.

Resumen completo y comandos en:

- [docs/DEPLOY_AWS.md](docs/DEPLOY_AWS.md)


## Stack

- Go + Fiber
- Node.js + Express + TypeScript
- Vue 3 + Pinia + Axios + Tailwind
- Docker / Docker Compose
- AWS ECR / ECS Fargate / S3

Proyecto desarrollado para postulacion tecnica.
