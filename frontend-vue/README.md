# Frontend Vue (Interseguro Challenge)

Aplicacion web en Vue 3 que consume la Go API para:

- login con JWT
- envio de matriz para procesamiento QR
- visualizacion de estadisticas

## Stack

- Vue 3 + TypeScript
- Vite
- Pinia
- Axios
- Tailwind

## Requisitos

- Node.js 20+
- npm

## Configuracion

1. Crea el `.env` local:

```bash
cp .env.example .env
```

2. Define la URL de backend:

```env
VITE_GO_API_BASE_URL=http://localhost:8080/api/v1
```

Para cloud, usa el API Gateway de Go:

```env
VITE_GO_API_BASE_URL=https://<api-id>.execute-api.us-east-2.amazonaws.com/prod/api/v1
```

## Desarrollo

```bash
npm install
npm run dev
```

Por defecto queda en:

- http://localhost:5173

## Build

```bash
npm run build
```

La salida queda en `dist/`.

## Deploy en Vercel

- Root Directory: `frontend-vue`
- Framework: Vite
- Variable obligatoria en Vercel (Production y Preview):
	- `VITE_GO_API_BASE_URL`

## Flujo de login

El frontend envia `username` y `password` a:

- `POST /api/v1/auth/login`

Las credenciales validas son las configuradas en la Go API:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

## Problemas comunes

### CORS error en `/auth/login`

La Go API no esta permitiendo el origen del frontend. Revisa CORS en backend y redeploya Go.

### Login responde 401

Usuario/password no coinciden con `ADMIN_USERNAME` y `ADMIN_PASSWORD` del backend.

### Frontend pega a localhost en produccion

Falta configurar `VITE_GO_API_BASE_URL` en Vercel.
