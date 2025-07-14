# Star Wars Game - AWS Infrastructure

This directory contains the AWS CDK (Cloud Development Kit) infrastructure for the Star Wars Game application. The infrastructure is defined as code using TypeScript and provisions all necessary AWS resources.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   AppSync       │    │   Lambda        │
│   (Next.js)     │◄──►│   GraphQL API   │◄──►│   (NestJS)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                │                        ▼
                                │               ┌─────────────────┐
                                │               │   DynamoDB      │
                                │               │   Tables        │
                                │               │   • People      │
                                │               │   • Starships   │
                                │               └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   CloudWatch    │
                       │   Logs & X-Ray  │
                       └─────────────────┘
```

## 📦 AWS Resources Created

### 1. **DynamoDB Tables**
- **People Table**: Stores Star Wars characters with attributes like name, mass, height, etc.
- **Starships Table**: Stores Star Wars starships with attributes like name, crew, model, etc.
- Both tables use pay-per-request billing for cost optimization

### 2. **AWS Lambda**
- **GraphQL Resolver Function**: Runs the NestJS application in serverless mode
- **Runtime**: Node.js 20.x (ARM64 for better performance/cost)
- **Memory**: 512MB
- **Timeout**: 30 seconds

### 3. **AWS AppSync**
- **GraphQL API**: Managed GraphQL service that handles all API requests
- **Authentication**: API Key (can be extended to Cognito, IAM, etc.)
- **Logging**: CloudWatch integration with X-Ray tracing
- **Schema**: Auto-generated from the GraphQL schema file

### 4. **IAM Roles & Policies**
- Lambda execution role with DynamoDB read/write permissions
- AppSync service role for Lambda invocation
- Least privilege access patterns

## 🚀 Prerequisites

1. **AWS CLI** configured with appropriate credentials
2. **AWS CDK** installed globally: `npm install -g aws-cdk`
3. **Node.js** 18+ and npm
4. **Docker** (for Lambda bundling)

## 📋 Setup Instructions

### 1. Install Dependencies
```bash
# From the root of the project
npm run infrastructure:install
```

### 2. Bootstrap CDK (First time only)
```bash
# This sets up CDK in your AWS account
npm run cdk:bootstrap
```

### 3. Build the Infrastructure
```bash
npm run infrastructure:build
```

### 4. Preview Changes
```bash
npm run cdk:diff
```

### 5. Deploy to AWS
```bash
npm run cdk:deploy
```

## 🔧 Available Scripts

From the root directory:

- `npm run cdk:deploy` - Deploy the infrastructure
- `npm run cdk:destroy` - Remove all AWS resources
- `npm run cdk:diff` - Show differences between local and deployed
- `npm run cdk:synth` - Generate CloudFormation template
- `npm run cdk:bootstrap` - Bootstrap CDK in your AWS account
- `npm run infrastructure:install` - Install infrastructure dependencies
- `npm run infrastructure:build` - Build the CDK project

## 🌍 Environment Configuration

The stack can be customized through environment variables:

```bash
# Set AWS region (default: us-east-1)
export CDK_DEFAULT_REGION=us-west-2

# Set AWS account (auto-detected if not set)
export CDK_DEFAULT_ACCOUNT=123456789012

# Set environment name for resource naming
export NODE_ENV=development
```

## 📊 Outputs

After deployment, you'll receive the following outputs:

- **GraphQL API URL**: The endpoint for your GraphQL API
- **API Key**: Authentication key for API access
- **Table Names**: DynamoDB table names for reference
- **Lambda Function Name**: For monitoring and debugging

## 🔍 Monitoring & Debugging

### CloudWatch Logs
- Lambda logs: `/aws/lambda/swapi-game-graphql-resolver`
- AppSync logs: `/aws/appsync/apis/{api-id}`

### X-Ray Tracing
- Distributed tracing is enabled for performance monitoring
- Access through AWS X-Ray console

### Local Development
```bash
# Test the CDK synthesis
npm run cdk:synth

# Watch for changes
npm run watch
```

## 🧪 Testing

```bash
# Run infrastructure tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🔒 Security Features

- **API Key Authentication** with 1-year expiration
- **IAM Roles** with minimal required permissions
- **VPC** support (can be enabled for production)
- **Encryption** at rest for DynamoDB tables
- **CloudWatch** monitoring and alerting

## 💰 Cost Optimization

- **Serverless Architecture**: Pay only for what you use
- **ARM64 Lambda**: Better price-performance ratio
- **DynamoDB On-Demand**: No pre-provisioning required
- **CloudWatch Log Retention**: Automatic cleanup to control costs

## 🚨 Cleanup

To avoid ongoing AWS charges:

```bash
npm run cdk:destroy
```

This will remove all created resources except:
- CloudWatch logs (manually delete if needed)
- CDK bootstrap resources (shared across projects)

## 📞 Support

For issues with the infrastructure:
1. Check CloudWatch logs for errors
2. Verify AWS credentials and permissions
3. Ensure all dependencies are installed
4. Review the CDK diff before deploying changes

## 🔄 CI/CD Integration

This infrastructure is ready for CI/CD pipelines:

```yaml
# Example GitHub Actions step
- name: Deploy Infrastructure
  run: |
    npm run infrastructure:install
    npm run infrastructure:build
    npm run cdk:deploy --require-approval never
``` 