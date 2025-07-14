# SWAPI Game - Full-Stack Application

This project is a full-stack card game application built with NestJS and Next.js, deployed on a serverless AWS architecture using the AWS CDK.

## Tech Stack 🚀

* **Frontend:** Next.js, React, TypeScript, MUI, Apollo Client
* **Backend:** NestJS, GraphQL, TypeScript
* **Infrastructure & Cloud:** AWS CDK, AWS S3, CloudFront, Lambda, AppSync, DynamoDB

---

## Prerequisites

Before you begin, ensure you have the following installed and configured:
* Node.js (v20.x or later)
* NPM or Yarn
* AWS CLI (configured with your credentials)
* Docker (must be running for the CDK to bundle assets)

---

## Local Development

1.  **Clone the repository**
    ```sh
    git clone <your-repo-url>
    cd <your-repo-folder>
    ```

2.  **Install dependencies** from the monorepo root:
    ```sh
    npm install
    ```

3.  **Run the Frontend:** This will start the Next.js development server.
    ```sh
    npx nx serve frontend
    ```
    The frontend will be available at `http://localhost:4200`.

4.  **Run the Backend:** This will start the NestJS development server.
    ```sh
    npx nx serve backend
    ```
    The GraphQL Playground will be available at `http://localhost:3000/graphql`.

**Note:** For local development, the frontend needs to be configured to point to your local backend. The backend will not be connected to the deployed DynamoDB tables unless you configure local AWS credentials.

---

## AWS Deployment 🚀

The entire stack (backend and frontend) is deployed using the AWS CDK.

1.  **Navigate to the infrastructure package:**
    ```sh
    cd apps/backend/infrastructure
    ```

2.  **Install CDK dependencies** (if you haven't already):
    ```sh
    npm install
    ```

3.  **Deploy the stack:**
    ```sh
    cdk deploy
    ```
    The CDK will build, package, and deploy all the necessary AWS resources, including the Lambda, DynamoDB tables, S3 bucket, and CloudFront distribution.

---

## Deployed Endpoints

After a successful `cdk deploy`, your application will be available at the following endpoints.

```
Outputs:
SwapiGameStack.CloudFrontDistributionUrl = [https://dsc6kpaja9jyz.cloudfront.net](https://dsc6kpaja9jyz.cloudfront.net)
SwapiGameStack.GraphQLApiUrl = [https://bfnmqs2jsfgvnh6eiip2vks2ue.appsync-api.eu-central-1.amazonaws.com/graphql](https://bfnmqs2jsfgvnh6eiip2vks2ue.appsync-api.eu-central-1.amazonaws.com/graphql)
SwapiGameStack.LambdaFunctionName = swapi-game-graphql-resolver
SwapiGameStack.PeopleTableName = swapi-game-people
SwapiGameStack.StarshipsTableName = swapi-game-starships
```

* **Frontend URL:** `https://dsc6kpaja9jyz.cloudfront.net`
* **Backend GraphQL Endpoint:** `https://bfnmqs2jsfgvnh6eiip2vks2ue.appsync-api.eu-central-1.amazonaws.com/graphql`

---

## Available Scripts

* `npx nx serve frontend`: Runs the frontend development server.
* `npx nx serve backend`: Runs the backend development server.
* `npx nx build frontend`: Creates a production build of the frontend app.
* `npx nx build backend`: Creates a production build of the backend app.
* `cdk deploy`: (From within `apps/backend/infrastructure`) Deploys the entire stack to AWS.
* `cdk destroy`: (From within `apps-backend/infrastructure`) Destroys the entire stack on AWS.