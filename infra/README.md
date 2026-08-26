# Infraestructura AWS (CDK)

Este directorio contiene la infraestructura para backend serverless:

- 2 repositorios ECR (`interseguro-go-api`, `interseguro-node-api`)
- 2 Lambdas con imagen Docker (`interseguro-go-api`, `interseguro-node-api`)
- API Gateway para exponer endpoints publicos

Stack actual:

- `InterseguroPlatformStack`

## Requisitos

- Node.js 20+
- AWS CLI autenticado
- Docker con buildx
- CDK bootstrap en la cuenta/region destino

## Variables usadas en comandos

```bash
export ACCOUNT_ID=889052531878
export AWS_REGION=us-east-2
export IMAGE_TAG=v$(date +%Y%m%d-%H%M%S)
```

## 1) Preparar CDK

```bash
cd infra
npm install
npm run build
npx cdk bootstrap aws://$ACCOUNT_ID/$AWS_REGION
```

## 2) Login a ECR

```bash
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
```

## 3) Build + push de imagenes

### Go API

```bash
cd ..
docker buildx build \
  --platform linux/amd64 \
  --provenance=false \
  --sbom=false \
  -t $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/interseguro-go-api:$IMAGE_TAG \
  -f go-api/dockerfile \
  go-api \
  --push
```

### Node API

```bash
docker buildx build \
  --platform linux/amd64 \
  --provenance=false \
  --sbom=false \
  -t $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/interseguro-node-api:$IMAGE_TAG \
  -f node-api/dockerfile \
  node-api \
  --push
```

## 4) Deploy completo por CDK

```bash
cd infra
npx cdk deploy InterseguroPlatformStack \
  --require-approval never \
  --parameters JwtSecret='tu_jwt_secret' \
  --parameters AdminUsername='jean' \
  --parameters AdminPassword='password' \
  --parameters GoImageTag=$IMAGE_TAG \
  --parameters NodeImageTag=$IMAGE_TAG
```

## 5) Actualizar solo Go Lambda (sin tocar Node)

Cuando solo cambia Go, actualiza solo su imagen:

```bash
cd ..
aws lambda update-function-code \
  --function-name interseguro-go-api \
  --image-uri $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/interseguro-go-api:$IMAGE_TAG \
  --region $AWS_REGION

aws lambda wait function-updated \
  --function-name interseguro-go-api \
  --region $AWS_REGION
```

## Validacion post-deploy

```bash
curl -i -X POST "https://<go-api-id>.execute-api.$AWS_REGION.amazonaws.com/prod/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"jean","password":"password"}'
```

## Troubleshooting

### `Runtime.InvalidEntrypoint` en Go Lambda

La imagen no arranca en Lambda. Revisa `go-api/dockerfile` y redeploya imagen.

### `Resource ... already exists` en CDK

Estan chocando nombres con recursos existentes creados por otro stack. En ese caso, usa `aws lambda update-function-code` para actualizar solo imagen.

### `502 Internal server error` en API Gateway

Inspecciona logs:

```bash
aws logs tail /aws/lambda/interseguro-go-api --region $AWS_REGION --since 30m
```
