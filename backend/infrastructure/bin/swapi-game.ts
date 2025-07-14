#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SwapiGameStack } from '../lib/swapi-game-stack';

const app = new cdk.App();

// Create the main stack
new SwapiGameStack(app, 'SwapiGameStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.AWS_DEFAULT_REGION || 'eu-central-1',
  },
  description: 'Star Wars Game Application - GraphQL API with DynamoDB and Lambda',
  tags: {
    Project: 'SwapiGame',
    Environment: process.env.NODE_ENV || 'development',
    Owner: 'SwapiGameTeam',
  },
});

app.synth(); 