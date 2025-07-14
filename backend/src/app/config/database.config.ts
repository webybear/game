import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DatabaseConfig {
  private readonly dynamoClient: DynamoDBClient;
  private readonly docClient: DynamoDBDocumentClient;
  
  public readonly peopleTableName: string;
  public readonly starshipsTableName: string;

  constructor() {
    // Initialize DynamoDB client
    this.dynamoClient = new DynamoDBClient({
      region: process.env.AWS_DEFAULT_REGION || 'eu-central-1',
    });
    
    this.docClient = DynamoDBDocumentClient.from(this.dynamoClient);
    
    // Table names from environment variables (set by CDK)
    this.peopleTableName = process.env.PEOPLE_TABLE_NAME || 'swapi-game-people';
    this.starshipsTableName = process.env.STARSHIPS_TABLE_NAME || 'swapi-game-starships';
  }

  /**
   * Get a single item from DynamoDB table
   */
  async getItem(tableName: string, key: Record<string, any>) {
    try {
      const command = new GetCommand({
        TableName: tableName,
        Key: key,
      });
      
      const result = await this.docClient.send(command);
      return result.Item;
    } catch (error) {
      console.error(`Error getting item from ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Put an item into DynamoDB table
   */
  async putItem(tableName: string, item: Record<string, any>) {
    try {
      const command = new PutCommand({
        TableName: tableName,
        Item: item,
      });
      
      await this.docClient.send(command);
      return item;
    } catch (error) {
      console.error(`Error putting item to ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Update an item in DynamoDB table
   */
  async updateItem(tableName: string, key: Record<string, any>, updateExpression: string, expressionAttributeNames?: Record<string, string>, expressionAttributeValues?: Record<string, any>) {
    try {
      const command = new UpdateCommand({
        TableName: tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      });
      
      const result = await this.docClient.send(command);
      return result.Attributes;
    } catch (error) {
      console.error(`Error updating item in ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Delete an item from DynamoDB table
   */
  async deleteItem(tableName: string, key: Record<string, any>) {
    try {
      const command = new DeleteCommand({
        TableName: tableName,
        Key: key,
      });
      
      await this.docClient.send(command);
      return key;
    } catch (error) {
      console.error(`Error deleting item from ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Scan all items from a table with optional pagination
   */
  async scanTable(tableName: string, limit?: number, lastEvaluatedKey?: Record<string, any>) {
    try {
      const command = new ScanCommand({
        TableName: tableName,
        Limit: limit,
        ExclusiveStartKey: lastEvaluatedKey,
      });
      
      const result = await this.docClient.send(command);
      return {
        items: result.Items || [],
        lastEvaluatedKey: result.LastEvaluatedKey,
        count: result.Count || 0,
      };
    } catch (error) {
      console.error(`Error scanning table ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Get random items from a table (used for game logic)
   */
  async getRandomItems(tableName: string, count = 2) {
    try {
      // First, scan to get all items
      const allItems = await this.scanTable(tableName);
      
      if (allItems.items.length < count) {
        throw new Error(`Not enough items in ${tableName}. Found ${allItems.items.length}, need ${count}`);
      }
      
      // Randomly select items
      const randomItems = [];
      const availableItems = [...allItems.items];
      
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * availableItems.length);
        randomItems.push(availableItems.splice(randomIndex, 1)[0]);
      }
      
      return randomItems;
    } catch (error) {
      console.error(`Error getting random items from ${tableName}:`, error);
      throw error;
    }
  }
} 