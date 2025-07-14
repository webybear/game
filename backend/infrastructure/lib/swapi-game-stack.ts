import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as path from 'path';
import { Fn } from 'aws-cdk-lib'; // <-- Add this
import { Construct } from 'constructs';

export class SwapiGameStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ============================================
    // DynamoDB Tables
    // ============================================

    // People table
    const peopleTable = new dynamodb.Table(this, 'PeopleTable', {
      tableName: 'swapi-game-people',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development
      pointInTimeRecovery: true,
    });

    // Starships table
    const starshipsTable = new dynamodb.Table(this, 'StarshipsTable', {
      tableName: 'swapi-game-starships',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development
      pointInTimeRecovery: true,
    });

    // ============================================
    // Lambda Functions
    // ============================================

    const backendRoot = path.join(__dirname, '../../'); // The root of the backend project

    const graphqlLambda = new lambda.Function(this, 'GraphqlLambda', {
      functionName: 'swapi-game-graphql-resolver',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'lambda.handler',
      code: lambda.Code.fromAsset(backendRoot, {
        exclude: [
          'dist',
          'node_modules',
          'cdk.out',
          '.DS_Store',
          '*.spec.ts',
          '*.test.ts',
          'jest.config.ts',
          'README.md',
          'infrastructure',
        ],
        bundling: {
          image: lambda.Runtime.NODEJS_20_X.bundlingImage,
          environment: {
            NODE_ENV: 'development',
          },
          command: [
            'bash',
            '-c',
            [
              // 1. Clean up node_modules and package-lock.json from previous runs within the Docker context
              'echo "Cleaning up backend node_modules for fresh install..."',
              'rm -rf node_modules',
              'rm -f package-lock.json',

              // 2. Install all dependencies (prod and dev) to get `tsc` for building.
              'echo "Installing all backend dependencies..."',
              'npm install --cache /tmp/npm-cache',

              // 3. Run the build script defined in backend/package.json.
              'echo "Building backend application..."',
              'npm run build',

              // 4. Copy the compiled code to the final asset directory.
              'echo "Copying compiled backend code to /asset-output..."',
              'cp -r dist/. /asset-output/',

              // 5. Copy package files to asset dir.
              'echo "Copying backend package files to /asset-output..."',
              'cp package.json package-lock.json /asset-output/',

              // 6. Change to asset dir and install ONLY production dependencies.
              'echo "Installing production dependencies in /asset-output..."',
              'cd /asset-output && npm install --omit=dev --cache /tmp/npm-cache',
            ].join(' && '),
          ],
        },
      }),
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      environment: {
        PEOPLE_TABLE_NAME: peopleTable.tableName,
        STARSHIPS_TABLE_NAME: starshipsTable.tableName,
        NODE_ENV: 'production', // Lambda should run in production mode
      },
    });

    peopleTable.grantReadWriteData(graphqlLambda);
    starshipsTable.grantReadWriteData(graphqlLambda);

    // ============================================
    // AppSync GraphQL API
    // ============================================

    const api = new appsync.GraphqlApi(this, 'SwapiGameApi', {
      name: 'swapi-game-api',
      definition: appsync.Definition.fromFile(
        path.join(__dirname, '../../src/app/schema.graphql'),
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
      xrayEnabled: true,
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
    });

    // Create Lambda data source
    const lambdaDataSource = api.addLambdaDataSource(
      'LambdaDataSource',
      graphqlLambda,
      {
        name: 'GraphQLLambdaDataSource',
        description: 'Lambda data source for GraphQL resolvers',
      },
    );

    lambdaDataSource.createResolver('GetRandomPairResolver', { typeName: 'Query', fieldName: 'getRandomPair', });
    lambdaDataSource.createResolver('GetPersonResolver', { typeName: 'Query', fieldName: 'getPerson', });
    lambdaDataSource.createResolver('GetStarshipResolver', { typeName: 'Query', fieldName: 'getStarship', });
    lambdaDataSource.createResolver('ListPeopleResolver', { typeName: 'Query', fieldName: 'listPeople', });
    lambdaDataSource.createResolver('ListStarshipsResolver', { typeName: 'Query', fieldName: 'listStarships', });
    lambdaDataSource.createResolver('CreatePersonResolver', { typeName: 'Mutation', fieldName: 'createPerson', });
    lambdaDataSource.createResolver('UpdatePersonResolver', { typeName: 'Mutation', fieldName: 'updatePerson', });
    lambdaDataSource.createResolver('DeletePersonResolver', { typeName: 'Mutation', fieldName: 'deletePerson', });
    lambdaDataSource.createResolver('CreateStarshipResolver', { typeName: 'Mutation', fieldName: 'createStarship', });
    lambdaDataSource.createResolver('UpdateStarshipResolver', { typeName: 'Mutation', fieldName: 'updateStarship', });
    lambdaDataSource.createResolver('DeleteStarshipResolver', { typeName: 'Mutation', fieldName: 'deleteStarship', });
    lambdaDataSource.createResolver('SeedDatabaseResolver', { typeName: 'Mutation', fieldName: 'seedDatabase', });
    lambdaDataSource.createResolver('GameStatsResolver', { typeName: 'Query', fieldName: 'gameStats', });

    // ============================================
    // Frontend Infrastructure (S3 + CloudFront)
    // ============================================

    const monorepoRoot = path.join(__dirname, '../../../');

    // S3 Bucket for frontend hosting
    const hostingBucket = new s3.Bucket(this, 'FrontendHostingBucket', {
      bucketName: `swapi-game-frontend-hosting-${this.account}`,
      publicReadAccess: false, // We will use CloudFront OAI
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development
      autoDeleteObjects: true, // For development
    });

    // CloudFront Origin Access Identity
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OAI', {
      comment: 'OAI for SWAPI Game frontend bucket',
    });
    hostingBucket.grantRead(originAccessIdentity);


    // CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, 'CloudFrontDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new origins.S3Origin(hostingBucket, { originAccessIdentity }),
        compress: true,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      },
      // Route API calls to AppSync
      additionalBehaviors: {
        '/graphql': {
          origin: new origins.HttpOrigin(Fn.select(0, Fn.split('/', Fn.select(1, Fn.split('://', api.graphqlUrl)))), {
          protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
          customHeaders: {
            'x-api-key': api.apiKey || '',
          },
        }),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        },
      },
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // Use a cost-effective price class
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    // S3 Bucket Deployment
    new s3deploy.BucketDeployment(this, 'DeployFrontend', {
      sources: [s3deploy.Source.asset(monorepoRoot, {
        exclude: [
          '**/node_modules/**',
          '**/cdk.out/**',
          '**/dist/**',
          '.git',
        ],
        bundling: {
          image: cdk.DockerImage.fromRegistry('node:20'),
          user: 'root', // Ensure 'root' to have full permissions for cleanup and install
          environment: {
              // For the build process itself
              NODE_OPTIONS: '--max-old-space-size=8192',
              
              // For the Next.js application code
              NEXT_PUBLIC_APPSYNC_API_URL: api.graphqlUrl,
              NEXT_PUBLIC_APPSYNC_API_KEY: api.apiKey || '',
            },
          command: [
            'bash',
            '-c',
            [
              // 1. Clean up existing node_modules and package-lock.json at the monorepo root
              'echo "Cleaning up monorepo root node_modules for fresh install..."',
              'rm -rf node_modules',
              'rm -f package-lock.json',

              // 2. Install all monorepo dependencies from the root
              'echo "Installing monorepo dependencies..."',
              'npm install --cache /tmp/npm-cache',

              // 3. Change to the frontend directory and run the build
              'echo "Building frontend application..."',
              'cd frontend && npm run build',

              // 4. Copy the exported static site from the 'out' directory to /asset-output/
              'echo "Copying frontend build output to /asset-output..." && cp -r out/. /asset-output/'
            ].join(' && '),
          ],
        },
      })],
      destinationBucket: hostingBucket,
      distribution: distribution,
      distributionPaths: ['/*'], // Invalidate CloudFront cache on deployment
    });

    // ============================================
    // Outputs
    // ============================================

    new cdk.CfnOutput(this, 'CloudFrontDistributionDomain', {
      value: distribution.distributionDomainName,
      description: 'CloudFront Distribution Domain Name',
    });

    new cdk.CfnOutput(this, 'GraphQLApiUrl', {
      value: api.graphqlUrl,
      description: 'GraphQL API URL',
    });

    new cdk.CfnOutput(this, this.node.id + 'GraphQLApiId', { // Adjusted to make unique output ID
      value: api.apiId,
      description: 'GraphQL API ID',
    });

    new cdk.CfnOutput(this, this.node.id + 'GraphQLApiKey', { // Adjusted to make unique output ID
      value: api.apiKey || 'No API Key',
      description: 'GraphQL API Key',
    });

    new cdk.CfnOutput(this, 'PeopleTableName', {
      value: peopleTable.tableName,
      description: 'DynamoDB People Table Name',
    });

    new cdk.CfnOutput(this, 'StarshipsTableName', {
      value: starshipsTable.tableName,
      description: 'DynamoDB Starships Table Name',
    });

    new cdk.CfnOutput(this, 'LambdaFunctionName', {
      value: graphqlLambda.functionName,
      description: 'Lambda Function Name',
    });

    new cdk.CfnOutput(this, this.node.id + 'CloudFrontDistributionUrl', { // Adjusted to make unique output ID
      value: `https://${distribution.distributionDomainName}`,
      description: 'The domain name of the CloudFront distribution for the frontend',
    });
  }
}