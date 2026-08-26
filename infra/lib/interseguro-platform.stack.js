"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterseguroPlatformStack = void 0;
const cdk = require("aws-cdk-lib");
const ecr = require("aws-cdk-lib/aws-ecr");
const lambda = require("aws-cdk-lib/aws-lambda");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const s3 = require("aws-cdk-lib/aws-s3");
const cloudfront = require("aws-cdk-lib/aws-cloudfront");
const origins = require("aws-cdk-lib/aws-cloudfront-origins");
const s3deploy = require("aws-cdk-lib/aws-s3-deployment");
class InterseguroPlatformStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const jwtSecret = new cdk.CfnParameter(this, 'JwtSecret', {
            type: 'String',
            noEcho: true,
            description: 'JWT secret usado por go-api',
        });
        const adminUsername = new cdk.CfnParameter(this, 'AdminUsername', {
            type: 'String',
            default: 'jean',
            description: 'Usuario admin del login de go-api',
        });
        const adminPassword = new cdk.CfnParameter(this, 'AdminPassword', {
            type: 'String',
            noEcho: true,
            description: 'Password admin del login de go-api',
        });
        const goImageTag = new cdk.CfnParameter(this, 'GoImageTag', {
            type: 'String',
            default: 'latest',
            description: 'Tag de imagen docker para go-api en ECR',
        });
        const nodeImageTag = new cdk.CfnParameter(this, 'NodeImageTag', {
            type: 'String',
            default: 'latest',
            description: 'Tag de imagen docker para node-api en ECR',
        });
        const goApiRepo = new ecr.Repository(this, 'GoApiRepository', {
            repositoryName: 'interseguro-go-api',
            imageScanOnPush: true,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
            lifecycleRules: [{ maxImageCount: 15 }],
        });
        const nodeApiRepo = new ecr.Repository(this, 'NodeApiRepository', {
            repositoryName: 'interseguro-node-api',
            imageScanOnPush: true,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
            lifecycleRules: [{ maxImageCount: 15 }],
        });
        const nodeApiLambda = new lambda.DockerImageFunction(this, 'NodeApiLambda', {
            functionName: 'interseguro-node-api',
            code: lambda.DockerImageCode.fromEcr(nodeApiRepo, {
                tagOrDigest: nodeImageTag.valueAsString,
            }),
            memorySize: 1024,
            timeout: cdk.Duration.seconds(30),
            architecture: lambda.Architecture.X86_64,
            environment: {
                NODE_ENV: 'production',
            },
        });
        const nodeApiGateway = new apigateway.LambdaRestApi(this, 'NodeApiGateway', {
            restApiName: 'interseguro-node-api-gateway',
            handler: nodeApiLambda,
            proxy: true,
            deployOptions: {
                stageName: 'prod',
            },
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: apigateway.Cors.ALL_METHODS,
            },
        });
        const nodeServiceBaseUrl = `${nodeApiGateway.url}api`;
        const goApiLambda = new lambda.DockerImageFunction(this, 'GoApiLambda', {
            functionName: 'interseguro-go-api',
            code: lambda.DockerImageCode.fromEcr(goApiRepo, {
                tagOrDigest: goImageTag.valueAsString,
            }),
            memorySize: 1024,
            timeout: cdk.Duration.seconds(30),
            architecture: lambda.Architecture.X86_64,
            environment: {
                NODE_SERVICE_URL: nodeServiceBaseUrl,
                JWT_SECRET: jwtSecret.valueAsString,
                ADMIN_USERNAME: adminUsername.valueAsString,
                ADMIN_PASSWORD: adminPassword.valueAsString,
            },
        });
        const goApiGateway = new apigateway.LambdaRestApi(this, 'GoApiGateway', {
            restApiName: 'interseguro-go-api-gateway',
            handler: goApiLambda,
            proxy: true,
            deployOptions: {
                stageName: 'prod',
            },
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: apigateway.Cors.ALL_METHODS,
                allowHeaders: ['Content-Type', 'Authorization'],
            },
        });
        const frontendBucket = new s3.Bucket(this, 'FrontendBucket', {
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            encryption: s3.BucketEncryption.S3_MANAGED,
            versioned: false,
            enforceSSL: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        const distribution = new cloudfront.Distribution(this, 'FrontendDistribution', {
            defaultBehavior: {
                origin: origins.S3BucketOrigin.withOriginAccessControl(frontendBucket),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
            defaultRootObject: 'index.html',
            errorResponses: [
                {
                    httpStatus: 403,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                    ttl: cdk.Duration.minutes(1),
                },
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                    ttl: cdk.Duration.minutes(1),
                },
            ],
        });
        new s3deploy.BucketDeployment(this, 'DeployFrontend', {
            sources: [s3deploy.Source.asset('../frontend-vue/dist')],
            destinationBucket: frontendBucket,
            distribution,
            distributionPaths: ['/*'],
            prune: true,
        });
        new cdk.CfnOutput(this, 'GoApiRepositoryUri', {
            value: goApiRepo.repositoryUri,
        });
        new cdk.CfnOutput(this, 'NodeApiRepositoryUri', {
            value: nodeApiRepo.repositoryUri,
        });
        new cdk.CfnOutput(this, 'GoApiGatewayUrl', {
            value: goApiGateway.url,
        });
        new cdk.CfnOutput(this, 'NodeApiGatewayUrl', {
            value: nodeApiGateway.url,
        });
        new cdk.CfnOutput(this, 'FrontendCloudFrontUrl', {
            value: `https://${distribution.distributionDomainName}`,
        });
    }
}
exports.InterseguroPlatformStack = InterseguroPlatformStack;
//# sourceMappingURL=interseguro-platform.stack.js.map